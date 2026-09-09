/*
  Turns the single-page build into one real HTML file per language.

  `vite build` leaves dist/index.html with an empty #root, which is why a link
  to /en/ used to return the Spanish page and why the body copy only existed
  once the bundle ran. This renders the app in Node, once per language, and
  writes the result into #root along with that language's head metadata, so the
  translated page is in the response itself with no JavaScript involved.

  Runs after both `vite build` and `vite build --ssr` (see package.json).
*/

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = resolve(root, 'dist')

const {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  renderLanguage,
  localeDocument,
  sitemapXml,
  robotsTxt,
} = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

const template = await readFile(join(dist, 'index.html'), 'utf8')

/* React escapes the text child of a <style> tag when it renders on the server.
   Entities are not decoded inside <style>, so `content: &#x27;&#x27;;` reaches
   the CSS parser verbatim, the declaration is dropped, and the mismatch against
   the client render makes React discard the whole prerendered tree. It cost the
   footer hairline once and it is invisible in review, so it fails the build.
   The fix at the component is <style dangerouslySetInnerHTML={{ __html }} />. */
const assertStyleTagsAreVerbatim = (html, language) => {
  for (const block of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const entity = block[1].match(/&(?:#x?[0-9a-fA-F]+|amp|quot|lt|gt|apos);/)
    if (entity) {
      const at = block[1].indexOf(entity[0])
      throw new Error(
        `${language}: a <style> block was escaped by the server renderer, so its CSS is broken.\n` +
          `  ${entity[0]} in "...${block[1].slice(Math.max(0, at - 60), at + 20).trim()}..."`,
      )
    }
  }
}

const documents = LANGUAGES.map((language) => {
  const appHtml = renderLanguage(language)
  /* An empty render would still produce a valid looking file: right <html
     lang>, right canonical, and a body with nothing in it. That is the failure
     this whole step exists to prevent, so it stops the build instead. */
  if (appHtml.length < 1000) {
    throw new Error(`${language} rendered ${appHtml.length} bytes, the app did not render`)
  }
  const html = localeDocument(template, language, appHtml, '/')
  assertStyleTagsAreVerbatim(html, language)
  return {
    path: language === DEFAULT_LANGUAGE ? 'index.html' : join(language, 'index.html'),
    html,
  }
})

await Promise.all(
  documents.map(async ({ path, html }) => {
    const target = join(dist, path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, html)
  }),
)

await Promise.all([
  writeFile(join(dist, 'sitemap.xml'), sitemapXml()),
  writeFile(join(dist, 'robots.txt'), robotsTxt()),
])

console.log(
  `prerendered ${documents.map((d) => d.path).join(', ')} plus sitemap.xml and robots.txt`,
)
