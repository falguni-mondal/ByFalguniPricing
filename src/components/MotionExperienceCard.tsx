// frontend/src/components/MotionExperienceCard.tsx
import type { FC } from 'react';

export type MotionTier = 'NONE' | 'BASIC' | 'ADVANCED' | 'WEBGL_3D';

interface Props {
  animationTier: MotionTier;
  onSelectTier: (tier: MotionTier) => void;
  note: string;
  onChangeNote: (n: string) => void;
}

const MOTION_TIERS: { id: MotionTier; badge: string; title: string; desc: string }[] = [
  {
    id: 'NONE',
    badge: '1st Tier (Default)',
    title: 'Completely Static',
    desc: 'Strictly static pages without any animation and without smooth scrolling — no magic, just a clean, top-notch responsive layout.',
  },
  {
    id: 'BASIC',
    badge: '2nd Tier',
    title: 'Basic Animations',
    desc: 'Includes smooth scrolling, elements that gently fade or slide in on scroll, and polished button/card hover effects.',
  },
  {
    id: 'ADVANCED',
    badge: '3rd Tier',
    title: 'Advanced Animations + Smooth Scroll',
    desc: 'Award-style motion choreography: inertial smooth scroll, layered parallax depth, split-text reveals, and pinned horizontal scroll sections.',
  },
  {
    id: 'WEBGL_3D',
    badge: '4th Tier • The Premium Tier',
    title: '3D & WebGL Experience',
    desc: 'The ultimate interactive showcase: combines Advanced Animations + Smooth Scroll with interactive Three.js / WebGL 3D scenes and shaders.',
  },
];

export const MotionExperienceCard: FC<Props> = ({
  animationTier,
  onSelectTier,
  note,
  onChangeNote,
}) => (
  <section className="liquid-glass-card relative z-10 space-y-6 rounded-[2rem] p-5 sm:p-10">
    <div>
      <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
        04 • Motion, Feel & Visual Experience
      </span>
      <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
        How should the website move and feel?
      </h2>
    </div>

    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {MOTION_TIERS.map((m) => {
        const isSelected = animationTier === m.id;
        return (
          <div
            key={m.id}
            onClick={() => onSelectTier(m.id)}
            className={`cursor-pointer rounded-3xl p-5 transition-all ${
              isSelected ? 'liquid-glass-active' : 'liquid-glass-pill'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
              {m.badge}
            </span>
            <div className="mt-1 text-base font-bold">{m.title}</div>
            <p className="mt-1.5 text-xs leading-relaxed opacity-85">{m.desc}</p>
          </div>
        );
      })}
    </div>

    <div>
      <label className="block text-xs font-semibold opacity-75">
        Have specific animation, cursor, theme-toggle, or 3D ideas? Describe in your own words:
      </label>
      <input
        type="text"
        value={note}
        onChange={(e) => onChangeNote(e.target.value)}
        placeholder="e.g. I want a custom magnetic cursor, a dark/light switch, and a rotating 3D bottle..."
        className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-xs"
      />
    </div>
  </section>
);