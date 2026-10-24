// frontend/src/components/LiquidGlass.tsx
import type { FC } from 'react';

export const LiquidGlassFilterSVG: FC = () => (
  <>
    <style>{`
      .liquid-glass-pill,
      .dark .liquid-glass-pill {
        -webkit-backdrop-filter: blur(14px) saturate(190%);
        backdrop-filter: blur(14px) saturate(190%);
        -webkit-backdrop-filter: url(#apple-liquid-glass) blur(14px) saturate(190%);
        backdrop-filter: url(#apple-liquid-glass) blur(14px) saturate(190%);
      }
      .liquid-glass-active,
      .dark .liquid-glass-active {
        -webkit-backdrop-filter: blur(16px) saturate(180%);
        backdrop-filter: blur(16px) saturate(180%);
        -webkit-backdrop-filter: url(#apple-liquid-glass) blur(16px) saturate(180%);
        backdrop-filter: url(#apple-liquid-glass) blur(16px) saturate(180%);
      }
    `}</style>
    <svg
      width="0"
      height="0"
      className="pointer-events-none fixed top-0 left-0 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="apple-liquid-glass"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.017"
            numOctaves="2"
            seed="11"
            result="lensNoise"
          />
          <feGaussianBlur in="lensNoise" stdDeviation="3.2" result="smoothedLens" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothedLens"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refractedBackground"
          />
          <feSpecularLighting
            in="smoothedLens"
            surfaceScale="3"
            specularConstant="0.85"
            specularExponent="28"
            lightingColor="#ffffff"
            result="specularRim"
          >
            <fePointLight x="-160" y="-220" z="280" />
          </feSpecularLighting>
          <feComposite in="specularRim" in2="SourceAlpha" operator="in" result="clippedSpecular" />
          <feBlend in="refractedBackground" in2="clippedSpecular" mode="screen" />
        </filter>
      </defs>
    </svg>
  </>
);