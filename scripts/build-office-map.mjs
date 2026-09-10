/* Dibuja public/map/office.svg: el plano de las manzanas alrededor de la
   oficina, con la geometria real de las calles y de los edificios.
   Se corre a mano cuando cambia la direccion, no dentro de `npm run build`:
   el artefacto versionado es el SVG, asi el build nunca sale a la red.

     node scripts/build-office-map.mjs

   Fuente: OpenStreetMap via Overpass, que es un servicio de solo lectura
   separado de la API de edicion y de los servidores de tiles. No se pide un
   solo tile a tile.openstreetmap.org: su politica reserva las tiles para el
   viewport que un humano esta mirando en vivo y llama bulk downloading a
   cualquier descarga anticipada. Aca bajamos los datos ODbL una vez y
   componemos el dibujo nosotros, que es una Produced Work: la ODbL 4.3 pide
   el aviso de procedencia, no que la imagen quede bajo ODbL. El aviso va
   visible al pie del plano, en ContactSection. */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = process.env.OFFICE_MAP_OUT_DIR ?? resolve(ROOT, 'public/map');

const OFFICE = { lat: -25.27796, lon: -57.56659 };

/* Dos recortes de la misma esquina, no uno estirado. La tarjeta es apaisada
   en desktop y casi cuadrada en mobile: con un solo archivo, object-fit cover
   deja el plano de mobile a poco mas de la mitad de escala y los nombres de
   calle bajan a 7 px, que es textura, no informacion. Cada uno se descarga
   solo en su breakpoint, asi que el segundo archivo no le cuesta un byte a
   nadie. El pin esta al centro de los dos, asi que el recorte de cover se
   come el mismo margen de los dos lados. */
const CROPS = [
  { name: 'office-wide', w: 520, h: 350 },
  { name: 'office-tall', w: 300, h: 230 }
];
const UNITS_PER_M = 2;

/* El cuerpo de las etiquetas va en metros y no en unidades: los dos recortes
   se muestran a una escala de pantalla parecida (alrededor de 1,15 px por
   metro), asi que fijar la altura en metros las deja del mismo tamano en px
   en los dos, sin una constante por archivo. */
const LABEL_M = 9.5;

/* Ancho medio de caracter de una grotesca a cuerpo 1. Sirve para estimar la
   caja del texto y decidir si la etiqueta entra en el recorte. */
const CHAR_W = 0.52;

/* Radio del halo del pin mas un respiro. Ninguna etiqueta entra ahi: el
   degradado le come el final a la palabra y la calle queda a medio nombre. */
const PIN_CLEAR = 68;

const M_PER_DEG_LAT = 110574;
const M_PER_DEG_LON = 111320 * Math.cos((OFFICE.lat * Math.PI) / 180);

/* Un poco mas ancho que la ventana para que las calles entren y salgan del
   plano cortadas por el borde y no terminadas en el aire. */
const FETCH_MARGIN_M = 260;

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const USER_AGENT =
  'GuaraniCapitalSite/1.0 (+https://guaranicapital.com; contact: gaston@thebrightidea.ai)';



const palette = {
  land: '#e9ecf0',
  green: '#dbe4d9',
  pitch: '#d2ddcf',
  water: '#d4dfea',
  building: '#d5dbe3',
  buildingEdge: '#c9d1db',
  casing: '#c7cfd9',
  surface: '#ffffff',
  service: '#f7f9fb',
  path: '#c2cad4',
  label: '#5a6674',
  ink: '#2c3e50',
  accent: '#d4af37'
};

/* Casing y relleno en metros de ancho dibujado. A este zoom la escala de
   pantalla es de poco mas de 1 px por metro, asi que anchos casi reales dan
   la proporcion de calle que uno espera de un plano. */
const ROADS = {
  secondary: { casing: 15, fill: 11, z: 5 },
  secondary_link: { casing: 11, fill: 8, z: 5 },
  tertiary: { casing: 12, fill: 8.5, z: 4 },
  tertiary_link: { casing: 9, fill: 6.5, z: 4 },
  residential: { casing: 9.5, fill: 6.5, z: 3 },
  unclassified: { casing: 9.5, fill: 6.5, z: 3 },
  living_street: { casing: 8, fill: 5.5, z: 3 },
  pedestrian: { casing: 7.5, fill: 5.5, z: 2 },
  service: { casing: 5.5, fill: 3.5, z: 1 }
};

const PATHS = new Set(['footway', 'path', 'steps', 'track']);

const GREEN = new Set(['grass', 'recreation_ground', 'village_green', 'meadow', 'forest']);
const GREEN_LEISURE = new Set(['park', 'garden', 'golf_course', 'playground', 'pitch']);

let VIEW_W = 0;
let VIEW_H = 0;

const project = (lat, lon) => [
  (lon - OFFICE.lon) * M_PER_DEG_LON * UNITS_PER_M + VIEW_W / 2,
  (OFFICE.lat - lat) * M_PER_DEG_LAT * UNITS_PER_M + VIEW_H / 2
];

const round = (n) => Math.round(n * 10) / 10;

const toPath = (geometry, close) => {
  let d = '';
  for (let i = 0; i < geometry.length; i += 1) {
    const [x, y] = project(geometry[i].lat, geometry[i].lon);
    d += `${i === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`;
  }
  return close ? `${d}Z` : d;
};

/* Descarta lo que cae entero fuera del recorte. Sin esto el SVG carga las
   manzanas del margen de descarga, que nadie llega a ver. */
const MARGIN = 40;
const visible = (geometry) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { lat, lon } of geometry) {
    const [x, y] = project(lat, lon);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return maxX >= -MARGIN && minX <= VIEW_W + MARGIN && maxY >= -MARGIN && minY <= VIEW_H + MARGIN;
};

const contains = (geometry, lat, lon) => {
  let inside = false;
  for (let i = 0, j = geometry.length - 1; i < geometry.length; j = i, i += 1) {
    const yi = geometry[i].lat;
    const xi = geometry[i].lon;
    const yj = geometry[j].lat;
    const xj = geometry[j].lon;
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function fetchOsm() {
  const dLat = (Math.max(...CROPS.map((c) => c.h)) / 2 + FETCH_MARGIN_M) / M_PER_DEG_LAT;
  const dLon = (Math.max(...CROPS.map((c) => c.w)) / 2 + FETCH_MARGIN_M) / M_PER_DEG_LON;
  const bbox = [OFFICE.lat - dLat, OFFICE.lon - dLon, OFFICE.lat + dLat, OFFICE.lon + dLon]
    .map((n) => n.toFixed(6))
    .join(',');

  const query = `[out:json][timeout:90];(
    way["highway"](${bbox});
    way["building"](${bbox});
    way["landuse"](${bbox});
    way["leisure"](${bbox});
    way["natural"](${bbox});
    way["waterway"](${bbox});
    way["amenity"="parking"](${bbox});
  );out geom;`;

  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ data: query })
  });
  if (!res.ok) throw new Error(`Overpass respondio ${res.status}`);
  const body = await res.json();
  return body.elements.filter((e) => Array.isArray(e.geometry) && e.geometry.length > 1);
}

/* Etiqueta cada calle sobre su tramo recto mas largo dentro del recorte, para
   que el texto no se monte sobre una curva ni se salga por el borde. */
function labelsFor(highways) {
  const best = new Map();
  const [pinX, pinY] = project(OFFICE.lat, OFFICE.lon);

  for (const way of highways) {
    const name = way.tags.name;
    if (!name) continue;
    const rank = ROADS[way.tags.highway]?.z ?? 0;
    if (rank < 3) continue;

    for (let i = 0; i < way.geometry.length - 1; i += 1) {
      const [x1, y1] = project(way.geometry[i].lat, way.geometry[i].lon);
      const [x2, y2] = project(way.geometry[i + 1].lat, way.geometry[i + 1].lon);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const length = Math.hypot(x2 - x1, y2 - y1);
      if (length === 0) continue;

      /* La caja del texto se mide sobre el eje del tramo, no sobre el eje
         horizontal: un nombre de calle vertical se sale por arriba y por
         abajo, y un margen medido solo en x lo deja cortado igual. */
      const half = (name.length * LABEL_M * UNITS_PER_M * CHAR_W) / 2;
      const ux = (x2 - x1) / length;
      const uy = (y2 - y1) / length;
      const pad = LABEL_M * UNITS_PER_M;
      const ends = [
        [mx + ux * half, my + uy * half],
        [mx - ux * half, my - uy * half]
      ];
      if (
        ends.some(([ex, ey]) => ex < pad || ex > VIEW_W - pad || ey < pad || ey > VIEW_H - pad)
      ) {
        continue;
      }
      if (ends.some(([ex, ey]) => Math.hypot(ex - pinX, ey - pinY) < PIN_CLEAR)) continue;
      if (Math.hypot(mx - pinX, my - pinY) < PIN_CLEAR) continue;

      const prev = best.get(name);
      if (prev && prev.length >= length) continue;

      let angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;
      best.set(name, { name, rank, length, x: mx, y: my, angle });
    }
  }

  return [...best.values()]
    .filter((l) => l.length > l.name.length * LABEL_M * UNITS_PER_M * CHAR_W)
    .sort((a, b) => b.rank - a.rank || b.length - a.length)
    .slice(0, 7);
}

function render(elements) {
  const highways = [];
  const buildings = [];
  const areas = [];

  for (const el of elements) {
    const tags = el.tags ?? {};
    if (!visible(el.geometry)) continue;

    if (tags.highway) {
      if (ROADS[tags.highway] || PATHS.has(tags.highway)) highways.push(el);
      continue;
    }
    if (tags.building) {
      buildings.push(el);
      continue;
    }
    if (tags.natural === 'water' || tags.waterway) {
      areas.push({ el, fill: palette.water });
      continue;
    }
    if (tags.natural === 'wood' || tags.natural === 'tree_row' || GREEN.has(tags.landuse)) {
      areas.push({ el, fill: palette.green });
      continue;
    }
    if (GREEN_LEISURE.has(tags.leisure)) {
      areas.push({ el, fill: tags.leisure === 'pitch' ? palette.pitch : palette.green });
    }
  }

  const office = buildings.find((b) => contains(b.geometry, OFFICE.lat, OFFICE.lon));
  const [px, py] = project(OFFICE.lat, OFFICE.lon);

  const out = [];
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" width="${VIEW_W}" height="${VIEW_H}">`
  );
  out.push(`<rect width="${VIEW_W}" height="${VIEW_H}" fill="${palette.land}"/>`);

  for (const { el, fill } of areas) {
    out.push(`<path d="${toPath(el.geometry, true)}" fill="${fill}"/>`);
  }

  out.push(
    `<g fill="${palette.building}" stroke="${palette.buildingEdge}" stroke-width="1">`,
    ...buildings.filter((b) => b !== office).map((b) => `<path d="${toPath(b.geometry, true)}"/>`),
    '</g>'
  );

  const drawn = highways
    .filter((h) => ROADS[h.tags.highway])
    .sort((a, b) => ROADS[a.tags.highway].z - ROADS[b.tags.highway].z);

  const stroke = 'stroke-linecap="round" stroke-linejoin="round" fill="none"';
  out.push(`<g ${stroke} stroke="${palette.casing}">`);
  for (const h of drawn) {
    out.push(
      `<path d="${toPath(h.geometry, false)}" stroke-width="${ROADS[h.tags.highway].casing * UNITS_PER_M}"/>`
    );
  }
  out.push('</g>');

  out.push(`<g ${stroke}>`);
  for (const h of drawn) {
    const fill = h.tags.highway === 'service' ? palette.service : palette.surface;
    out.push(
      `<path d="${toPath(h.geometry, false)}" stroke="${fill}" stroke-width="${ROADS[h.tags.highway].fill * UNITS_PER_M}"/>`
    );
  }
  out.push('</g>');

  const paths = highways.filter((h) => PATHS.has(h.tags.highway));
  if (paths.length) {
    out.push(`<g ${stroke} stroke="${palette.path}" stroke-width="3" stroke-dasharray="7 6">`);
    for (const p of paths) out.push(`<path d="${toPath(p.geometry, false)}"/>`);
    out.push('</g>');
  }

  if (office) {
    out.push(
      `<path d="${toPath(office.geometry, true)}" fill="${palette.accent}" fill-opacity="0.34" stroke="${palette.ink}" stroke-width="1.6"/>`
    );
  }

  out.push(
    `<g font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${LABEL_M * UNITS_PER_M}" letter-spacing="0.6" fill="${palette.label}" text-anchor="middle">`
  );
  for (const l of labelsFor(highways)) {
    out.push(
      `<text transform="translate(${round(l.x)} ${round(l.y)}) rotate(${round(l.angle)})" dy="5">${esc(l.name)}</text>`
    );
  }
  out.push('</g>');

  /* Halo debajo del pin: sin el, la punta cae sobre una manzana gris y el pin
     deja de leerse como el punto de interes. Va degradado y no como circulo
     plano, que a este tamano se lee como una mancha con borde. */
  out.push(
    '<radialGradient id="halo">',
    `<stop offset="0" stop-color="${palette.surface}" stop-opacity="0.85"/>`,
    `<stop offset="0.55" stop-color="${palette.surface}" stop-opacity="0.6"/>`,
    `<stop offset="1" stop-color="${palette.surface}" stop-opacity="0"/>`,
    '</radialGradient>',
    `<circle cx="${round(px)}" cy="${round(py)}" r="56" fill="url(#halo)"/>`,
    `<ellipse cx="${round(px)}" cy="${round(py + 2)}" rx="11" ry="4" fill="${palette.ink}" fill-opacity="0.16"/>`,
    `<g transform="translate(${round(px)} ${round(py)}) scale(1.7)">`,
    `<path transform="translate(-12 -22)" fill="${palette.ink}" d="M12 0a9 9 0 0 0-9 9c0 6.6 9 15 9 15s9-8.4 9-15a9 9 0 0 0-9-9Z"/>`,
    `<circle cx="0" cy="-13" r="3.6" fill="${palette.accent}"/>`,
    '</g>',
    '</svg>'
  );

  return { svg: out.join(''), stats: { highways: drawn.length, buildings: buildings.length, office: Boolean(office) } };
}

const elements = await fetchOsm();
await mkdir(OUT_DIR, { recursive: true });

for (const crop of CROPS) {
  VIEW_W = crop.w * UNITS_PER_M;
  VIEW_H = crop.h * UNITS_PER_M;

  const { svg, stats } = render(elements);
  if (stats.highways < 10 || stats.buildings < 40) {
    throw new Error(
      `${crop.name}: Overpass devolvio ${stats.highways} calles y ${stats.buildings} edificios. Con tan poco el plano sale vacio, no se escribe.`
    );
  }

  await writeFile(resolve(OUT_DIR, `${crop.name}.svg`), svg);
  console.log(
    `${crop.name}.svg: ${(svg.length / 1024).toFixed(1)} KB, ${crop.w}x${crop.h} m, ${stats.buildings} edificios, ${stats.highways} calles, edificio propio ${stats.office ? 'resaltado' : 'no identificado'}`
  );
}
