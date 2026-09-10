/*
  Serves dist/ the way Vercel does: filesystem first, then the rewrites from
  vercel.json in order, plus its response headers.

  `vite preview` cannot stand in for this. Its HTML fallback sends /en/anything
  to /index.html, which is the Spanish document, so the deep link half of
  scripts/verify-i18n.mjs would fail against a perfectly good build. Reading the
  real vercel.json also means the rewrite that makes /en/<anything> serve the
  English document is the shipped one, not a paraphrase of it.

  Usage: node scripts/serve-dist.mjs [dist] [port]
*/

import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = resolve(root, process.argv[2] ?? 'dist')
const port = Number(process.argv[3] ?? 4173)

const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'))

const CONTENT_TYPES = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
}

/* Vercel source syntax: `:name` is one path segment, `:name*` is any number of
   them, and anything else is a regular expression anchored at both ends. A
   trailing `/:name*` matches the bare prefix too, so `/en/:path*` covers `/en`,
   which is the behaviour the redundant looking `/en` rewrite is there to
   guarantee on Vercel's own matcher. */
const toRegExp = (source) =>
  new RegExp(
    `^${source.replace(/\/:[a-zA-Z]+\*/g, '(?:/.*)?').replace(/:[a-zA-Z]+/g, '[^/]+')}$`,
  )

const rewrites = (config.rewrites ?? []).map((rule) => ({
  matches: toRegExp(rule.source),
  destination: rule.destination,
}))

const headerRules = (config.headers ?? []).map((rule) => ({
  matches: toRegExp(rule.source),
  headers: rule.headers,
}))

const COMPRESSIBLE = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.webmanifest', '.xml'])

// `gzip;q=0` is an explicit refusal, not an offer, so the weight has to be read.
const acceptsGzip = (header = '') =>
  header.split(',').some((part) => {
    const [coding, ...params] = part.trim().split(';')
    if (coding.trim().toLowerCase() !== 'gzip') return false
    const q = params.map((param) => param.trim()).find((param) => param.startsWith('q='))
    return q === undefined || Number(q.slice(2)) > 0
  })

const readFileFor = async (pathname) => {
  const target = join(dist, normalize(pathname))
  if (!target.startsWith(dist)) return null
  try {
    const info = await stat(target)
    if (info.isDirectory()) return readFileFor(join(pathname, 'index.html'))
    return { target, body: await readFile(target) }
  } catch {
    return null
  }
}

createServer(async (req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent((req.url ?? '/').split('?')[0])
  } catch {
    // A malformed percent escape throws, and an uncaught throw in here takes
    // the harness down in the middle of a verification run.
    res.writeHead(400).end('bad request')
    return
  }

  for (const rule of headerRules) {
    if (!rule.matches.test(pathname)) continue
    for (const { key, value } of rule.headers) res.setHeader(key, value)
  }

  let file = await readFileFor(pathname)
  if (!file) {
    const rule = rewrites.find((candidate) => candidate.matches.test(pathname))
    if (rule) file = await readFileFor(rule.destination)
  }

  if (!file) {
    res.writeHead(404).end('not found')
    return
  }

  res.setHeader('Content-Type', CONTENT_TYPES[extname(file.target)] ?? 'application/octet-stream')

  /* Vercel compresses text before sending it. Serving it raw here would make
     every size measured off the network the size of the file on disk, not the
     size of the transfer, which is the number that matters for an SVG. */
  if (COMPRESSIBLE.has(extname(file.target))) {
    res.setHeader('Vary', 'Accept-Encoding')
    if (acceptsGzip(req.headers['accept-encoding'])) {
      res.setHeader('Content-Encoding', 'gzip')
      res.writeHead(200).end(gzipSync(file.body))
      return
    }
  }

  res.writeHead(200).end(file.body)
// Loopback only. This is a verification harness, not something to publish to
// whatever network the machine happens to be on.
}).listen(port, '127.0.0.1', () => {
  console.log(`serving ${dist} with vercel.json rewrites on http://localhost:${port}`)
})
