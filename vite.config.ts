import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { transform } from 'esbuild'

const root = fileURLToPath(new URL('.', import.meta.url))

/* The hero is the whole first viewport, so none of it is allowed to wait for
   the app bundle. These files are the single source of truth for the hero and
   get inlined into index.html at their markers: same rules, same copy, no
   second copy to keep in sync. */
const CRITICAL_CSS = ['src/styles/tokens.css', 'src/styles/fonts.css', 'src/components/Hero.css']
const BOOT_MARKUP = 'src/components/hero-boot.html'
const BOOT_SCRIPT = 'src/components/hero-boot.js'
const HERO_COPY = 'src/i18n/hero.json'

/* The static hero and the React hero are two hand-written copies of the same
   markup. Copy and styles are single-sourced, but the structure is not, and a
   class renamed in Hero.css would leave the first viewport unstyled with
   nothing to catch it. Each data-hb value is also a path into hero.json, so a
   renamed copy key would silently stop localising. Both are cheap to assert. */
function assertHeroBootIsWired(markup: string, css: string, copy: unknown) {
  const problems: string[] = []

  /* Tokenised, not a substring search. `css.includes('.hero-container')` is
     also true of `.hero-containerRENAMED`, so a substring test would pass on a
     rename inside Hero.css, which is the direction that actually happens given
     that file is the source of truth. Comments are stripped so a name that
     survives only in prose does not count as defined. */
  const defined = new Set(
    [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\.([A-Za-z_][-\w]*)/g)].map((m) => m[1]),
  )
  const classes = new Set(
    [...markup.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean),
  )
  for (const name of classes) {
    if (!defined.has(name)) problems.push(`class "${name}" is not defined in Hero.css`)
  }

  const languages = Object.entries(copy as Record<string, unknown>)
  for (const [, path] of markup.matchAll(/data-hb(?:-stat)?="([^"]+)"/g)) {
    for (const [lang, strings] of languages) {
      const value = path
        .split('.')
        .reduce<unknown>((v, k) => (v as Record<string, unknown>)?.[k], strings)
      if (typeof value !== 'string') problems.push(`hero.json ${lang} has no string at "${path}"`)
    }
  }

  /* The build writes each language's copy into this markup by replacing the
     text that follows an element's opening tag, which is also the node the
     inline boot script reads a counter target from. Markup that opened with a
     child element instead would leave that line in Spanish on /en/ and /pt/,
     and nothing downstream would notice: the page would simply be half
     translated. Checked here, independently of the code that depends on it. */
  for (const tag of markup.matchAll(/<([a-z]+)\b[^>]*\bdata-hb(?:-stat)?="([^"]+)"[^>]*>/g)) {
    const [open, name, key] = tag
    const inner = markup.slice(tag.index + open.length)
    const close = inner.indexOf(`</${name}>`)
    const content = close === -1 ? inner : inner.slice(0, close)
    const slot = content.slice(0, content.indexOf('<') === -1 ? undefined : content.indexOf('<'))

    if (!slot.trim()) {
      problems.push(`"${key}" has no text node for the build to localise`)
      continue
    }
    /* Only that first text node is rewritten. Copy sitting after a child
       element, `Foo <b>bar</b>`, would keep half the line in Spanish on /en/
       and /pt/ and throw nothing, which is the one way this could fail
       quietly. The primary CTA's trailing arrow is fine: it is an svg with no
       text of its own. */
    if (content.slice(slot.length).replace(/<[^>]*>/g, '').trim()) {
      problems.push(`"${key}" has copy after a child element that the build cannot reach`)
    }
  }

  if (problems.length) {
    throw new Error(`hero-boot.html is out of sync:\n  ${problems.join('\n  ')}`)
  }
}

function heroCritical(): Plugin {
  const read = (path: string) => readFileSync(resolve(root, path), 'utf8')
  const sources = [...CRITICAL_CSS, BOOT_MARKUP, BOOT_SCRIPT, HERO_COPY]
  let minify = false

  return {
    name: 'guarani-hero-critical',

    configResolved(config) {
      minify = config.command === 'build'
    },

    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const css = CRITICAL_CSS.map(read).join('\n')
        /* JSX drops the whitespace between elements and a hand-written HTML
           file keeps it, so collapsing gaps between tags (never inside text)
           leaves the static tree with the same nodes React builds. Verified not
           to change layout on its own; it is here so the two trees stay
           structurally comparable, and it trims ~460 bytes off every response. */
        const markup = read(BOOT_MARKUP).replace(/>\s+</g, '><')
        const script = read(BOOT_SCRIPT)

        assertHeroBootIsWired(markup, read('src/components/Hero.css'), JSON.parse(read(HERO_COPY)))

        const [inlineCss, inlineScript] = minify
          ? await Promise.all([
              transform(css, { loader: 'css', minify: true }).then((r) => r.code),
              transform(script, { loader: 'js', minify: true }).then((r) => r.code),
            ])
          : [css, script]

        return html
          .replace('<!--@hero-critical-css-->', () => `<style>${inlineCss}</style>`)
          .replace('<!--@hero-boot-->', () => markup)
          .replace('<!--@hero-boot-script-->', () => `<script>${inlineScript}</script>`)
      },
    },

    /* None of the inlined files is part of the module graph, so the dev server
       has no reason to know they changed unless we tell it. */
    configureServer(server) {
      const paths = sources.map((path) => resolve(root, path))
      server.watcher.add(paths)
      server.watcher.on('change', (file) => {
        if (paths.includes(file)) server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

type LocaleModules = {
  languageForPath: (pathname: string) => string
  localeDocument: (
    html: string,
    language: string,
    appHtml?: string,
    routePath?: string,
  ) => string
}

/* Production ships three real HTML files, one per language, built by
   scripts/prerender.mjs. The dev server has one template and Vite's SPA
   fallback would hand the Spanish document to /en/ and /pt/, so the same
   per language transform runs here per request. Without it the address bar and
   the copy on screen disagree in dev only, which is the worst place for them
   to disagree. */
function localeDocuments(): Plugin {
  const loadLocaleModules = async (server: ViteDevServer): Promise<LocaleModules> => {
    const [locales, document] = await Promise.all([
      server.ssrLoadModule('/src/i18n/locales.ts'),
      server.ssrLoadModule('/src/i18n/document.ts'),
    ])
    return {
      languageForPath: locales.languageForPath as LocaleModules['languageForPath'],
      localeDocument: document.localeDocument as LocaleModules['localeDocument'],
    }
  }

  return {
    name: 'guarani-locale-documents',
    apply: 'serve',

    /* Registered without the usual post-hook wrapper so it runs ahead of
       Vite's own index.html middleware, which is the thing being replaced. */
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '/').split('?')[0]
        const wantsDocument =
          req.method === 'GET' &&
          req.headers.accept?.includes('text/html') === true &&
          !/\.[a-z0-9]+$/i.test(url)

        if (!wantsDocument) {
          next()
          return
        }

        void (async () => {
          try {
            const template = readFileSync(resolve(root, 'index.html'), 'utf8')
            const [html, modules] = await Promise.all([
              server.transformIndexHtml(url, template, req.originalUrl),
              loadLocaleModules(server),
            ])
            res.setHeader('Content-Type', 'text/html')
            res.end(modules.localeDocument(html, modules.languageForPath(url)))
          } catch (error) {
            next(error)
          }
        })()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), heroCritical(), localeDocuments()],
  server: {
    port: 3000,
    open: true,
  },
})
