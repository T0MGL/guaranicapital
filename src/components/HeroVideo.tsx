import { useEffect, useRef, useState } from 'react';

/*
  The background loop is decoration over a poster that already shows its first
  frame, so it has no claim on the bandwidth the first viewport needs. Nothing
  is requested until the page is otherwise idle, and it fades in on the frame it
  starts playing so the still and the motion are one image, not a cut.
*/

const WEBM = '/hero/hero.webm';
const MP4 = '/hero/hero.mp4';
const IDLE_TIMEOUT_MS = 2000;

type SavedDataConnection = { saveData?: boolean; effectiveType?: string };

const shouldLoadVideo = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const connection = (navigator as Navigator & { connection?: SavedDataConnection }).connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  return connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g';
};

export const HeroVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!shouldLoadVideo()) return;

    if (typeof requestIdleCallback !== 'function') {
      const timer = window.setTimeout(() => setMounted(true), 300);
      return () => window.clearTimeout(timer);
    }

    const handle = requestIdleCallback(() => setMounted(true), { timeout: IDLE_TIMEOUT_MS });
    return () => cancelIdleCallback(handle);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Waiting a frame past `playing` means the first decoded frame is on screen
    // before the fade starts, so the crossfade never shows an empty element.
    let frame = 0;
    const reveal = () => {
      frame = requestAnimationFrame(() => setPlaying(true));
    };

    video.addEventListener('playing', reveal, { once: true });
    return () => {
      video.removeEventListener('playing', reveal);
      cancelAnimationFrame(frame);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <video
      ref={ref}
      className="hero-video"
      data-ready={playing}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      tabIndex={-1}
      aria-hidden="true"
    >
      <source src={WEBM} type="video/webm" />
      <source src={MP4} type="video/mp4" />
    </video>
  );
};
