import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
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
        const copy = read(HERO_COPY).trim()
        const script = read(BOOT_SCRIPT).replace('/*@hero-copy*/ null', () => copy)

        assertHeroBootIsWired(markup, read('src/components/Hero.css'), JSON.parse(copy))

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

export default defineConfig({
  plugins: [react(), heroCritical()],
  server: {
    port: 3000,
    open: true,
  },
})
