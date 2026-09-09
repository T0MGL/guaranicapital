/*
  Checks the served HTML of every language, with no JavaScript executed: the
  declared language, the canonical, the reciprocal hreflang set, and translated
  body copy from sections below the hero.

  The expectations below are written out by hand rather than imported from
  src/i18n. That is deliberate. A check that reads its answer from the code it
  is checking passes whatever that code happens to do, including serving the
  Spanish page at /en/, which is the exact regression this guards against.

  The target has to be a server that applies vercel.json, because the deep link
  checks below are checks on those rewrites. `vite preview` is not one: its HTML
  fallback sends /en/anything to /index.html, the Spanish document, and the
  checks would fail on a healthy build. Use a Vercel deployment, or locally:

    npm run build
    npm run serve:dist &
    npm run verify:i18n -- http://localhost:4173
    kill %1

  Do not skip the kill. An orphan holding a fixed port is what sabotages the
  next run in this repo.
*/

const ORIGIN = 'https://www.guaranicapital.com'

const ALTERNATES = [
  `<link rel="alternate" hreflang="es" href="${ORIGIN}/" />`,
  `<link rel="alternate" hreflang="en" href="${ORIGIN}/en/" />`,
  `<link rel="alternate" hreflang="pt" href="${ORIGIN}/pt/" />`,
  `<link rel="alternate" hreflang="x-default" href="${ORIGIN}/" />`,
]

/* Probes from sections that render below the first viewport, so a hero-only
   prerender would not satisfy them. Spanish and Portuguese differ here by an
   accent ("tecnología" against "tecnologia"), which is what lets the wrong
   document fail the check instead of passing on a shared prefix. The last two
   in each set are the commission section and the FAQ: both are prose a visitor
   only ever sees after the bundle runs unless the prerender put them in the
   response, which is the whole point of publishing the number. */
const EXPECT = {
  es: {
    url: '/',
    lang: 'es',
    canonical: `${ORIGIN}/`,
    switcherLabel: 'aria-label="Idioma: Español"',
    firstQuestion: '¿Qué incluye el servicio de administración?',
    probes: [
      'Combinamos tecnología, procesos rigurosos y conocimiento local',
      'Todo lo que necesitás para ganar',
      'de la facturación neta de cada reserva confirmada',
      'La limpieza entre estadías la paga el huésped',
      '¿Cuál es la comisión de gestión?',
    ],
  },
  en: {
    url: '/en/',
    lang: 'en',
    canonical: `${ORIGIN}/en/`,
    switcherLabel: 'aria-label="Language: English"',
    firstQuestion: 'What does the management service include?',
    probes: [
      'We combine technology, rigorous processes and local knowledge',
      'Everything you need to earn',
      'of the net billing of each confirmed reservation',
      'Cleaning between stays is paid by the guest',
      'What is your management fee?',
    ],
  },
  pt: {
    url: '/pt/',
    lang: 'pt',
    canonical: `${ORIGIN}/pt/`,
    switcherLabel: 'aria-label="Idioma: Português"',
    firstQuestion: 'O que inclui o serviço de administração?',
    probes: [
      'Combinamos tecnologia, processos rigorosos e conhecimento local',
      'Tudo o que você precisa para ganhar',
      'do faturamento líquido de cada reserva confirmada',
      'A limpeza entre estadias é paga pelo hóspede',
      'Qual é a comissão de gestão?',
    ],
  },
}

/* Deep links under a language prefix have to reach that language's document.
   A single catch-all rewrite sends them to the Spanish one and nothing on the
   page says so. */
const DEEP_LINKS = [
  { url: '/en/anything', language: 'en' },
  { url: '/pt/anything/deeper', language: 'pt' },
  /* The bare prefix, with no trailing slash. It resolves through the directory
     index rather than a rewrite, so it is the one shape a rewrite change cannot
     be assumed to cover. */
  { url: '/en', language: 'en' },
  { url: '/pt', language: 'pt' },
]

const base = (process.argv[2] ?? '').replace(/\/$/, '')
if (!base) {
  console.error('usage: node scripts/verify-i18n.mjs <base-url>')
  process.exit(2)
}

let failures = 0

const check = (label, ok, detail = '') => {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`)
}

const snippet = (html, needle) => {
  const at = html.indexOf(needle)
  if (at === -1) return ''
  return `@${at}: ...${html.slice(Math.max(0, at - 20), at + needle.length + 20).replace(/\s+/g, ' ')}...`
}

const documentFor = async (url) => {
  try {
    const response = await fetch(`${base}${url}`)
    if (!response.ok) {
      check(`${url} responds 200`, false, `got ${response.status}`)
      return null
    }
    return await response.text()
  } catch (error) {
    check(`${url} is reachable`, false, error.message)
    return null
  }
}

for (const [language, expected] of Object.entries(EXPECT)) {
  console.log(`\n# ${expected.url}`)
  const html = await documentFor(expected.url)
  if (html === null) continue

  const declared = html.match(/<html lang="([^"]*)"/)?.[1]
  check(`html lang is "${expected.lang}"`, declared === expected.lang, `got "${declared}"`)

  check(
    `canonical is ${expected.canonical}`,
    html.includes(`<link rel="canonical" href="${expected.canonical}" />`),
    html.match(/<link rel="canonical"[^>]*>/)?.[0] ?? 'no canonical',
  )

  for (const alternate of ALTERNATES) {
    check(`hreflang ${alternate.match(/hreflang="([^"]*)"/)[1]}`, html.includes(alternate), alternate)
  }

  /* The switcher's accessible name is the one string that used to be hardcoded
     Spanish on every document, which no body copy probe would have caught. */
  check(
    `switcher label is in ${language}`,
    html.includes(expected.switcherLabel),
    html.match(/aria-label="[^"]*"/)?.[0] ?? 'no aria-label',
  )

  for (const probe of expected.probes) {
    check(`${language} body copy in raw HTML`, html.includes(probe), snippet(html, probe) || `"${probe}" missing`)
  }

  for (const [other, meta] of Object.entries(EXPECT)) {
    if (other === language) continue
    const leaked = meta.probes.filter((probe) => html.includes(probe))
    check(`no ${other} body copy`, leaked.length === 0, leaked.join(' | '))
  }

  /* The FAQ schema used to be appended to document.head from an effect, which
     means it existed only for a visitor with a browser and never for the
     crawler it was written for. Parsing it here, per document, is what makes
     that regression impossible to reintroduce quietly. */
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const faqBlocks = blocks.filter((block) => block[1].includes('"FAQPage"'));
  check(`exactly one FAQPage block`, faqBlocks.length === 1, `found ${faqBlocks.length}`);

  if (faqBlocks.length === 1) {
    let schema = null;
    try {
      schema = JSON.parse(faqBlocks[0][1]);
    } catch (error) {
      check('FAQPage JSON parses', false, error.message);
    }
    if (schema) {
      check('FAQPage JSON parses', true);
      check(
        `FAQPage inLanguage is "${expected.lang}"`,
        schema.inLanguage === expected.lang,
        `got "${schema.inLanguage}"`,
      );
      const questions = (schema.mainEntity ?? []).map((entry) => entry.name);
      check(`FAQPage carries every question`, questions.length === 14, `got ${questions.length}`);
      check(
        `FAQPage is written in ${language}`,
        questions[0] === expected.firstQuestion,
        `got "${questions[0]}"`,
      );
      const answers = (schema.mainEntity ?? []).map((entry) => entry.acceptedAnswer?.text ?? '');
      check(
        'every FAQPage answer is present and non empty',
        answers.length === questions.length && answers.every((text) => text.length > 40),
      );
      /* The answers are what an answer engine quotes, so they have to be the
         ones the same document shows on screen, not another language's. */
      const orphan = questions.filter((question) => !html.includes(question));
      check('every FAQPage question is also in the served copy', orphan.length === 0, orphan.join(' | '));
    }
  }
}

for (const { url, language } of DEEP_LINKS) {
  console.log(`\n# ${url}`)
  const html = await documentFor(url)
  if (html === null) continue
  const declared = html.match(/<html lang="([^"]*)"/)?.[1]
  check(`deep link serves the ${language} document`, declared === language, `html lang "${declared}"`)
  check(
    `deep link carries ${language} body copy`,
    EXPECT[language].probes.every((probe) => html.includes(probe)),
  )
}

console.log(`\n${failures === 0 ? 'OK' : `${failures} FAILED`}`)
process.exit(failures === 0 ? 0 : 1)
