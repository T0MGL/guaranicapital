import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const useCountUp = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
}: UseCountUpOptions) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      let startTime: number | null = null;
      const startValue = 0;

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic function for smooth deceleration
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (end - startValue) * easeOutCubic;

        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration, hasAnimated]);

  const formattedValue = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return { ref, value: formattedValue, rawValue: count };
};

// Hook specifically for stats that have mixed format like "24/7" or "+50"
export const useCountUpStat = (statString: string, duration = 2000) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);

      // Handle special case for "24/7"
      if (statString === '24/7') {
        let startTime: number | null = null;

        const animate = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          const current24 = Math.floor(24 * easeOutCubic);
          const current7 = Math.floor(7 * easeOutCubic);

          setDisplayValue(`${current24}/${current7}`);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setDisplayValue('24/7');
          }
        };

        requestAnimationFrame(animate);
        return;
      }

      // Handle numbers with prefix/suffix like "+50", "+40%", "0 hrs"
      const match = statString.match(/^([+\-]?)(\d+(?:\.\d+)?)(.*)$/);
      if (match) {
        const [, prefix, numStr, suffix] = match;
        const targetNum = parseFloat(numStr);
        const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

        let startTime: number | null = null;

        const animate = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          const current = targetNum * easeOutCubic;

          const formattedNum = decimals > 0
            ? current.toFixed(decimals)
            : Math.floor(current).toString();

          setDisplayValue(`${prefix}${formattedNum}${suffix}`);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setDisplayValue(statString);
          }
        };

        requestAnimationFrame(animate);
      } else {
        // Fallback: just show the value
        setDisplayValue(statString);
      }
    }
  }, [isInView, statString, duration, hasAnimated]);

  return { ref, value: displayValue };
};
