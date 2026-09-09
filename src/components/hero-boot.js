/*
  Runs inline, before the app bundle, against the static hero in index.html.
  Four jobs: pick the language, localise the baked Spanish copy in place, run
  the stat counter, and remember a CTA press so React can act on it the moment
  it mounts. Everything here is dependency free and synchronous so the hero is
  correct on its very first paint.

  Injected at the @hero-boot-script marker by the guarani-hero-critical Vite
  plugin, which also substitutes the copy for @hero-copy.
*/
(function () {
  var COPY = /*@hero-copy*/ null;
  var BAKED = 'es';
  var COUNT_MS = 1200;
  /* The counter is the last thing still moving, so once it lands the React
     hero can take over without anything visibly resetting. */
  var SETTLED_MS = COUNT_MS + 50;
  var t0 = performance.now();

  var reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function detectLanguage() {
    try {
      var saved = localStorage.getItem('language');
      if (saved === 'en' || saved === 'es' || saved === 'pt') return saved;
    } catch (err) {
      /* Storage is unavailable in some privacy modes. Fall through to the browser. */
    }
    var browser = (navigator.language || '').split('-')[0].toLowerCase();
    if (browser === 'es') return 'es';
    if (browser === 'pt') return 'pt';
    return 'en';
  }

  function resolve(source, path) {
    var parts = path.split('.');
    var value = source;
    for (var i = 0; i < parts.length && value != null; i++) value = value[parts[i]];
    return typeof value === 'string' ? value : null;
  }

  var lang = detectLanguage();
  document.documentElement.lang = lang;

  var root = document.getElementById('hero-boot');
  if (!root) return;

  /* index.html is served for every SPA route, so the static hero would paint
     over /crm as well, and nothing there would ever take it down. Only the
     landing page owns it. */
  if ((location.pathname.replace(/\/+$/, '') || '/') !== '/') {
    root.remove();
    return;
  }

  var copy = COPY && COPY[lang];

  if (copy && lang !== BAKED) {
    var nodes = root.querySelectorAll('[data-hb]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var text = resolve(copy, node.getAttribute('data-hb'));
      if (text === null) continue;
      /* The primary CTA carries an arrow after its label, so replace the text
         node rather than the whole subtree. */
      if (node.firstChild && node.firstChild.nodeType === 3) {
        node.firstChild.nodeValue = node.hasAttribute('data-hb-intent') ? text + ' ' : text;
      } else {
        node.textContent = text;
      }
    }
  }

  /* The sections these point at do not exist until React renders them, so a
     native jump would do nothing and would still push a hash onto the URL.
     Record the press instead and let the real hero honour it on mount. */
  var ctas = root.querySelectorAll('[data-hb-intent]');
  for (var c = 0; c < ctas.length; c++) {
    ctas[c].addEventListener('click', function (event) {
      event.preventDefault();
      window.__heroBootIntent = this.getAttribute('data-hb-intent');
    });
  }

  function render(node, target, progress) {
    var eased = 1 - Math.pow(1 - progress, 3);
    if (target === '24/7') {
      node.textContent = Math.floor(24 * eased) + '/' + Math.floor(7 * eased);
      return;
    }
    var parts = target.match(/^([+\-]?)(\d+(?:\.\d+)?)(.*)$/);
    if (!parts) {
      node.textContent = target;
      return;
    }
    var decimals = parts[2].indexOf('.') === -1 ? 0 : parts[2].split('.')[1].length;
    var current = parseFloat(parts[2]) * eased;
    node.textContent =
      parts[1] + (decimals ? current.toFixed(decimals) : Math.floor(current)) + parts[3];
  }

  var counters = copy ? root.querySelectorAll('[data-hb-stat]') : [];
  for (var s = 0; s < counters.length; s++) {
    var counter = counters[s];
    var target = resolve(copy, counter.getAttribute('data-hb-stat'));
    if (target === null) continue;
    counter.textContent = target;
    if (reduced) continue;
    (function (el, value) {
      var start = 0;
      render(el, value, 0);
      requestAnimationFrame(function step(now) {
        if (!start) start = now;
        var progress = Math.min((now - start) / COUNT_MS, 1);
        render(el, value, progress);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = value;
      });
    })(counter, target);
  }

  window.__heroBoot = {
    t0: t0,
    settleMs: reduced ? 0 : SETTLED_MS,
  };
})();
