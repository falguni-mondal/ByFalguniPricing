// frontend/src/components/FunctionalityCard.tsx
import type { FC } from 'react';
import { FUNCTIONALITY_OPTIONS } from '../constants/pricingData';

interface Props {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  note: string;
  onChangeNote: (n: string) => void;
}

export const FunctionalityCard: FC<Props> = ({
  selectedTags,
  onToggleTag,
  note,
  onChangeNote,
}) => (
  <section className="liquid-glass-card relative z-10 space-y-6 rounded-[2rem] p-5 sm:p-10">
    <div>
      <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
        04 • Website Functionality & Working Features
      </span>
      <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
        Tap any features you want (or uncheck what you don’t need)
      </h2>
      <p className="mt-1 text-xs opacity-60">
        We pre-selected the recommended features for your website type, but you have 100% freedom to
        deselect or add any functionality below.
      </p>
    </div>

    <div className="flex flex-wrap gap-2.5">
      {FUNCTIONALITY_OPTIONS.map((tag) => {
        const active = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggleTag(tag)}
            className={`cursor-pointer rounded-full px-4 py-2.5 text-xs font-semibold transition ${
              active ? 'liquid-glass-active' : 'liquid-glass-pill opacity-85 hover:opacity-100'
            }`}
          >
            {active ? '✓ ' : '+ '}
            {tag}
          </button>
        );
      })}
    </div>

    <div>
      <label className="block text-xs font-semibold opacity-75">
        Describe any custom functionality or workflow in your own words:
      </label>
      <textarea
        rows={2}
        value={note}
        onChange={(e) => onChangeNote(e.target.value)}
        placeholder="e.g. I need an e-commerce catalog where users can inquire on WhatsApp instead of a cart system..."
        className="glass-input mt-1.5 w-full rounded-2xl p-4 text-xs"
      />
    </div>
  </section>
);