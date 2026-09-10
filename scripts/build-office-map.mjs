/* Dibuja public/map/office-tall.svg y public/map/office-wide.svg: el plano de
   las manzanas alrededor de la oficina, con la geometria real de las calles y
   de los edificios.
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

/* La calle de la direccion. Tiene que salir rotulada en los dos recortes: es
   la que confirma que el pin esta donde dice el texto de al lado. */
const OFFICE_STREET = 'Cecilio da Silva';

/* Cada recorte se sirve a un rango de cajas del sitio construido, y lo que
   una etiqueta no puede ocupar sale de recorrer ese rango entero: cada
   viewport de 320 a 1440 con 0, 8 y 17 px de canaleta de scrollbar, con la
   caja que calcula el CSS de .location-map en ContactSection (verificada
   contra el render real al centesimo de pixel). Si ese CSS cambia, estos
   numeros se vuelven a derivar.

   office-tall, hasta 400px de viewport: caja de 261 a 350 px de ancho con la
   proporcion del recorte, escala de 0,567 a 0,761.
   office-wide, desde 401px: escala max(ancho/960, alto/560), de 0,605 a 0,748.

   side: lo que cover le recorta a cada lado en la caja mas angosta.
   reserved: por donde pasan la etiqueta y el aviso en todo el rango, con 6px
   de aire y hasta el pie, para que ningun nombre quede apretado debajo de
   ellos. Unidades del recorte.
   pinAt: altura del pin sobre el alto del recorte. Ninguno de los dos se
   recorta en vertical, asi que el pin puede ir arriba del centro: deja libre
   el tramo de la calle de la oficina que baja hacia la etiqueta.
   minLabels: menos que eso y el recorte no se escribe.

   scripts/verify-office-map.mjs mide el texto real contra la etiqueta y el
   aviso en el sitio construido y falla si estos numeros quedaron cortos. */
const CROPS = [
  {
    name: 'office-tall',
    w: 230,
    h: 280,
    side: 0,
    reserved: [
      [19, 382, 315, 560],
      [105, 477, 441, 560]
    ],
    pinAt: 0.32,
    minLabels: 4
  },
  {
    name: 'office-wide',
    w: 480,
    h: 280,
    side: 205,
    reserved: [
      [24, 388, 506, 560],
      [416, 476, 936, 560]
    ],
    pinAt: 0.33,
    minLabels: 4
  }
];
const UNITS_PER_M = 2;

/* Margen contra todo borde visible, en unidades: absorbe el pixel que el borde
   de la tarjeta le quita a la caja. */
const EDGE = 8;

const FONT = 19;
const LETTER_SPACING = 0.6;

/* Avances de Helvetica en milesimas de em (las metricas AFM de Adobe, que
   Arial copia una por una). Un promedio por caracter se pasa de largo con
   nombres llenos de i, l y r, y descarta calles donde el nombre si entra. El
   6% de mas cubre a Helvetica Neue, que en Chrome sale apenas mas ancha. */
const GLYPH = {
  ' ': 278, '.': 278, a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556,
  i: 222, j: 222, k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333,
  s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500, A: 667, B: 667,
  C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556,
  M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667,
  W: 944, X: 667, Y: 667, Z: 611
};
const GLYPH_FALLBACK = 667;
const WIDTH_MARGIN = 1.06;

/* Caja del texto respecto de su punto de anclaje, con dy de 5: la ascendente
   sube unas 14 unidades y la descendente baja 10. */
const TEXT_TOP = -14;
const TEXT_BOTTOM = 10;

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

const round = (n) => Math.round(n * 10) / 10;

/* Descarta lo que cae entero fuera del recorte. Sin esto el SVG carga las
   manzanas del margen de descarga, que nadie llega a ver. */
const MARGIN = 40;

function viewFor(crop) {
  const width = crop.w * UNITS_PER_M;
  const height = crop.h * UNITS_PER_M;
  const project = (lat, lon) => [
    (lon - OFFICE.lon) * M_PER_DEG_LON * UNITS_PER_M + width / 2,
    (OFFICE.lat - lat) * M_PER_DEG_LAT * UNITS_PER_M + height * crop.pinAt
  ];

  const toPath = (geometry, close) => {
    let d = '';
    for (let i = 0; i < geometry.length; i += 1) {
      const [x, y] = project(geometry[i].lat, geometry[i].lon);
      d += `${i === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`;
    }
    return close ? `${d}Z` : d;
  };

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
    return maxX >= -MARGIN && minX <= width + MARGIN && maxY >= -MARGIN && minY <= height + MARGIN;
  };

  /* Donde puede caer cualquier punto de una etiqueta: adentro de lo que cover
     no recorta nunca, y afuera de donde pasan la etiqueta y el aviso. */
  const labelArea = {
    left: crop.side + EDGE,
    right: width - crop.side - EDGE,
    top: EDGE,
    bottom: height - EDGE
  };
  const reserved = crop.reserved.map(([x0, y0, x1, y1]) => [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1]
  ]);

  return { width, height, project, toPath, visible, labelArea, reserved };
}

/* Esquinas de la caja de una etiqueta ya rotada, en unidades del recorte. */
function labelBox(cx, cy, ux, uy, halfLength) {
  const corner = (lx, ly) => [cx + lx * ux - ly * uy, cy + lx * uy + ly * ux];
  return [
    corner(-halfLength, TEXT_TOP),
    corner(halfLength, TEXT_TOP),
    corner(halfLength, TEXT_BOTTOM),
    corner(-halfLength, TEXT_BOTTOM)
  ];
}

/* Separacion de ejes entre dos cajas convexas: se tocan si ningun lado de
   ninguna de las dos las separa. */
function boxesOverlap(a, b, gap) {
  for (const box of [a, b]) {
    for (let i = 0; i < 4; i += 1) {
      const [x1, y1] = box[i];
      const [x2, y2] = box[(i + 1) % 4];
      const nx = y1 - y2;
      const ny = x2 - x1;
      const length = Math.hypot(nx, ny);
      const project = (p) => (p[0] * nx + p[1] * ny) / length;
      const pa = a.map(project);
      const pb = b.map(project);
      if (Math.max(...pa) + gap < Math.min(...pb) || Math.max(...pb) + gap < Math.min(...pa)) {
        return false;
      }
    }
  }
  return true;
}

/* Distancia del pin a la caja de la etiqueta, medida en el sistema de la
   etiqueta: cero si el pin cae adentro. */
function distanceToBox(px, py, cx, cy, ux, uy, halfLength) {
  const lx = (px - cx) * ux + (py - cy) * uy;
  const ly = -(px - cx) * uy + (py - cy) * ux;
  const dx = Math.max(Math.abs(lx) - halfLength, 0);
  const dy = Math.max(TEXT_TOP - ly, ly - TEXT_BOTTOM, 0);
  return Math.hypot(dx, dy);
}

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

const textLength = (name) =>
  [...name.normalize('NFD').replace(/\p{M}/gu, '')].reduce(
    (sum, ch) => sum + ((GLYPH[ch] ?? GLYPH_FALLBACK) / 1000) * FONT * WIDTH_MARGIN + LETTER_SPACING,
    0
  );

/* Las abreviaturas de rotulado de la ciudad: el nombre completo de una calle de
   Asuncion rara vez entra en una cuadra, y "Dr." o "Av." no le quitan nada a
   quien lo lee. */
const ABBREVIATIONS = [
  [/^Avenida /, 'Av. '],
  [/\bDoctor /g, 'Dr. '],
  [/\bProfesor /g, 'Prof. '],
  [/\bGeneral /g, 'Gral. ']
];
const shortName = (name) => ABBREVIATIONS.reduce((text, [pattern, short]) => text.replace(pattern, short), name);

/* Tramos rectos de una via: segmentos consecutivos que no se desvian mas de
   unos grados de la direccion con la que arranco el tramo. OSM corta la calle
   en cada esquina, y un solo segmento casi nunca alcanza para un nombre. */
const STRAIGHT = (4 * Math.PI) / 180;

function straightRuns(points) {
  const runs = [];
  let start = 0;
  while (start < points.length - 1) {
    const [x0, y0] = points[start];
    const heading = Math.atan2(points[start + 1][1] - y0, points[start + 1][0] - x0);
    let end = start + 1;
    while (end < points.length - 1) {
      const [xa, ya] = points[end];
      const [xb, yb] = points[end + 1];
      const delta = Math.atan2(yb - ya, xb - xa) - heading;
      const turn = Math.abs(Math.atan2(Math.sin(delta), Math.cos(delta)));
      if (turn > STRAIGHT) break;
      end += 1;
    }
    runs.push([points[start], points[end]]);
    start = end;
  }
  return runs;
}

/* OSM corta una misma calle en varias vias. Se cosen por nombre donde una
   termina en el nodo en que empieza otra, para que el tramo recto no se corte
   en cada union. */
function streetsByName(highways) {
  const key = ({ lat, lon }) => `${lat},${lon}`;
  const groups = new Map();
  for (const way of highways) {
    const name = way.tags.name;
    if (!name || (ROADS[way.tags.highway]?.z ?? 0) < 3) continue;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push({ rank: ROADS[way.tags.highway].z, points: [...way.geometry] });
  }

  const streets = [];
  for (const [name, pieces] of groups) {
    while (pieces.length) {
      let { rank, points } = pieces.pop();
      let joined = true;
      while (joined) {
        joined = false;
        for (let i = 0; i < pieces.length; i += 1) {
          const other = pieces[i].points;
          const head = key(points[0]);
          const tail = key(points[points.length - 1]);
          if (key(other[0]) === tail) points.push(...other.slice(1));
          else if (key(other[other.length - 1]) === tail) points.push(...other.slice(0, -1).reverse());
          else if (key(other[other.length - 1]) === head) points.unshift(...other.slice(0, -1));
          else if (key(other[0]) === head) points.unshift(...other.slice(1).reverse());
          else continue;
          rank = Math.max(rank, pieces[i].rank);
          pieces.splice(i, 1);
          joined = true;
          break;
        }
      }
      streets.push({ name, rank, points });
    }
  }
  return streets;
}

/* Etiqueta cada calle sobre un tramo recto, corrida a lo largo del tramo hasta
   que la caja entera cae en la zona permitida: sin montarse sobre una curva,
   sin quedar cortada por cover y sin caer debajo de la etiqueta o del aviso. */
function labelsFor(highways, view) {
  const candidates = new Map();
  const [pinX, pinY] = view.project(OFFICE.lat, OFFICE.lon);
  const area = view.labelArea;
  const fits = (box) =>
    box.every(([x, y]) => x >= area.left && x <= area.right && y >= area.top && y <= area.bottom) &&
    !view.reserved.some((zone) => boxesOverlap(box, zone, 0));

  for (const street of streetsByName(highways)) {
    const { rank } = street;
    const name = shortName(street.name);
    const halfLength = textLength(name) / 2;
    const points = street.points.map(({ lat, lon }) => view.project(lat, lon));

    for (const [[x1, y1], [x2, y2]] of straightRuns(points)) {
      const length = Math.hypot(x2 - x1, y2 - y1);
      if (length < halfLength * 2) continue;

      /* El texto se lee de izquierda a derecha: el eje apunta siempre hacia
         x creciente, y la caja se arma sobre ese mismo eje. */
      const flip = x2 < x1 ? -1 : 1;
      const ux = ((x2 - x1) / length) * flip;
      const uy = ((y2 - y1) / length) * flip;
      const [ax, ay] = flip === 1 ? [x1, y1] : [x2, y2];
      const angle = (Math.atan2(uy, ux) * 180) / Math.PI;

      const feasible = [];
      for (let t = halfLength; t <= length - halfLength; t += 4) {
        const cx = ax + ux * t;
        const cy = ay + uy * t;
        const box = labelBox(cx, cy, ux, uy, halfLength);
        if (!fits(box)) continue;
        if (distanceToBox(pinX, pinY, cx, cy, ux, uy, halfLength) < PIN_CLEAR) continue;
        feasible.push({ cx, cy, box, angle });
      }
      if (!feasible.length) continue;

      const entry = candidates.get(name) ?? { name, rank, positions: [] };
      entry.rank = Math.max(entry.rank, rank);
      entry.positions.push(...feasible);
      candidates.set(name, entry);
    }
  }

  /* De todas las posiciones que entran, primero las mas cercanas al pin: un
     nombre sirve mas cuanto mas cerca de la oficina se lee. Si otro nombre ya
     ocupa ese lugar, se corre a la siguiente. */
  for (const entry of candidates.values()) {
    entry.positions.sort((a, b) => Math.hypot(a.cx - pinX, a.cy - pinY) - Math.hypot(b.cx - pinX, b.cy - pinY));
  }

  /* Dos nombres que se pisan no se leen. Primero la calle de la oficina,
     despues la mas importante y, entre iguales, la que menos lugar tiene: la
     que tiene mas posiciones se corre despues para dejarle sitio. */
  const placed = [];
  const ordered = [...candidates.values()].sort(
    (a, b) =>
      Number(b.name === shortName(OFFICE_STREET)) - Number(a.name === shortName(OFFICE_STREET)) ||
      b.rank - a.rank ||
      a.positions.length - b.positions.length
  );
  for (const { name, rank, positions } of ordered) {
    const spot = positions.find((p) => !placed.some((other) => boxesOverlap(p.box, other.box, 6)));
    if (!spot) continue;
    placed.push({ name, rank, x: spot.cx, y: spot.cy, box: spot.box, angle: spot.angle });
    if (placed.length === 7) break;
  }
  return placed;
}

function render(elements, view) {
  const highways = [];
  const buildings = [];
  const areas = [];

  for (const el of elements) {
    const tags = el.tags ?? {};
    if (!view.visible(el.geometry)) continue;

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

  const { width, height, toPath } = view;
  const [px, py] = view.project(OFFICE.lat, OFFICE.lon);

  const out = [];
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`
  );
  out.push(`<rect width="${width}" height="${height}" fill="${palette.land}"/>`);

  for (const { el, fill } of areas) {
    out.push(`<path d="${toPath(el.geometry, true)}" fill="${fill}"/>`);
  }

  out.push(
    `<g fill="${palette.building}" stroke="${palette.buildingEdge}" stroke-width="1">`,
    ...buildings.map((b) => `<path d="${toPath(b.geometry, true)}"/>`),
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

  const labels = labelsFor(highways, view);
  out.push(
    `<g font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${FONT}" letter-spacing="${LETTER_SPACING}" fill="${palette.label}" text-anchor="middle">`
  );
  for (const l of labels) {
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

  return {
    svg: out.join(''),
    stats: { highways: drawn.length, buildings: buildings.length, labels: labels.map((l) => l.name) }
  };
}

const elements = await fetchOsm();
await mkdir(OUT_DIR, { recursive: true });

for (const crop of CROPS) {
  const { svg, stats } = render(elements, viewFor(crop));
  if (stats.highways < 10 || stats.buildings < 40) {
    throw new Error(
      `${crop.name}: Overpass devolvio ${stats.highways} calles y ${stats.buildings} edificios. Con tan poco el plano sale vacio, no se escribe.`
    );
  }
  if (!stats.labels.includes(shortName(OFFICE_STREET)) || stats.labels.length < crop.minLabels) {
    throw new Error(
      `${crop.name}: rotulo ${stats.labels.length} calles (${stats.labels.join(', ') || 'ninguna'}), pide ${crop.minLabels} con ${OFFICE_STREET} entre ellas. No se escribe.`
    );
  }

  await writeFile(resolve(OUT_DIR, `${crop.name}.svg`), svg);
  console.log(
    `${crop.name}.svg: ${(svg.length / 1024).toFixed(1)} KB, ${crop.w}x${crop.h} m, ${stats.buildings} edificios, ${stats.highways} calles, etiquetas: ${stats.labels.join(', ')}`
  );
}
