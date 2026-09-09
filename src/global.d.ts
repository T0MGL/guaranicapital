/* Set by the inline boot script in index.html (src/components/hero-boot.js).
   `t0` is when the static hero started animating, `settleMs` is how long that
   takes, so React can tell whether it is safe to drop the static layer yet. */
interface HeroBootState {
  t0: number;
  settleMs: number;
}

interface Window {
  __heroBoot?: HeroBootState;
}
