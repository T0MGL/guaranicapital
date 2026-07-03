import { timingSafeEqual } from 'node:crypto';
import { COOKIE_NAME, readCookie, serializeSessionCookie, signSession, verifySession } from './_lib.js';

const SESSION_MAX_AGE_SEC = 24 * 60 * 60;

function safeEqual(a, b) {
    const aBuf = Buffer.from(String(a));
    const bBuf = Buffer.from(String(b));
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf);
}

export default async function handler(req, res) {
    const sessionSecret = process.env.SESSION_SECRET;

    if (req.method === 'GET') {
        const authenticated = Boolean(sessionSecret) && verifySession(readCookie(req, COOKIE_NAME), sessionSecret);
        return res.status(200).json({ authenticated });
    }

    if (req.method === 'POST') {
        const crmPassword = process.env.CRM_PASSWORD;
        if (!crmPassword || !sessionSecret) {
            return res.status(500).json({ error: 'not configured' });
        }

        const password = req.body?.password;
        if (!password || !safeEqual(password, crmPassword)) {
            return res.status(401).json({ ok: false });
        }

        res.setHeader('Set-Cookie', serializeSessionCookie(signSession(sessionSecret), SESSION_MAX_AGE_SEC));
        return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method not allowed' });
}
