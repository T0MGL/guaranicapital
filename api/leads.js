import { COOKIE_NAME, readCookie, verifySession } from './_lib.js';

function hasValidSession(req) {
    const secret = process.env.SESSION_SECRET;
    return Boolean(secret) && verifySession(readCookie(req, COOKIE_NAME), secret);
}

// Apps Script answers with a JSON string over ContentService. Forward status + body verbatim
// so the client sees the sheet's own response, never the upstream URL or token.
async function relay(res, upstream) {
    const text = await upstream.text();
    res.status(upstream.status).setHeader('Content-Type', 'application/json');
    return res.send(text);
}

export default async function handler(req, res) {
    const appsScriptUrl = process.env.APPS_SCRIPT_URL;
    const appsScriptToken = process.env.APPS_SCRIPT_TOKEN;
    if (!appsScriptUrl || !appsScriptToken) {
        return res.status(500).json({ error: 'not configured' });
    }

    const targetUrl = `${appsScriptUrl}?token=${encodeURIComponent(appsScriptToken)}`;

    if (req.method === 'GET') {
        if (!hasValidSession(req)) return res.status(401).json({ error: 'unauthorized' });
        const upstream = await fetch(targetUrl);
        return relay(res, upstream);
    }

    if (req.method === 'POST') {
        const action = req.body?.action;

        if (action !== 'create' && action !== 'update') {
            return res.status(400).json({ error: 'invalid action' });
        }
        // create is the public landing form; update mutates lead state and needs a session.
        if (action === 'update' && !hasValidSession(req)) {
            return res.status(401).json({ error: 'unauthorized' });
        }

        const upstream = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        return relay(res, upstream);
    }

    return res.status(405).json({ error: 'method not allowed' });
}
