// frontend/src/components/FunctionalityCard.tsx
import { memo, type FC } from 'react';
import { COMMON_FUNCTIONALITY_OPTIONS, WEBSITE_TYPES } from '../constants/pricingData';

interface Props {
  projectPurpose: string;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onToggleRecommendedTags: (tags: string[]) => void;
  note: string;
  onChangeNote: (n: string) => void;
}

export const FunctionalityCard: FC<Props> = memo(
  ({
    projectPurpose,
    selectedTags,
    onToggleTag,
    onToggleRecommendedTags,
    note,
    onChangeNote,
  }) => {
    const selectedCategory = WEBSITE_TYPES.find((t) => t.id === projectPurpose);
    const recommendedTags = selectedCategory?.recommendedTags || [];

    const allRecommendedSelected =
      recommendedTags.length > 0 && recommendedTags.every((t) => selectedTags.includes(t));
    const someRecommendedSelected =
      recommendedTags.some((t) => selectedTags.includes(t)) && !allRecommendedSelected;

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
      <section className="liquid-glass-card relative z-10 space-y-6 rounded-4xl p-5 sm:p-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
            03 • Website Functionality & Working Features
          </span>
          <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            Tap the features you want for your website
          </h2>
          <p className="mt-1 text-xs opacity-60">
            Nothing is added automatically — tap any feature to select it, or tap a selected
            feature again to unselect it.
          </p>
        </div>

        {selectedCategory && recommendedTags.length > 0 && (
          <div className="glass-subcard space-y-3 rounded-3xl border border-[#ff5733]/35 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5733]">
                  ★ Recommended for {selectedCategory.title}
                </span>
                <p className="mt-0.5 text-[11px] opacity-70">
                  Tick the checkbox to select all recommended features at once, or tap individual
                  features below.
                </p>
              </div>

              {/* CUSTOM-MADE CHECKBOX TO SELECT / UNSELECT ALL RECOMMENDED FEATURES IN ONE CLICK */}
              <button
                type="button"
                role="checkbox"
                aria-checked={allRecommendedSelected}
                onClick={() => onToggleRecommendedTags(recommendedTags)}
                className={`group flex cursor-pointer items-center gap-2.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
                  allRecommendedSelected ? 'liquid-glass-active' : 'liquid-glass-pill'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    allRecommendedSelected
                      ? 'border-[#ff5733] bg-[#ff5733] text-white shadow-xs'
                      : someRecommendedSelected
                      ? 'border-[#ff5733] bg-[#ff5733]/20 text-[#ff5733]'
                      : 'border-current/35 bg-transparent group-hover:border-[#ff5733]'
                  }`}
                >
                  {allRecommendedSelected ? (
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4.5 10.5l3.5 3.5 7.5-7.5" />
                    </svg>
                  ) : someRecommendedSelected ? (
                    <span className="text-xs font-black leading-none">−</span>
                  ) : null}
                </span>
                <span>
                  {allRecommendedSelected
                    ? 'All Recommended Selected'
                    : 'Select All Recommended Features'}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {recommendedTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={`rec-${tag}`}
                    type="button"
                    onClick={() => onToggleTag(tag)}
                    className={`cursor-pointer rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                      active
                        ? 'liquid-glass-active'
                        : 'liquid-glass-pill opacity-90 hover:opacity-100'
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
              Website Functionalities
            </h3>
            {selectedTags.length > 0 && (
              <span className="text-[11px] font-bold opacity-65">
                {selectedTags.length} selected (Tap any selected item to unselect)
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {COMMON_FUNCTIONALITY_OPTIONS.map(renderTogglePill)}
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
  }
);