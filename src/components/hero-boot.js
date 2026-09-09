/*
  Runs inline, before the app bundle, against the static hero in index.html.
  Three jobs: run the stat counter, remember a CTA press so React can act on it
  the moment it mounts, and take the hero down on any route that is not a
  landing page. Everything here is dependency free and synchronous so the hero
  is correct on its very first paint.

  It does not pick a language. There is one document per language and the copy
  in this markup was already written in that language by the build, so there is
  nothing left to detect and nothing to swap. The detector that used to live
  here read localStorage and navigator.language, which is how a link to the
  English site could open in Spanish.

  Injected at the @hero-boot-script marker by the guarani-hero-critical Vite
  plugin.
*/
(function () {
  var DEFAULT_LANG = 'es';
  var COUNT_MS = 1200;
  /* The counter is the last thing still moving, so once it lands the React
     hero can take over without anything visibly resetting. */
  var SETTLED_MS = COUNT_MS + 50;
  var t0 = performance.now();

  var reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var root = document.getElementById('hero-boot');
  if (!root) return;

  /* index.html is served for every SPA route under a language, so the static
     hero would paint over /crm as well and nothing there would ever take it
     down. Only the landing page owns it, and each language has its own: /,
     /en/ and /pt/. The prefix is derived from the language this document
     declares, which is the same rule basePath() applies in src/i18n/locales.ts.
     Keep the two in step if the URL scheme ever changes. */
  var lang = document.documentElement.lang;
  var landing = lang && lang !== DEFAULT_LANG ? '/' + lang : '/';
  if ((location.pathname.replace(/\/+$/, '') || '/') !== landing) {
    root.remove();
    return;
  }

  /* The sections these point at do not exist until React renders them, so a
     native jump would do nothing and would still push a hash onto the URL.
     Record the press instead and let the real hero honour it on mount. */
  var ctas = root.querySelectorAll('[data-hb-intent]');
  for (var c = 0; c < ctas.length; c++) {
    ctas[c].addEventListener('click', function (event) {
      event.preventDefault();
      window.__heroBootIntent = {
        target: this.getAttribute('data-hb-intent'),
        at: performance.now(),
      };
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

  var counters = root.querySelectorAll('[data-hb-stat]');
  for (var s = 0; s < counters.length; s++) {
    /* The rendered value is the target. It is in the markup already, in this
       document's language, so the counter has no copy of its own to consult. */
    var target = counters[s].textContent.trim();
    if (!target || reduced) continue;
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
    })(counters[s], target);
  }

  window.__heroBoot = {
    t0: t0,
    settleMs: reduced ? 0 : SETTLED_MS,
  };
})();
