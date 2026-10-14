/* ==========================================================================
   CELESTIA — API для записей (Vercel Serverless Function)
   Хранит записи в Vercel KV (Upstash Redis) и отдаёт их админу.

   Настройка после деплоя на Vercel:
   1. В проекте на Vercel: Storage → Create Database → KV → Connect to project.
      Это автоматически добавит переменные окружения KV_REST_API_URL и
      KV_REST_API_TOKEN — ничего вручную вводить не нужно.
   2. Settings → Environment Variables → добавить ADMIN_PASSWORD со своим
      паролем для входа в /admin.html.
   3. Передеплоить проект (Deployments → ... → Redeploy), чтобы переменные
      применились.
   ========================================================================== */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MAX_BOOKINGS = 1000;

async function kv(command) {
  const res = await fetch(KV_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

module.exports = async function handler(req, res) {
  if (!KV_URL || !KV_TOKEN) {
    res.status(500).json({ error: 'Хранилище не подключено. Добавьте Vercel KV в настройках проекта (Storage → Create Database → KV).' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'object' && req.body !== null ? req.body : JSON.parse(req.body || '{}');
      const booking = {
        id: String(body.id || '').slice(0, 40),
        barber: String(body.barber || '').slice(0, 200),
        services: String(body.services || '').slice(0, 500),
        date: String(body.date || '').slice(0, 40),
        time: String(body.time || '').slice(0, 20),
        name: String(body.name || '').slice(0, 200),
        phone: String(body.phone || '').slice(0, 60),
        comment: String(body.comment || '').slice(0, 500),
        total: Number(body.total) || 0,
        createdAt: new Date().toISOString(),
      };
      if (!booking.id || !booking.name || !booking.phone) {
        res.status(400).json({ error: 'Недостаточно данных для сохранения записи.' });
        return;
      }
      await kv(['LPUSH', 'bookings', JSON.stringify(booking)]);
      await kv(['LTRIM', 'bookings', '0', String(MAX_BOOKINGS - 1)]);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Не удалось сохранить запись.' });
    }
    return;
  }

  if (req.method === 'GET') {
    const auth = req.headers['x-admin-password'];
    if (!ADMIN_PASSWORD) {
      res.status(500).json({ error: 'ADMIN_PASSWORD не настроен в переменных окружения проекта.' });
      return;
    }
    if (auth !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Неверный пароль.' });
      return;
    }
    try {
      const raw = await kv(['LRANGE', 'bookings', '0', String(MAX_BOOKINGS - 1)]);
      const bookings = (raw || [])
        .map((s) => {
          try { return JSON.parse(s); } catch { return null; }
        })
        .filter(Boolean);
      res.status(200).json({ ok: true, bookings });
    } catch (e) {
      res.status(500).json({ error: 'Не удалось получить записи.' });
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Метод не поддерживается.' });
};
