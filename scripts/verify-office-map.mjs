/*
  Checks the office map in the contact section against the real render, at
  every width the layout changes behaviour and at three scrollbar gutters.

  For each case the built page gives the map box, the "Cómo llegar" pill and
  the OpenStreetMap credit (union over es, en and pt, pill including its 2px
  hover lift) and the source the browser actually picked. The served SVG is
  then inlined in a box of exactly that size with preserveAspectRatio slice,
  which is what object-fit: cover does to the img, and every <text> and the
  pin are measured as rendered:

    a) no street name touches the pill or the credit
    b) no street name is cut by the edge of the box
    c) names render between 9.5 and 15 CSS px (font size times scale)
    d) the pin is whole and inside the middle 60% of the box
    e) the source is the one the 400px breakpoint says
    f) the office street is named
    g) at least four streets are named

  f and g are what make an empty map fail: without them a map with no names
  at all would pass a to d.

  Gutters: phones draw overlay scrollbars, so html's scrollbar-gutter: stable
  reserves nothing; desktop Chromium and Safari reserve the site's 8px
  ::-webkit-scrollbar; a classic Windows scrollbar reserves about 17px, which
  forcing the webkit scrollbar to 17px reproduces.

  Needs a server that applies vercel.json and Chrome:

    npm run build
    npm run serve:dist &
    node scripts/verify-office-map.mjs http://localhost:4173
    kill %1

  CHROME_PATH overrides the Chrome binary. Kill the server afterwards: an
  orphan on a fixed port sabotages the next run.
*/

import { spawn } from 'node:child_process'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = (process.argv[2] ?? '').replace(/\/$/, '')
if (!BASE) {
  console.error('usage: node scripts/verify-office-map.mjs <base-url>')
  process.exit(2)
}

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9341
const WIDTHS = [320, 360, 390, 400, 401, 430, 599, 600, 700, 768, 769, 900, 1024, 1063, 1064, 1280, 1440]
const LOCALES = ['/', '/en/', '/pt/']
const OFFICE_STREET = 'Cecilio da Silva'
const MIN_LABELS = 4
const PILL_LIFT = 2
const expectedSource = (vw) => (vw <= 400 ? 'office-tall.svg' : 'office-wide.svg')

const GUTTERS = [
  { name: 'g0', mobile: true, css: null },
  { name: 'g8', mobile: false, css: null },
  { name: 'g17', mobile: false, css: '::-webkit-scrollbar{width:17px!important;height:17px!important}' },
]

const sleep = (ms) => new Promise((done) => setTimeout(done, ms))

const profile = join(tmpdir(), `verify-office-map-${process.pid}`)
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run'], {
  stdio: 'ignore',
})

let endpoint = null
for (let attempt = 0; attempt < 80 && !endpoint; attempt += 1) {
  try {
    const response = await fetch(`http://127.0.0.1:${PORT}/json/version`)
    if (response.ok) endpoint = (await response.json()).webSocketDebuggerUrl
  } catch {
    // Chrome is still starting.
  }
  if (!endpoint) await sleep(250)
}
if (!endpoint) {
  chrome.kill()
  console.error('Chrome did not open its debugging port')
  process.exit(2)
}

const socket = new WebSocket(endpoint)
await new Promise((done, fail) => {
  socket.addEventListener('open', done, { once: true })
  socket.addEventListener('error', fail, { once: true })
})

let nextId = 1
const pending = new Map()
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  const entry = pending.get(message.id)
  if (!entry) return
  pending.delete(message.id)
  if (message.error) entry.reject(new Error(JSON.stringify(message.error)))
  else entry.resolve(message.result)
})
const send = (method, params = {}, sessionId) => {
  const id = nextId++
  socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

/* One tab on purpose: a second one would push this tab to the background,
   and a hidden tab never runs the lazy image load. */
const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
const call = (method, params) => send(method, params, sessionId)
const evaluate = async (expression) => {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails).slice(0, 400))
  return result.result.value
}

const svgCache = new Map()
const svgText = async (name) => {
  if (!svgCache.has(name)) {
    const response = await fetch(`${BASE}/map/${name}`)
    if (!response.ok) throw new Error(`/map/${name} answered ${response.status}`)
    svgCache.set(name, await response.text())
  }
  return svgCache.get(name)
}

const measurePage = async (url, width, gutter) => {
  await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: gutter.mobile })
  await call('Page.navigate', { url })
  for (let i = 0; i < 60; i += 1) {
    await sleep(150)
    if (await evaluate(`Boolean(document.querySelector('.location-map'))`).catch(() => false)) break
  }
  if (gutter.css) {
    await evaluate(`(() => {
      const style = document.createElement('style');
      style.textContent = ${JSON.stringify(gutter.css)};
      document.head.appendChild(style);
      document.documentElement.style.overflowY = 'hidden';
      void document.documentElement.offsetWidth;
      document.documentElement.style.overflowY = '';
    })()`)
  }
  await evaluate(`document.querySelector('.location-card').scrollIntoView({ block: 'center' })`)
  for (let i = 0; i < 30; i += 1) {
    await sleep(100)
    if (await evaluate(`(() => { const i = document.querySelector('.map-open img'); return Boolean(i.currentSrc) && i.complete; })()`)) break
  }
  return evaluate(`(() => {
    const box = document.querySelector('.map-open').getBoundingClientRect();
    const rel = (el) => { const r = el.getBoundingClientRect(); return { left: r.left - box.left, top: r.top - box.top, right: r.right - box.left, bottom: r.bottom - box.top }; };
    return {
      W: box.width,
      H: box.height,
      pill: rel(document.querySelector('.map-open-label')),
      credit: rel(document.querySelector('.map-credit')),
      src: (document.querySelector('.map-open img').currentSrc || '').split('/').pop(),
    };
  })()`)
}

const measureSvg = async (svg, W, H) => {
  await call('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false })
  await call('Page.navigate', { url: 'about:blank' })
  await sleep(100)
  return evaluate(`(() => {
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:40px;top:40px;width:${W}px;height:${H}px;overflow:hidden';
    host.innerHTML = ${JSON.stringify(svg)};
    const svg = host.querySelector('svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.style.display = 'block';
    document.body.appendChild(host);
    const origin = host.getBoundingClientRect();
    const rel = (r) => ({ left: r.left - origin.left, top: r.top - origin.top, right: r.right - origin.left, bottom: r.bottom - origin.top });
    const texts = [...svg.querySelectorAll('text')].map((t) => {
      const m = t.getScreenCTM();
      return { name: t.textContent, rect: rel(t.getBoundingClientRect()), px: parseFloat(getComputedStyle(t).fontSize) * Math.hypot(m.a, m.b) };
    });
    const pin = [...svg.querySelectorAll('g')].find((g) => (g.getAttribute('transform') || '').includes('scale(1.7)'));
    return { texts, pin: pin ? rel(pin.getBoundingClientRect()) : null };
  })()`)
}

const union = (rects) => ({
  left: Math.min(...rects.map((r) => r.left)),
  top: Math.min(...rects.map((r) => r.top)),
  right: Math.max(...rects.map((r) => r.right)),
  bottom: Math.max(...rects.map((r) => r.bottom)),
})
const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
const fmt = (r) => `[${r.left.toFixed(1)},${r.top.toFixed(1)} ${r.right.toFixed(1)},${r.bottom.toFixed(1)}]`

let failures = 0
let checks = 0

/* Chrome and its profile go away even when a case throws: a browser left on
   the debugging port is the orphan that breaks the next run. */
try {
  for (const width of WIDTHS) {
    for (const gutter of GUTTERS) {
      const pages = []
      for (const locale of LOCALES) pages.push(await measurePage(`${BASE}${locale}`, width, gutter))
      const { W, H, src } = pages[0]
      const pill = union(pages.map((p) => p.pill))
      pill.top -= PILL_LIFT
      const credit = union(pages.map((p) => p.credit))
      const sources = [...new Set(pages.map((p) => p.src))]
      const { texts, pin } = src ? await measureSvg(await svgText(src), W, H) : { texts: [], pin: null }

      const problems = []
      const check = (ok, message) => {
        checks += 1
        if (ok) return
        failures += 1
        problems.push(message)
      }

      check(sources.length === 1 && src === expectedSource(width), `e) served ${sources.join(' | ') || 'nothing'}, the breakpoint says ${expectedSource(width)}`)
      for (const t of texts) {
        check(!hit(t.rect, pill), `a) "${t.name}" ${fmt(t.rect)} touches the pill ${fmt(pill)}`)
        check(!hit(t.rect, credit), `a) "${t.name}" ${fmt(t.rect)} touches the credit ${fmt(credit)}`)
        check(t.rect.left >= 0 && t.rect.top >= 0 && t.rect.right <= W && t.rect.bottom <= H, `b) "${t.name}" ${fmt(t.rect)} is cut by the ${W.toFixed(0)}x${H.toFixed(0)} box`)
        check(t.px >= 9.5 && t.px <= 15, `c) "${t.name}" renders at ${t.px.toFixed(2)}px`)
      }
      check(
        Boolean(pin) && pin.left >= 0.2 * W && pin.right <= 0.8 * W && pin.top >= 0.2 * H && pin.bottom <= 0.8 * H,
        `d) pin ${pin ? fmt(pin) : 'missing'} is outside the middle 60% of ${W.toFixed(0)}x${H.toFixed(0)}`,
      )
      check(texts.some((t) => t.name === OFFICE_STREET), `f) "${OFFICE_STREET}" is not named`)
      check(texts.length >= MIN_LABELS, `g) ${texts.length} streets named, fewer than ${MIN_LABELS}`)

      const sizes = texts.map((t) => t.px.toFixed(1)).join('/') || '-'
      console.log(
        `${problems.length ? 'FAIL' : 'PASS'}  ${String(width).padEnd(4)} ${gutter.name.padEnd(3)}  box ${W.toFixed(1)}x${H.toFixed(1)}  ${(src || 'none').padEnd(15)} ${texts.length} names @ ${sizes} px  pin ${pin ? (pin.bottom - pin.top).toFixed(1) : '-'} px`,
      )
      for (const problem of problems) console.log(`        ${problem}`)
    }
  }

  console.log(`\n${checks} checks, ${failures === 0 ? 'OK' : `${failures} FAILED`}`)
} finally {
  await send('Browser.close').catch(() => {})
  socket.close()
  chrome.kill()
  await sleep(800)
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {})
}
process.exit(failures === 0 ? 0 : 1)
