/*
  Runs inline in <head>-order, before the app bundle, against the static hero in
  index.html. Three jobs: pick the language, localise the baked Spanish copy in
  place, and run the stat counter. Everything here is deliberately dependency
  free and synchronous so the hero is correct on its very first paint.

  Injected at the @hero-boot-script marker by the guarani-hero-critical Vite
  plugin, which also substitutes the copy for @hero-copy.
*/
(function () {
  var COPY = /*@hero-copy*/ null;
  var BAKED = 'es';
  var COUNT_MS = 1200;
  /* Longest thing on screen is the counter, so this is when the React hero is
     free to take over without anything visibly resetting. */
  var SETTLED_MS = 1250;
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
    var text = {
      eyebrow: copy.eyebrow,
      line1: copy.title.line1,
      line2: copy.title.line2,
      line3: copy.title.line3,
      subtitle: copy.subtitle,
      ctaPrimary: copy.cta.primary,
      ctaSecondary: copy.cta.secondary,
      statPropertiesLabel: copy.stats.properties.label,
      statSupportLabel: copy.stats.support.label,
      statExperienceLabel: copy.stats.experience.label,
    };
    for (var key in text) {
      var node = root.querySelector('[data-hb="' + key + '"]');
      if (!node) continue;
      /* The primary CTA carries an arrow after its label, so replace the text
         node rather than the whole subtree. */
      if (node.firstChild && node.firstChild.nodeType === 3) {
        node.firstChild.nodeValue = key === 'ctaPrimary' ? text[key] + ' ' : text[key];
      } else {
        node.textContent = text[key];
      }
    }
  }

  var stats = copy ? copy.stats : null;
  var targets = stats ? root.querySelectorAll('[data-hb-stat]') : [];

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

  for (var i = 0; i < targets.length; i++) {
    var node = targets[i];
    var stat = stats[node.getAttribute('data-hb-stat')];
    if (!stat) continue;
    node.textContent = stat.number;
    if (reduced) continue;
    (function (el, target) {
      var start = 0;
      render(el, target, 0);
      requestAnimationFrame(function step(now) {
        if (!start) start = now;
        var progress = Math.min((now - start) / COUNT_MS, 1);
        render(el, target, progress);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      });
    })(node, stat.number);
  }

  window.__heroBoot = {
    t0: t0,
    settleMs: reduced ? 0 : SETTLED_MS,
  };
})();
