import { createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE_NAME = 'gc_session';

function hmacHex(value, secret) {
    return createHmac('sha256', secret).update(value).digest('hex');
}

// Session token = `<issuedAtMs>.<hmac>`. Stateless, verified server-side against SESSION_SECRET.
export function signSession(secret) {
    const issuedAt = String(Date.now());
    return `${issuedAt}.${hmacHex(issuedAt, secret)}`;
}

export function verifySession(token, secret, maxAgeMs = 24 * 60 * 60 * 1000) {
    if (!token || !secret || typeof token !== 'string') return false;

    const dot = token.indexOf('.');
    if (dot <= 0) return false;

    const issuedAt = token.slice(0, dot);
    const provided = token.slice(dot + 1);
    if (!/^\d+$/.test(issuedAt) || !/^[0-9a-f]+$/.test(provided)) return false;

    const expected = hmacHex(issuedAt, secret);
    const providedBuf = Buffer.from(provided, 'hex');
    const expectedBuf = Buffer.from(expected, 'hex');
    if (providedBuf.length !== expectedBuf.length) return false;
    if (!timingSafeEqual(providedBuf, expectedBuf)) return false;

    return Date.now() - Number(issuedAt) < maxAgeMs;
}

export function readCookie(req, name) {
    const header = req.headers?.cookie;
    if (!header) return null;
    for (const part of header.split(';')) {
        const eq = part.indexOf('=');
        if (eq < 0) continue;
        if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
    }
    return null;
}

export function serializeSessionCookie(token, maxAgeSec) {
    return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAgeSec}`;
}
