/* ==========================================================================
   CELESTIA — интерактивность сайта
   ========================================================================== */
(function(){
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Утилиты
  ---------------------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function formatSum(n){
    return n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' сум';
  }
  function formatDuration(min){
    if (min < 60) return `${min} мин`;
    const h = Math.floor(min / 60), m = min % 60;
    return m ? `${h} ч ${m} мин` : `${h} ч`;
  }
  function hashStr(str){
    let h = 0;
    for (let i = 0; i < str.length; i++){ h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return Math.abs(h);
  }
  function seededRandom(seed){
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  function pluralRu(n, one, few, many){
    const mod10 = n % 10, mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 14) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
  }
  const DOW = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  const MON = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];

  /* ----------------------------------------------------------------------
     Toast
  ---------------------------------------------------------------------- */
  const toastStack = $('#toastStack');
  function showToast(message, type){
    const el = document.createElement('div');
    el.className = 'toast is-' + (type || 'success');
    el.textContent = message;
    toastStack.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 320);
    }, 3600);
  }

  /* ----------------------------------------------------------------------
     Preloader
  ---------------------------------------------------------------------- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader').classList.add('is-hidden'), 350);
  });
  // safety fallback in case 'load' is delayed
  setTimeout(() => $('#preloader') && $('#preloader').classList.add('is-hidden'), 2500);

  /* ----------------------------------------------------------------------
     Бизнес-данные -> DOM
  ---------------------------------------------------------------------- */
  function injectBusinessInfo(){
    $$('[data-social="instagram"]').forEach(a => a.href = BUSINESS.instagram);
    $$('[data-social="telegram"]').forEach(a => a.href = BUSINESS.telegram);
    $$('[data-social="whatsapp"]').forEach(a => a.href = BUSINESS.whatsapp);

    const phoneHref = 'tel:' + BUSINESS.phoneHref;
    const headerPhone = $('#headerPhone');
    headerPhone.href = phoneHref;
    headerPhone.querySelector('span').textContent = BUSINESS.phoneDisplay;

    $('#contactAddress').textContent = BUSINESS.address;
    $('#contactHours').textContent = BUSINESS.hours;
    const contactPhone = $('#contactPhoneLink');
    contactPhone.href = phoneHref;
    contactPhone.textContent = BUSINESS.phoneDisplay;

    $('#mapAddress').textContent = BUSINESS.address;
    $('#mapOpenLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(BUSINESS.mapQuery);

    $('#footerAddress').textContent = BUSINESS.address;
    const footerPhone = $('#footerPhone');
    footerPhone.href = phoneHref;
    footerPhone.textContent = BUSINESS.phoneDisplay;
    $('#footerHours').textContent = BUSINESS.hours;
    $('#footerYear').textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------------
     Header / мобильное меню
  ---------------------------------------------------------------------- */
  function initHeader(){
    const header = $('#header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const mobileNav = $('#mobileNav');
    const backdrop = $('#mobileNavBackdrop');
    const burgerBtn = $('#burgerBtn');
    const closeBtn = $('#mobileNavClose');

    function openNav(){
      mobileNav.classList.add('is-open');
      backdrop.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      burgerBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }
    function closeNav(){
      mobileNav.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
    burgerBtn.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);
    backdrop.addEventListener('click', closeNav);
    $$('.mobile-nav a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
  ---------------------------------------------------------------------- */
  function initReveal(){
    const targets = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion){
      targets.forEach(t => t.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(t => io.observe(t));
  }

  /* ----------------------------------------------------------------------
     Счётчики статистики
  ---------------------------------------------------------------------- */
  function initCounters(){
    const nums = $$('.stat__num');
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimal = parseInt(el.dataset.decimal || '0', 10);
      const divisor = decimal ? Math.pow(10, decimal) : 1;
      const finalVal = target / divisor;
      const duration = 1400;
      const start = performance.now();
      function tick(now){
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = finalVal * eased;
        el.textContent = decimal ? val.toFixed(decimal) : Math.round(val).toLocaleString('ru-RU');
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = decimal ? finalVal.toFixed(decimal) : Math.round(finalVal).toLocaleString('ru-RU');
      }
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)){ nums.forEach(animate); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){ animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(n => io.observe(n));
  }

  /* ----------------------------------------------------------------------
     Hero canvas — плавающие частицы (блики / волоски)
  ---------------------------------------------------------------------- */
  function initHeroCanvas(){
    const canvas = $('#heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const COUNT = reduceMotion ? 0 : (window.innerWidth < 720 ? 26 : 55);

    function resize(){
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function makeParticle(){
      const isStrand = Math.random() < 0.4;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: isStrand ? (1 + Math.random() * 1.4) : (0.6 + Math.random() * 1.6),
        len: isStrand ? 10 + Math.random() * 18 : 0,
        angle: Math.random() * Math.PI * 2,
        speedY: 0.12 + Math.random() * 0.35,
        speedX: (Math.random() - 0.5) * 0.25,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.004 + Math.random() * 0.01,
        opacity: 0.15 + Math.random() * 0.35,
        isStrand,
      };
    }

    function init(){
      resize();
      particles = Array.from({ length: COUNT }, makeParticle);
    }

    function draw(){
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.drift += p.driftSpeed;
        p.x += p.speedX + Math.sin(p.drift) * 0.15;
        if (p.y < -20){ p.y = h + 20; p.x = Math.random() * w; }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.strokeStyle = '#e8c584';
        ctx.fillStyle = '#e8c584';
        if (p.isStrand){
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle + Math.sin(p.drift) * 0.3);
          ctx.lineWidth = p.r * 0.7;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(p.len * 0.3, p.len * 0.2, p.len * 0.6, p.len);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    let raf;
    init();
    if (!reduceMotion) raf = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, w, h);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); }, 200);
    });
  }

  /* ----------------------------------------------------------------------
     Услуги — рендер + фильтр
  ---------------------------------------------------------------------- */
  const selectedServiceIds = new Set();

  function serviceIcon(iconName){
    const map = {
      scissors: 'i-scissors', fade: 'i-comb', wolf: 'i-wolf', crop: 'i-crop', korean: 'i-korean',
      anime: 'i-anime', bald: 'i-bald', kids: 'i-kids', beard: 'i-beard', razor: 'i-razor',
      'beard-hot': 'i-beard-hot', color: 'i-color', wash: 'i-wash', facial: 'i-facial', combo: 'i-combo',
    };
    return map[iconName] || 'i-scissors';
  }

  function renderServiceTabs(){
    const wrap = $('#serviceTabs');
    wrap.innerHTML = SERVICE_CATEGORIES.map((c, i) =>
      `<button class="tab${i === 0 ? ' is-active' : ''}" data-cat="${c.id}" role="tab" aria-selected="${i === 0}">${c.label}</button>`
    ).join('');
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if (!btn) return;
      $$('.tab', wrap).forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      renderServices(btn.dataset.cat);
    });
  }

  function serviceCardHTML(s){
    return `
      <article class="service-card" data-id="${s.id}">
        ${s.badge ? `<span class="service-card__badge">${s.badge}</span>` : ''}
        <div class="service-card__icon"><svg class="icon"><use href="#${serviceIcon(s.icon)}"/></svg></div>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <div class="service-card__foot">
          <div class="service-card__meta">
            <span class="service-card__price">${formatSum(s.price)}</span>
            <span class="service-card__duration">${formatDuration(s.duration)}</span>
          </div>
          <button type="button" class="service-card__pick${selectedServiceIds.has(s.id) ? ' is-picked' : ''}" data-pick="${s.id}" aria-label="${selectedServiceIds.has(s.id) ? 'Убрать' : 'Выбрать'} услугу ${s.name}">
            <svg class="icon"><use href="#${selectedServiceIds.has(s.id) ? 'i-check' : 'i-arrow-right'}"/></svg>
          </button>
        </div>
      </article>`;
  }

  function renderServices(filter){
    const grid = $('#servicesGrid');
    const list = (!filter || filter === 'all') ? SERVICES : SERVICES.filter(s => s.category === filter);
    grid.innerHTML = list.map(serviceCardHTML).join('');
  }

  function initServices(){
    renderServiceTabs();
    renderServices('all');
    $('#servicesGrid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pick]');
      if (!btn) return;
      const id = btn.dataset.pick;
      toggleService(id);
      const svc = SERVICES.find(s => s.id === id);
      showToast(selectedServiceIds.has(id) ? `«${svc.name}» добавлена в запись` : `«${svc.name}» убрана из записи`);
      const activeTab = $('.tab.is-active', $('#serviceTabs'));
      renderServices(activeTab ? activeTab.dataset.cat : 'all');
      renderBookingServices();
      updateBookingTotal();
    });
  }

  function toggleService(id){
    if (selectedServiceIds.has(id)) selectedServiceIds.delete(id);
    else selectedServiceIds.add(id);
  }

  /* ----------------------------------------------------------------------
     Мастера
  ---------------------------------------------------------------------- */
  let selectedBarberId = null;

  function initials(name){
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  function barberCardHTML(b){
    return `
      <article class="barber-card${selectedBarberId === b.id ? ' is-selected' : ''}" data-id="${b.id}">
        <div class="barber-card__avatar"><div class="barber-card__avatar-inner">${initials(b.name)}</div></div>
        <h3>${b.name}</h3>
        <span class="barber-card__role">${b.role}</span>
        <div class="barber-card__rating"><svg class="icon"><use href="#i-star"/></svg>${b.rating.toFixed(1)} · ${b.experience} ${pluralRu(b.experience, 'год', 'года', 'лет')} опыта</div>
        <div class="barber-card__tags">${b.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <button type="button" class="barber-card__pick" data-pick-barber="${b.id}">${selectedBarberId === b.id ? 'Выбран для записи' : 'Выбрать мастера'}</button>
      </article>`;
  }

  function renderBarbers(){
    $('#barbersGrid').innerHTML = BARBERS.map(barberCardHTML).join('');
  }

  function initBarbers(){
    renderBarbers();
    $('#barbersGrid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pick-barber]');
      const card = e.target.closest('.barber-card');
      if (!btn && !card) return;
      const id = (btn && btn.dataset.pickBarber) || card.dataset.id;
      selectedBarberId = id;
      renderBarbers();
      renderBookingBarbers();
      const b = BARBERS.find(x => x.id === id);
      showToast(`Мастер «${b.name}» выбран для записи`);
    });
  }

  /* ----------------------------------------------------------------------
     Живая очередь
  ---------------------------------------------------------------------- */
  const CLIENT_NAMES = ['Бекзод', 'Отабек', 'Диёр', 'Хондамир', 'Умид', 'Комрон', 'Рустам', 'Элёр', 'Шохрух'];
  let queueState = [];

  function initQueueState(){
    queueState = BARBERS.map((b, i) => {
      const busy = seededRandom(hashStr(b.id) + Date.now() / 100000) > 0.28;
      return {
        barberId: b.id,
        busy,
        clientName: busy ? CLIENT_NAMES[(hashStr(b.id) + i) % CLIENT_NAMES.length] : null,
        remaining: busy ? 6 + Math.floor(Math.random() * 20) : 0,
        total: busy ? 25 : 0,
        waiting: Math.floor(Math.random() * 3),
      };
    });
  }

  function queueCardHTML(q, barber){
    const pct = q.busy ? Math.max(4, Math.round(((q.total - q.remaining) / q.total) * 100)) : 100;
    return `
      <div class="queue-card" data-barber="${q.barberId}">
        <div class="queue-card__head">
          <div class="queue-card__avatar">${initials(barber.name)}</div>
          <div>
            <div class="queue-card__name">${barber.name}</div>
            <div class="queue-card__status"><span class="pulse${q.busy ? ' is-busy' : ''}"></span>${q.busy ? `стрижёт клиента` : 'свободен сейчас'}</div>
          </div>
        </div>
        <div class="queue-card__bar"><span style="width:${pct}%"></span></div>
        <div class="queue-card__foot">
          <span>${q.busy ? `Освободится через <b>~${q.remaining} мин</b>` : '<b>Можно зайти прямо сейчас</b>'}</span>
          <span>В очереди: <b>${q.waiting}</b></span>
        </div>
      </div>`;
  }

  function renderQueue(){
    const grid = $('#queueGrid');
    if (!grid) return;
    grid.innerHTML = queueState.map(q => queueCardHTML(q, BARBERS.find(b => b.id === q.barberId))).join('');
    updateHeroQueue();
  }

  function updateHeroQueue(){
    const totalWaiting = queueState.reduce((sum, q) => sum + q.waiting + (q.busy ? 1 : 0), 0);
    $('#heroQueueCount').textContent = `${totalWaiting} ${pluralRu(totalWaiting, 'клиент', 'клиента', 'клиентов')}`;
    const soonest = queueState.filter(q => q.busy).sort((a, b) => a.remaining - b.remaining)[0];
    const now = new Date();
    const minutesAhead = soonest ? soonest.remaining : 5;
    const slot = new Date(now.getTime() + minutesAhead * 60000);
    $('#heroNextSlot').textContent = slot.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  function tickQueue(){
    queueState.forEach(q => {
      if (q.busy){
        q.remaining -= 1 + Math.floor(Math.random() * 2);
        if (q.remaining <= 0){
          if (Math.random() < 0.75){
            q.total = 20 + Math.floor(Math.random() * 25);
            q.remaining = q.total;
            q.clientName = CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)];
          } else {
            q.busy = false; q.remaining = 0; q.total = 0;
          }
        }
      } else if (Math.random() < 0.3){
        q.busy = true; q.total = 20 + Math.floor(Math.random() * 25); q.remaining = q.total;
      }
      q.waiting = Math.max(0, Math.min(4, q.waiting + (Math.random() < 0.5 ? -1 : 1)));
    });
    renderQueue();
  }

  function initQueue(){
    initQueueState();
    renderQueue();
    setInterval(tickQueue, 5000);
  }

  /* ----------------------------------------------------------------------
     Бронирование — мастер состояния
  ---------------------------------------------------------------------- */
  const booking = {
    step: 1,
    barberId: null,
    date: null, // 'YYYY-MM-DD'
    time: null,
    name: '',
    phone: '',
    comment: '',
  };
  const TOTAL_STEPS = 6;

  function buildDates(){
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++){
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }
  function dateKey(d){
    return d.toISOString().slice(0, 10);
  }

  function renderBookingBarbers(){
    const wrap = $('#bookingBarbers');
    wrap.innerHTML = BARBERS.map(b => `
      <div class="mini-barber${booking.barberId === b.id ? ' is-selected' : ''}" data-id="${b.id}">
        <span class="check-badge"><svg class="icon"><use href="#i-check"/></svg></span>
        <div class="mini-barber__avatar"><div class="mini-barber__avatar-inner">${initials(b.name)}</div></div>
        <div class="mini-barber__name">${b.name}</div>
        <div class="mini-barber__role">${b.role}</div>
      </div>`).join('');
    if (selectedBarberId && !booking.barberId) booking.barberId = selectedBarberId;
  }

  function renderBookingServices(){
    const wrap = $('#bookingServices');
    wrap.innerHTML = SERVICES.map(s => `
      <div class="mini-service${selectedServiceIds.has(s.id) ? ' is-selected' : ''}" data-id="${s.id}">
        <span class="mini-service__check"><svg class="icon"><use href="#i-check"/></svg></span>
        <div>
          <div class="mini-service__name">${s.name}</div>
          <div class="mini-service__price">${formatSum(s.price)} · ${formatDuration(s.duration)}</div>
        </div>
      </div>`).join('');
  }

  function renderBookingDates(){
    const wrap = $('#bookingDates');
    const days = buildDates();
    wrap.innerHTML = days.map(d => {
      const key = dateKey(d);
      return `<button type="button" class="date-chip${booking.date === key ? ' is-selected' : ''}" data-date="${key}">
        <span class="date-chip__dow">${DOW[d.getDay()]}</span>
        <span class="date-chip__num">${d.getDate()}</span>
        <span class="date-chip__mon">${MON[d.getMonth()]}</span>
      </button>`;
    }).join('');
  }

  function renderBookingTimes(){
    const wrap = $('#bookingTimes');
    if (!booking.date || !booking.barberId){
      wrap.innerHTML = `<p class="section-sub" style="margin:0">Сначала выберите мастера и дату.</p>`;
      return;
    }
    const slots = [];
    const now = new Date();
    const isToday = booking.date === dateKey(now);
    for (let mins = WORK_START_HOUR * 60; mins < WORK_END_HOUR * 60; mins += SLOT_STEP_MIN){
      const hh = String(Math.floor(mins / 60)).padStart(2, '0');
      const mm = String(mins % 60).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
    const seedBase = hashStr(booking.barberId + booking.date);
    wrap.innerHTML = slots.map((t, i) => {
      const seed = seedBase + i * 17;
      const isTaken = seededRandom(seed) > 0.68;
      const [h, m] = t.split(':').map(Number);
      const slotMinutes = h * 60 + m;
      const isPast = isToday && (now.getHours() * 60 + now.getMinutes()) > slotMinutes - 30;
      const disabled = isTaken || isPast;
      return `<button type="button" class="time-chip${booking.time === t ? ' is-selected' : ''}" data-time="${t}" ${disabled ? 'disabled' : ''}>${t}</button>`;
    }).join('');
  }

  function selectedServicesList(){
    return SERVICES.filter(s => selectedServiceIds.has(s.id));
  }
  function totalPrice(){ return selectedServicesList().reduce((s, x) => s + x.price, 0); }
  function totalDuration(){ return selectedServicesList().reduce((s, x) => s + x.duration, 0); }

  function updateBookingTotal(){
    const el = $('#bookingTotal');
    const list = selectedServicesList();
    el.textContent = list.length ? `Итого: ${formatSum(totalPrice())} · ${formatDuration(totalDuration())}` : '';
  }

  function renderSummary(target, bookingId){
    const barber = BARBERS.find(b => b.id === booking.barberId);
    const list = selectedServicesList();
    const d = booking.date ? new Date(booking.date + 'T00:00:00') : null;
    const dateLabel = d ? `${d.getDate()} ${MON[d.getMonth()]}, ${DOW[d.getDay()]}` : '—';
    const rows = [
      ['Мастер', barber ? barber.name : '—'],
      ['Дата и время', d ? `${dateLabel} в ${booking.time}` : '—'],
      ['Услуги', list.map(s => s.name).join(', ') || '—'],
      ['Длительность', formatDuration(totalDuration())],
      ['Имя клиента', booking.name || '—'],
      ['Телефон', booking.phone || '—'],
    ];
    if (bookingId) rows.push(['Номер записи', bookingId]);
    let html = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    html += `<div class="summary--total"><dt>Итого к оплате</dt><dd>${formatSum(totalPrice())}</dd></div>`;
    $(target).innerHTML = html;
  }

  /* ---- Валидация шагов ---- */
  function clearError(id){ const e = $('#' + id); if (e) e.textContent = ''; }
  function setError(id, msg){ const e = $('#' + id); if (e) e.textContent = msg; }

  function validateStep(step){
    let ok = true;
    if (step === 1){
      clearError('err-barber');
      if (!booking.barberId){ setError('err-barber', 'Пожалуйста, выберите мастера.'); ok = false; }
    }
    if (step === 2){
      clearError('err-services');
      if (selectedServiceIds.size === 0){ setError('err-services', 'Выберите хотя бы одну услугу.'); ok = false; }
    }
    if (step === 3){
      clearError('err-date');
      if (!booking.date){ setError('err-date', 'Пожалуйста, выберите дату визита.'); ok = false; }
    }
    if (step === 4){
      clearError('err-time');
      if (!booking.time){ setError('err-time', 'Пожалуйста, выберите время визита.'); ok = false; }
    }
    if (step === 5){
      clearError('err-name'); clearError('err-phone'); clearError('err-consent');
      const nameInput = $('#clientName');
      const phoneInput = $('#clientPhone');
      const consentInput = $('#clientConsent');
      booking.name = nameInput.value.trim();
      booking.phone = phoneInput.value.trim();
      booking.comment = $('#clientComment').value.trim();

      if (booking.name.length < 2){
        setError('err-name', 'Введите имя (минимум 2 символа).'); nameInput.classList.add('is-invalid'); ok = false;
      } else nameInput.classList.remove('is-invalid');

      const phoneDigits = booking.phone.replace(/[^\d]/g, '');
      if (phoneDigits.length < 9){
        setError('err-phone', 'Введите корректный номер телефона.'); phoneInput.classList.add('is-invalid'); ok = false;
      } else phoneInput.classList.remove('is-invalid');

      if (!consentInput.checked){
        setError('err-consent', 'Необходимо согласие на обработку данных.'); ok = false;
      }
    }
    return ok;
  }

  /* ---- Навигация по шагам ---- */
  function goToStep(step, opts){
    const shouldScroll = !opts || opts.scroll !== false;
    booking.step = step;
    $$('.booking__step').forEach(s => s.classList.toggle('is-active', Number(s.dataset.step) === step));
    $$('.stepper__item').forEach(s => {
      const n = Number(s.dataset.step);
      s.classList.toggle('is-active', n === step);
      s.classList.toggle('is-done', n < step);
    });
    $('#prevStepBtn').disabled = step === 1;
    const isLast = step === TOTAL_STEPS;
    $('#nextStepBtn').hidden = isLast;
    $('#confirmBookingBtn').hidden = !isLast || $('#bookingSuccessView').hidden === false;

    if (step === 3) renderBookingDates();
    if (step === 4) renderBookingTimes();
    if (step === 6 && $('#bookingSuccessView').hidden){
      renderSummary('#bookingSummary');
    }
    if (shouldScroll){
      $('#bookingForm').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function generateBookingId(){
    return 'CEL-' + Math.floor(100000 + Math.random() * 900000);
  }

  function downloadIcs(bookingId){
    const d = new Date(booking.date + 'T' + booking.time + ':00');
    const end = new Date(d.getTime() + totalDuration() * 60000);
    const fmt = (dt) => dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const list = selectedServicesList().map(s => s.name).join(', ');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CELESTIA//Booking//RU', 'BEGIN:VEVENT',
      `UID:${bookingId}@celestia.uz`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(d)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:Запись в CELESTIA (${list})`,
      `DESCRIPTION:Барбершоп CELESTIA. Услуги: ${list}. Номер записи: ${bookingId}`,
      `LOCATION:${BUSINESS.address}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `celestia-${bookingId}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function resetBooking(){
    booking.barberId = null; booking.date = null; booking.time = null;
    booking.name = ''; booking.phone = ''; booking.comment = '';
    selectedServiceIds.clear();
    selectedBarberId = null;
    $('#bookingForm').reset();
    $('#bookingSuccessView').hidden = true;
    $('#bookingConfirmView').hidden = false;
    renderBarbers();
    const activeServiceTab = $('.tab.is-active', $('#serviceTabs'));
    renderServices(activeServiceTab ? activeServiceTab.dataset.cat : 'all');
    renderBookingBarbers();
    renderBookingServices();
    updateBookingTotal();
    goToStep(1);
  }

  function initBooking(){
    renderBookingBarbers();
    renderBookingServices();
    renderBookingDates();
    updateBookingTotal();

    $('#bookingBarbers').addEventListener('click', (e) => {
      const card = e.target.closest('.mini-barber');
      if (!card) return;
      booking.barberId = card.dataset.id;
      selectedBarberId = card.dataset.id;
      renderBookingBarbers();
      renderBarbers();
      clearError('err-barber');
    });

    $('#bookingServices').addEventListener('click', (e) => {
      const card = e.target.closest('.mini-service');
      if (!card) return;
      toggleService(card.dataset.id);
      renderBookingServices();
      updateBookingTotal();
      const activeTab = $('.tab.is-active', $('#serviceTabs'));
      renderServices(activeTab ? activeTab.dataset.cat : 'all');
      clearError('err-services');
    });

    $('#bookingDates').addEventListener('click', (e) => {
      const chip = e.target.closest('.date-chip');
      if (!chip) return;
      booking.date = chip.dataset.date;
      booking.time = null;
      renderBookingDates();
      clearError('err-date');
    });

    $('#bookingTimes').addEventListener('click', (e) => {
      const chip = e.target.closest('.time-chip');
      if (!chip || chip.disabled) return;
      booking.time = chip.dataset.time;
      renderBookingTimes();
      clearError('err-time');
    });

    $('#nextStepBtn').addEventListener('click', () => {
      if (!validateStep(booking.step)) return;
      if (booking.step < TOTAL_STEPS) goToStep(booking.step + 1);
    });
    $('#prevStepBtn').addEventListener('click', () => {
      if (booking.step > 1) goToStep(booking.step - 1);
    });

    $('#bookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateStep(5)) { goToStep(5); return; }
      const bookingId = generateBookingId();
      $('#successBookingId').textContent = bookingId;
      renderSummary('#successSummary', bookingId);
      const totalWaiting = queueState.reduce((s, q) => s + q.waiting + (q.busy ? 1 : 0), 0);
      $('#successQueue').innerHTML = `Ваша позиция в очереди на выбранное время: <b>#${totalWaiting + 1}</b>. Мы пришлём подтверждение на номер <b>${booking.phone}</b>.`;
      $('#bookingConfirmView').hidden = true;
      $('#bookingSuccessView').hidden = false;
      $('#confirmBookingBtn').hidden = true;
      $('#nextStepBtn').hidden = true;
      $('#prevStepBtn').hidden = true;
      showToast('Запись успешно подтверждена!');
      $('#downloadIcsBtn').onclick = () => downloadIcs(bookingId);
    });

    $('#newBookingBtn').addEventListener('click', () => {
      $('#prevStepBtn').hidden = false;
      resetBooking();
    });

    // phone auto-format helper
    $('#clientPhone').addEventListener('input', (e) => {
      let v = e.target.value.replace(/[^\d+]/g, '');
      e.target.value = v;
    });

    goToStep(1, { scroll: false });
  }

  /* Слушаем клики "Выбрать" на карточках услуг/мастеров и на кнопке "Записаться на эту стрижку" из галереи,
     чтобы прыгать в бронирование на нужный шаг */
  function jumpToBooking(){
    document.getElementById('booking').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ----------------------------------------------------------------------
     Галерея
  ---------------------------------------------------------------------- */
  let galleryFiltered = GALLERY.slice();
  let lightboxIndex = 0;

  function galleryIcon(name){ return serviceIcon(name); }

  function galleryVisualHTML(item){
    if (item.photo){
      return `<img src="${item.photo}" alt="${item.title}" loading="lazy">`;
    }
    return `<svg class="icon"><use href="#${galleryIcon(item.icon)}"/></svg>`;
  }

  function galleryCardHTML(item){
    const catLabel = GALLERY_CATEGORIES.find(c => c.id === item.category);
    return `
      <div class="gallery-card${item.photo ? ' has-photo' : ''}" data-id="${item.id}">
        <div class="gallery-card__visual">${galleryVisualHTML(item)}</div>
        <button class="gallery-card__zoom" aria-label="Открыть"><svg class="icon"><use href="#i-arrow-right"/></svg></button>
        <div class="gallery-card__overlay">
          <span class="gallery-card__cat">${catLabel ? catLabel.label : ''}</span>
          <div class="gallery-card__title">${item.title}</div>
        </div>
      </div>`;
  }

  function renderGallery(filter){
    galleryFiltered = (!filter || filter === 'all') ? GALLERY.slice() : GALLERY.filter(g => g.category === filter);
    $('#galleryGrid').innerHTML = galleryFiltered.map(galleryCardHTML).join('');
  }

  function renderGalleryTabs(){
    const wrap = $('#galleryTabs');
    wrap.innerHTML = GALLERY_CATEGORIES.map((c, i) => `<button class="tab${i === 0 ? ' is-active' : ''}" data-cat="${c.id}">${c.label}</button>`).join('');
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if (!btn) return;
      $$('.tab', wrap).forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderGallery(btn.dataset.cat);
    });
  }

  function openLightbox(id){
    lightboxIndex = galleryFiltered.findIndex(g => g.id === id);
    if (lightboxIndex < 0) lightboxIndex = 0;
    renderLightbox();
    $('#lightbox').classList.add('is-open');
    $('#lightbox').setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
  function closeLightbox(){
    $('#lightbox').classList.remove('is-open');
    $('#lightbox').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }
  function renderLightbox(){
    const item = galleryFiltered[lightboxIndex];
    if (!item) return;
    $('#lightboxVisual').innerHTML = galleryVisualHTML(item);
    $('#lightboxVisual').classList.toggle('has-photo', !!item.photo);
    $('#lightboxTitle').textContent = item.title;
    $('#lightboxDesc').textContent = item.desc;
  }

  function initGallery(){
    renderGalleryTabs();
    renderGallery('all');
    $('#galleryGrid').addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-card');
      if (!card) return;
      openLightbox(card.dataset.id);
    });
    $('#lightboxClose').addEventListener('click', closeLightbox);
    $('#lightboxBackdrop').addEventListener('click', closeLightbox);
    $('#lightboxNext').addEventListener('click', () => {
      lightboxIndex = (lightboxIndex + 1) % galleryFiltered.length;
      renderLightbox();
    });
    $('#lightboxPrev').addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + galleryFiltered.length) % galleryFiltered.length;
      renderLightbox();
    });
    $('#lightboxBookBtn').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (!$('#lightbox').classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') $('#lightboxNext').click();
      if (e.key === 'ArrowLeft') $('#lightboxPrev').click();
    });
  }

  /* ----------------------------------------------------------------------
     Отзывы (слайдер)
  ---------------------------------------------------------------------- */
  let reviewIndex = 0;
  let reviewTimer = null;

  function reviewCardHTML(r){
    const stars = Array.from({ length: 5 }, (_, i) =>
      `<svg class="icon"><use href="#i-star"/></svg>`).slice(0, r.rating).join('');
    return `
      <div class="review-card">
        <div class="review-card__inner">
          <div class="review-card__stars">${stars}</div>
          <p class="review-card__text">${r.text}</p>
          <div class="review-card__person">
            <div class="review-card__avatar">${r.initials}</div>
            <div class="review-card__name">${r.name}</div>
          </div>
        </div>
      </div>`;
  }

  function updateReviewSlider(){
    $('#reviewsTrack').style.transform = `translateX(-${reviewIndex * 100}%)`;
    $$('.reviews__dots button', document).forEach((d, i) => d.classList.toggle('is-active', i === reviewIndex));
  }

  function initReviews(){
    $('#reviewsTrack').innerHTML = TESTIMONIALS.map(reviewCardHTML).join('');
    $('#reviewDots').innerHTML = TESTIMONIALS.map((_, i) => `<button aria-label="Отзыв ${i + 1}"></button>`).join('');
    updateReviewSlider();

    function go(delta){
      reviewIndex = (reviewIndex + delta + TESTIMONIALS.length) % TESTIMONIALS.length;
      updateReviewSlider();
      restartAutoplay();
    }
    $('#reviewNext').addEventListener('click', () => go(1));
    $('#reviewPrev').addEventListener('click', () => go(-1));
    $('#reviewDots').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      reviewIndex = Array.from($('#reviewDots').children).indexOf(btn);
      updateReviewSlider();
      restartAutoplay();
    });

    function restartAutoplay(){
      clearInterval(reviewTimer);
      if (!reduceMotion) reviewTimer = setInterval(() => go(1), 6000);
    }
    const slider = $('.reviews__slider');
    slider.addEventListener('mouseenter', () => clearInterval(reviewTimer));
    slider.addEventListener('mouseleave', restartAutoplay);
    restartAutoplay();
  }

  /* ----------------------------------------------------------------------
     FAQ
  ---------------------------------------------------------------------- */
  function initFaq(){
    const list = $('#faqList');
    list.innerHTML = FAQ.map((item, i) => `
      <div class="faq-item" data-i="${i}">
        <button type="button" class="faq-item__q" aria-expanded="false">
          <span>${item.q}</span>
          <svg class="icon"><use href="#i-chevron-down"/></svg>
        </button>
        <div class="faq-item__a"><p>${item.a}</p></div>
      </div>`).join('');

    list.addEventListener('click', (e) => {
      const q = e.target.closest('.faq-item__q');
      if (!q) return;
      const item = q.closest('.faq-item');
      const answer = item.querySelector('.faq-item__a');
      const isOpen = item.classList.contains('is-open');
      list.querySelectorAll('.faq-item.is-open').forEach(open => {
        open.classList.remove('is-open');
        open.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
        open.querySelector('.faq-item__a').style.maxHeight = null;
      });
      if (!isOpen){
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  }

  /* ----------------------------------------------------------------------
     Контактная форма
  ---------------------------------------------------------------------- */
  function initContactForm(){
    const form = $('#contactForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const name = $('#cName'), phone = $('#cPhone'), message = $('#cMessage');
      ['err-cName', 'err-cPhone', 'err-cMessage'].forEach(clearError);
      [name, phone, message].forEach(f => f.classList.remove('is-invalid'));

      if (name.value.trim().length < 2){ setError('err-cName', 'Введите ваше имя.'); name.classList.add('is-invalid'); ok = false; }
      const digits = phone.value.replace(/[^\d]/g, '');
      if (digits.length < 9){ setError('err-cPhone', 'Введите корректный номер телефона.'); phone.classList.add('is-invalid'); ok = false; }
      if (message.value.trim().length < 5){ setError('err-cMessage', 'Опишите ваш вопрос немного подробнее.'); message.classList.add('is-invalid'); ok = false; }

      if (!ok) return;
      showToast('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      form.reset();
    });
  }

  /* ----------------------------------------------------------------------
     Back to top
  ---------------------------------------------------------------------- */
  function initFabTop(){
    const fab = $('#fabTop');
    window.addEventListener('scroll', () => {
      fab.classList.toggle('is-visible', window.scrollY > 700);
    }, { passive: true });
    fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ----------------------------------------------------------------------
     Init
  ---------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    injectBusinessInfo();
    initHeader();
    initHeroCanvas();
    initReveal();
    initCounters();
    initServices();
    initBarbers();
    initQueue();
    initBooking();
    initGallery();
    initReviews();
    initFaq();
    initContactForm();
    initFabTop();

    $$('a[href="#booking"]').forEach(a => a.addEventListener('click', () => setTimeout(jumpToBooking, 0)));
  });
})();
