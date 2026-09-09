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
        const script = read(BOOT_SCRIPT).replace(
          '/*@hero-copy*/ null',
          () => read(HERO_COPY).trim(),
        )

        const [inlineCss, inlineScript] = minify
          ? await Promise.all([
              transform(css, { loader: 'css', minify: true }).then((r) => r.code),
              transform(script, { loader: 'js', minify: true }).then((r) => r.code),
            ])
          : [css, script]

        return html
          .replace('<!--@hero-critical-css-->', () => `<style>${inlineCss}</style>`)
          .replace('<!--@hero-boot-->', () => read(BOOT_MARKUP))
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
