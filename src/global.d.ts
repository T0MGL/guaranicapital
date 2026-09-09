/* Set by the inline boot script in index.html (src/components/hero-boot.js).
   `t0` is when the static hero started animating, `settleMs` is how long that
   takes, so React can tell whether it is safe to drop the static layer yet. */
interface HeroBootState {
  t0: number;
  settleMs: number;
}

interface Window {
  __heroBoot?: HeroBootState;
  /* A CTA pressed on the static hero before the bundle arrived. The sections
     it points at did not exist yet, so the press is parked here for the real
     hero to act on when it mounts. Stamped so a press that predates a very
     late bundle is dropped rather than scrolling the page unprompted. */
  __heroBootIntent?: { target: 'contact' | 'services'; at: number };
}
