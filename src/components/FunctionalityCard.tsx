// frontend/src/components/FunctionalityCard.tsx
import type { FC } from 'react';
import {
  COMMON_FUNCTIONALITY_OPTIONS,
  UNCOMMON_FUNCTIONALITY_OPTIONS,
  WEBSITE_TYPES,
} from '../constants/pricingData';

interface Props {
  projectPurpose: string;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  note: string;
  onChangeNote: (n: string) => void;
}

export const FunctionalityCard: FC<Props> = ({
  projectPurpose,
  selectedTags,
  onToggleTag,
  note,
  onChangeNote,
}) => {
  const selectedCategory = WEBSITE_TYPES.find((t) => t.id === projectPurpose);
  const recommendedTags = selectedCategory?.recommendedTags || [];

  const renderTogglePill = (tag: string) => {
    const active = selectedTags.includes(tag);
    const isRecommended = recommendedTags.includes(tag);

    return (
      <button
        key={tag}
        type="button"
        onClick={() => onToggleTag(tag)}
        className={`cursor-pointer rounded-full px-4 py-2.5 text-xs font-semibold transition ${
          active
            ? 'liquid-glass-active'
            : isRecommended
            ? 'liquid-glass-pill border-[#ff5733]/50 opacity-95 hover:opacity-100'
            : 'liquid-glass-pill opacity-85 hover:opacity-100'
        }`}
      >
        <span>{active ? '✓ ' : '+ '}</span>
        <span>{tag}</span>
        {isRecommended && !active && (
          <span className="ml-1.5 rounded-full bg-[#ff5733]/15 px-2 py-0.5 text-[10px] font-bold text-[#ff5733]">
            Recommended
          </span>
        )}
      </button>
    );
  };

  return (
    <section className="liquid-glass-card relative z-10 space-y-6 rounded-[2rem] p-5 sm:p-10">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
          03 • Website Functionality & Working Features
        </span>
        <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
          Tap the features you want for your website
        </h2>
        <p className="mt-1 text-xs opacity-60">
          Nothing is selected automatically — choose only the features you actually need.
          {selectedCategory
            ? ` Features commonly used for ${selectedCategory.title} are marked with a Recommended badge.`
            : ''}
        </p>
      </div>

      {selectedCategory && recommendedTags.length > 0 && (
        <div className="glass-subcard space-y-2.5 rounded-3xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5733]">
              ★ Recommended for {selectedCategory.title} (Tap to Add)
            </span>
            <span className="text-[11px] opacity-60">
              Optional suggestions — pick only what fits your vision
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={`rec-${tag}`}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  className={`cursor-pointer rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    active ? 'liquid-glass-active' : 'liquid-glass-pill opacity-90 hover:opacity-100'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">
            Common Website Functionalities
          </h3>
          {selectedTags.length > 0 && (
            <span className="text-[11px] font-bold opacity-65">
              {selectedTags.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {COMMON_FUNCTIONALITY_OPTIONS.map(renderTogglePill)}
        </div>
      </div>

      <div className="space-y-3 border-t border-neutral-500/15 pt-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">
            Specialized & Uncommon Functionalities
          </h3>
          <p className="mt-0.5 text-[11px] opacity-55">
            Advanced tools, custom interactive widgets, automation, and specialized integrations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {UNCOMMON_FUNCTIONALITY_OPTIONS.map(renderTogglePill)}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold opacity-75">
          Describe any custom functionality or workflow in your own words:
        </label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => onChangeNote(e.target.value)}
          placeholder="e.g. I need an e-commerce product showcase where visitors can filter items and inquire on WhatsApp without a payment gateway or admin panel..."
          className="glass-input mt-1.5 w-full rounded-2xl p-4 text-xs"
        />
      </div>
    </section>
  );
};