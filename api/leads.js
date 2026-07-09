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

// Fire the new-lead notification to n8n so it can send the alert email. Lead capture never
// depends on this: any failure (unset URL, network, timeout, non-2xx) is swallowed and the
// caller still relays the sheet's response unchanged. We await with a 2s cap instead of a
// detached promise because Vercel freezes the function after the response and would drop it;
// the n8n webhook ACKs immediately, so the happy path adds ~100-300ms and a dead n8n costs 2s.
async function notifyNewLead(lead) {
    const url = process.env.GUARANI_LEAD_WEBHOOK_URL;
    if (!url) return;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(lead),
            signal: AbortSignal.timeout(2000),
        });
    } catch (err) {
        // Best-effort: never break or delay lead capture. This is the sole alert channel,
        // so log the failure class (name only, no PII) so a dead n8n is detectable.
        console.warn('lead.notify.failed', err?.name || 'error');
    }
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
        if (action === 'create' && upstream.ok) {
            await notifyNewLead(req.body);
        }
        return relay(res, upstream);
    }

    return res.status(405).json({ error: 'method not allowed' });
}
