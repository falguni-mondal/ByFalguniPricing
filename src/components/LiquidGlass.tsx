// frontend/src/components/LiquidGlass.tsx
import { memo, useEffect, useState, type FC } from 'react';

export const LiquidGlassFilterSVG: FC = memo(() => {
  const [isLowEnd, setIsLowEnd] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const lowCores = (navigator.hardwareConcurrency || 8) <= 4;
    const lowMem = ((navigator as any).deviceMemory || 8) <= 4;
    return coarsePointer || reducedMotion || lowCores || lowMem;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isLowEnd) {
      root.classList.add('low-end-glass');
    } else {
      root.classList.remove('low-end-glass');
    }

    const mq = window.matchMedia?.('(max-width: 768px)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsLowEnd(true);
        root.classList.add('low-end-glass');
      }
    };
    mq?.addEventListener?.('change', handleChange);
    return () => mq?.removeEventListener?.('change', handleChange);
  }, [isLowEnd]);

  // Do not mount expensive SVG feTurbulence / feSpecularLighting filters on mobile or low-end GPUs
  if (isLowEnd) return null;

  return (
    <svg
      width="0"
      height="0"
      className="pointer-events-none fixed top-0 left-0 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="apple-liquid-glass"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.017"
            numOctaves="1"
            seed="11"
            result="lensNoise"
          />
          <feGaussianBlur in="lensNoise" stdDeviation="3" result="smoothedLens" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothedLens"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refractedBackground"
          />
        </filter>
      </defs>
    </svg>
  );
});