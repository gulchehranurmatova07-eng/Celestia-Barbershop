/* ==========================================================================
   CELESTIA — данные сайта (услуги, мастера, галерея, отзывы, FAQ)
   ========================================================================== */

const BUSINESS = {
  name: 'CELESTIA',
  tagline: 'Премиальный барбершоп нового поколения',
  phoneDisplay: '+998 90 123 45 67',
  phoneHref: '+998901234567',
  whatsapp: 'https://wa.me/998901234567',
  telegram: 'https://t.me/celestia_barbershop',
  instagram: 'https://instagram.com/celestia.uz',
  address: 'г. Ташкент, Мирабадский район, ул. Афросиаб, 12',
  hours: 'Ежедневно · 09:00 – 21:00',
  mapQuery: 'Ташкент, улица Афросиаб 12',
};

/* ---- Уведомления о новых записях (Telegram) --------------------------------
   Чтобы получать сообщение в Telegram при каждой новой записи:
   1. В Telegram найдите @BotFather, отправьте /newbot и следуйте инструкциям —
      в ответ он пришлёт токен вида "123456789:AAExampleTokenHere".
   2. Напишите вашему новому боту любое сообщение (например, "старт"), затем
      откройте в браузере: https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
      и найдите в ответе число "chat":{"id": 123456789} — это ваш CHAT_ID.
   3. Вставьте оба значения ниже. Без этого бронирования просто не будут
      отправляться в Telegram (остальной сайт продолжит работать как обычно).
------------------------------------------------------------------------- */
const TELEGRAM_NOTIFY = {
  botToken: '8729365962:AAGc9e5J3IBMs9-PjrEGFGkV7neiXUfe8l8',
  chatId: '5518596512',
};

/* ---- Услуги -------------------------------------------------------------- */
const SERVICES = [
  // Стрижки
  { id: 'classic', category: 'hair', icon: 'scissors', name: 'Классическая стрижка', desc: 'Машинка и ножницы, оформление контуров, укладка.', duration: 45, price: 90000 },
  { id: 'fade', category: 'hair', icon: 'fade', name: 'Фейд', desc: 'Плавный переход длины с чёткой геометрией.', duration: 60, price: 110000 },
  { id: 'wolfcut', category: 'hair', icon: 'wolf', name: 'Вульф-кат', desc: 'Дерзкая многослойная стрижка с объёмом и текстурой.', duration: 70, price: 150000, badge: 'Тренд' },
  { id: 'crop', category: 'hair', icon: 'crop', name: 'Кроп', desc: 'Короткая текстурная чёлка и аккуратные бока.', duration: 50, price: 120000 },
  { id: 'korean', category: 'hair', icon: 'korean', name: 'Корейская стрижка', desc: 'Мягкие линии, лёгкая чёлка, естественный объём.', duration: 75, price: 160000, badge: 'Хит' },
  { id: 'anime', category: 'hair', icon: 'anime', name: 'Аниме-стрижка', desc: 'Яркая текстурная укладка с острыми прядями и колором.', duration: 80, price: 170000, badge: 'Новинка' },
  { id: 'bald', category: 'hair', icon: 'bald', name: 'Бритьё головы под ноль', desc: 'Идеально гладкая лысина, уход за кожей головы.', duration: 40, price: 85000 },
  { id: 'kids', category: 'hair', icon: 'kids', name: 'Детская стрижка', desc: 'Для мальчиков до 12 лет, бережно и быстро.', duration: 30, price: 60000 },
  // Борода
  { id: 'beard-trim', category: 'beard', icon: 'beard', name: 'Оформление бороды', desc: 'Машинка, окантовка, стайлинг маслом для бороды.', duration: 25, price: 55000 },
  { id: 'royal-shave', category: 'beard', icon: 'razor', name: 'Королевское бритьё', desc: 'Опасная бритва, горячие полотенца, уход после бритья.', duration: 45, price: 95000, badge: 'Премиум' },
  { id: 'beard-sculpt', category: 'beard', icon: 'beard-hot', name: 'Моделирование бороды', desc: 'Точная форма + горячий компресс и увлажнение.', duration: 40, price: 90000 },
  { id: 'beard-color', category: 'beard', icon: 'color', name: 'Камуфляж седины в бороде', desc: 'Естественный оттенок, стойкость до 4 недель.', duration: 30, price: 70000 },
  // Уход
  { id: 'wash', category: 'care', icon: 'wash', name: 'Мытьё головы', desc: 'Премиальная косметика, расслабляющий массаж.', duration: 15, price: 30000 },
  { id: 'facial', category: 'care', icon: 'facial', name: 'Уход за кожей лица', desc: 'Пилинг, маска, тонизирование — свежий вид без усталости.', duration: 35, price: 120000 },
  { id: 'hair-color', category: 'care', icon: 'color', name: 'Камуфляж седины на волосах', desc: 'Естественный тон, скрывает седину без эффекта окрашивания.', duration: 40, price: 130000 },
  { id: 'combo', category: 'care', icon: 'combo', name: 'Стрижка + Борода + Уход', desc: 'Полный комплекс для идеального образа со скидкой.', duration: 120, price: 250000, badge: 'Выгодно' },
  // Авторские образы — фиксированная цена 120 000 сум за стрижку
  { id: 'old-money', category: 'signature', icon: 'scissors', name: 'Аристократичная укладка', desc: 'Объёмный зачёс с лёгкой волной — элегантный образ в стиле «олд-мани».', duration: 60, price: 120000 },
  { id: 'soft-slick-back', category: 'signature', icon: 'fade', name: 'Мягкий зачёс назад', desc: 'Гладкий зачёс с низким фейдом, без эффекта «мокрых волос».', duration: 60, price: 120000 },
  { id: 'messy-quiff', category: 'signature', icon: 'crop', name: 'Растрёпанный кок', desc: 'Объёмный текстурный верх и аккуратный фейд по бокам.', duration: 60, price: 120000 },
  { id: 'italian-style', category: 'signature', icon: 'korean', name: 'Итальянская укладка', desc: 'Мягкие волны, зачёсанные набок — элегантность без геля.', duration: 60, price: 120000 },
  { id: 'crew-cut', category: 'signature', icon: 'crop', name: 'Текстурный кроп', desc: 'Короткий верх с текстурой и чистый фейд — универсальная классика.', duration: 60, price: 120000 },
  { id: 'wolf-cut-v2', category: 'signature', icon: 'wolf', name: 'Вульф-кат с объёмом', desc: 'Многослойная текстурная стрижка с рваными краями и объёмом.', duration: 60, price: 120000 },
  { id: 'side-part-fade', category: 'signature', icon: 'fade', name: 'Пробор с фейдом', desc: 'Чёткий боковой пробор и плавный фейд по бокам.', duration: 60, price: 120000 },
  { id: 'modern-mullet-v2', category: 'signature', icon: 'wolf', name: 'Современный маллет', desc: 'Короткие виски и удлинённый затылок — акцент на структуре волос.', duration: 60, price: 120000 },
  { id: 'long-low-taper', category: 'signature', icon: 'korean', name: 'Длинная стрижка с низким тейпером', desc: 'Длина сохраняется сверху, низкий тейпер по бокам для чистого контура.', duration: 60, price: 120000 },
  { id: 'flower-perm', category: 'signature', icon: 'korean', name: 'Завивка «Цветок»', desc: 'Объёмная химическая завивка для естественных крупных локонов.', duration: 60, price: 120000 },
  { id: 'long-bro-flow', category: 'signature', icon: 'korean', name: 'Длинная волнистая укладка', desc: 'Естественные волны, зачёсанные назад — свободный образ.', duration: 60, price: 120000 },
  { id: 'shag-mullet', category: 'signature', icon: 'wolf', name: 'Рваный маллет', desc: 'Многослойная текстура с рваными прядями и лёгкой растрёпанностью.', duration: 60, price: 120000 },
  { id: 'long-middle-part', category: 'signature', icon: 'korean', name: 'Длинный пробор по центру', desc: 'Длина до подбородка с пробором по центру — мягкий и смелый образ.', duration: 60, price: 120000 },
];

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'Все услуги' },
  { id: 'hair', label: 'Стрижки' },
  { id: 'beard', label: 'Борода' },
  { id: 'care', label: 'Уход' },
  { id: 'signature', label: 'Авторские образы' },
];

/* ---- Мастера --------------------------------------------------------------*/
const BARBERS = [
  { id: 'aziz', name: 'Азизбек Расулов', role: 'Топ-мастер · Фейды и текстура', experience: 9, rating: 4.9, tags: ['Фейд', 'Классика', 'Вульф-кат'] },
  { id: 'timur', name: 'Тимур Юсупов', role: 'Мастер бороды', experience: 6, rating: 4.8, tags: ['Борода', 'Королевское бритьё'] },
  { id: 'sherzod', name: 'Шерзод Ахмедов', role: 'Модные стрижки', experience: 5, rating: 4.9, tags: ['Вульф-кат', 'Кроп', 'Корейская'] },
  { id: 'jasur', name: 'Жасур Каримов', role: 'Классика и деловой стиль', experience: 11, rating: 5.0, tags: ['Классика', 'Бритьё головы'] },
  { id: 'farrukh', name: 'Фаррух Назаров', role: 'Креативные стрижки', experience: 4, rating: 4.7, tags: ['Аниме-стрижка', 'Окантовка'] },
];

/* ---- Галерея работ ---------------------------------------------------------*/
const GALLERY = [
  { id: 'old-money', category: 'classic', icon: 'scissors', photo: 'assets/gallery/old-money.jpg', title: 'Аристократичная укладка', desc: 'Объёмный зачёс с лёгкой волной в стиле «олд-мани».', price: 120000, angles: { front: 'assets/angles/old-money-front.jpg', side: 'assets/angles/old-money-side.jpg', back: 'assets/angles/old-money-back.jpg' } },
  { id: 'soft-slick-back', category: 'classic', icon: 'fade', photo: 'assets/gallery/soft-slick-back.jpg', title: 'Мягкий зачёс назад', desc: 'Гладкий зачёс с низким фейдом, без эффекта «мокрых волос».', price: 120000, angles: { front: 'assets/angles/soft-slick-back-front.jpg', side: 'assets/angles/soft-slick-back-side.jpg', back: 'assets/angles/soft-slick-back-back.jpg' } },
  { id: 'italian-style', category: 'classic', icon: 'korean', photo: 'assets/gallery/italian-style.jpg', title: 'Итальянская укладка', desc: 'Мягкие волны, зачёсанные набок — элегантность без геля.', price: 120000, angles: { front: 'assets/angles/italian-style-front.jpg', side: 'assets/angles/italian-style-side.jpg', back: 'assets/angles/italian-style-back.jpg' } },
  { id: 'crew-cut', category: 'classic', icon: 'crop', photo: 'assets/gallery/crew-cut.jpg', title: 'Текстурный кроп', desc: 'Короткий верх с текстурой и чистый фейд.', price: 120000, angles: { front: 'assets/angles/crew-cut-front.jpg', side: 'assets/angles/crew-cut-side.jpg', back: 'assets/angles/crew-cut-back.jpg' } },
  { id: 'side-part-fade', category: 'classic', icon: 'fade', photo: 'assets/gallery/side-part-fade.jpg', title: 'Пробор с фейдом', desc: 'Чёткий боковой пробор и плавный фейд по бокам.', price: 120000, angles: { front: 'assets/angles/side-part-fade-front.jpg', side: 'assets/angles/side-part-fade-side.jpg', back: 'assets/angles/side-part-fade-back.jpg' } },
  { id: 'messy-quiff', category: 'trendy', icon: 'crop', photo: 'assets/gallery/messy-quiff.jpg', title: 'Растрёпанный кок', desc: 'Объёмный текстурный верх и аккуратный фейд по бокам.', price: 120000, angles: { front: 'assets/angles/messy-quiff-front.jpg', side: 'assets/angles/messy-quiff-side.jpg', back: 'assets/angles/messy-quiff-back.jpg' } },
  { id: 'wolf-cut-v2', category: 'trendy', icon: 'wolf', photo: 'assets/gallery/wolf-cut-v2.jpg', title: 'Вульф-кат с объёмом', desc: 'Многослойная текстурная стрижка с рваными краями.', price: 120000, angles: { front: 'assets/angles/wolf-cut-v2-front.jpg', side: 'assets/angles/wolf-cut-v2-side.jpg', back: 'assets/angles/wolf-cut-v2-back.jpg' } },
  { id: 'modern-mullet-v2', category: 'trendy', icon: 'wolf', photo: 'assets/gallery/modern-mullet-v2.jpg', title: 'Современный маллет', desc: 'Короткие виски и удлинённый затылок.', price: 120000, angles: { front: 'assets/angles/modern-mullet-v2-front.jpg', side: 'assets/angles/modern-mullet-v2-side.jpg', back: 'assets/angles/modern-mullet-v2-back.jpg' } },
  { id: 'long-low-taper', category: 'long', icon: 'korean', photo: 'assets/gallery/long-low-taper.jpg', title: 'Длинная стрижка с низким тейпером', desc: 'Длина сохраняется сверху, низкий тейпер по бокам.', price: 120000 },
  { id: 'flower-perm', category: 'long', icon: 'korean', photo: 'assets/gallery/flower-perm.jpg', title: 'Завивка «Цветок»', desc: 'Объёмная химическая завивка для крупных локонов.', price: 120000 },
  { id: 'long-bro-flow', category: 'long', icon: 'korean', photo: 'assets/gallery/long-bro-flow.jpg', title: 'Длинная волнистая укладка', desc: 'Естественные волны, зачёсанные назад.', price: 120000 },
  { id: 'shag-mullet', category: 'long', icon: 'wolf', photo: 'assets/gallery/shag-mullet.jpg', title: 'Рваный маллет', desc: 'Многослойная текстура с рваными прядями.', price: 120000 },
  { id: 'long-middle-part', category: 'long', icon: 'korean', photo: 'assets/gallery/long-middle-part.jpg', title: 'Длинный пробор по центру', desc: 'Длина до подбородка с пробором по центру.', price: 120000 },
];

const GALLERY_CATEGORIES = [
  { id: 'all', label: 'Все работы' },
  { id: 'classic', label: 'Классика' },
  { id: 'trendy', label: 'Трендовые' },
  { id: 'long', label: 'Длинные волосы' },
];

/* ---- Отзывы -----------------------------------------------------------------*/
const TESTIMONIALS = [
  { name: 'Давронбек Т.', initials: 'ДТ', rating: 5, text: 'Хожу только в Celestia уже два года. Азизбек всегда чувствует, что мне нужно, даже если я сам толком не знаю, какую стрижку хочу.' },
  { name: 'Аброр Ш.', initials: 'АШ', rating: 5, text: 'Сделал вульф-кат у Шерзода — очень доволен, много комплиментов от друзей. Атмосфера в барбершопе премиальная, кофе тоже отличный.' },
  { name: 'Николай П.', initials: 'НП', rating: 5, text: 'Королевское бритьё — это отдельный ритуал. Горячее полотенце, опасная бритва, полное расслабление. Однозначно вернусь.' },
  { name: 'Санжар К.', initials: 'СК', rating: 4, text: 'Онлайн-запись реально работает: выбрал время, пришёл без очереди. Жасур подстриг ровно так, как я просил.' },
  { name: 'Илхом М.', initials: 'ИМ', rating: 5, text: 'Привёл сына на детскую стрижку — мастера очень терпеливые. Себе сделал корейскую стрижку у Фарруха, результат супер.' },
];

/* ---- FAQ ----------------------------------------------------------------- */
const FAQ = [
  { q: 'Как записаться на стрижку?', a: 'Выберите мастера, услугу, удобные дату и время в разделе «Онлайн-запись» на этом сайте — это займёт меньше минуты. Также можно записаться по телефону или в Telegram.' },
  { q: 'Какие способы оплаты вы принимаете?', a: 'Наличные, Uzcard, Humo, а также переводы через Click и Payme прямо в барбершопе.' },
  { q: 'Можно ли прийти без записи?', a: 'Да, но время ожидания зависит от текущей загрузки мастеров — актуальную очередь видно в разделе «Живая очередь». Клиенты с онлайн-записью обслуживаются в первую очередь.' },
  { q: 'Как отменить или перенести запись?', a: 'Свяжитесь с нами по телефону или в Telegram не позднее чем за 2 часа до визита — мы перенесём запись на удобное время без каких-либо штрафов.' },
  { q: 'Есть ли парковка у барбершопа?', a: 'Да, рядом со входом есть бесплатная парковка на 10 автомобилей.' },
  { q: 'Работаете ли вы в праздничные дни?', a: 'Да, Celestia работает без выходных, включая праздничные дни, с 09:00 до 21:00.' },
];

/* ---- Слоты времени (генерация) -------------------------------------------*/
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 21;
const SLOT_STEP_MIN = 30;
