// frontend/src/components/WebsiteCategoryCard.tsx
import { memo, type FC } from 'react';
import { WEBSITE_TYPES, type WebsiteTypeOption } from '../constants/pricingData';

interface Props {
  projectPurpose: string;
  pages: number;
  onSelectWebsiteType: (t: WebsiteTypeOption) => void;
  onChangePages: (p: number) => void;
  note: string;
  onChangeNote: (n: string) => void;
  pageError?: string;
}

export const WebsiteCategoryCard: FC<Props> = memo(
  ({
    projectPurpose,
    pages,
    onSelectWebsiteType,
    onChangePages,
    note,
    onChangeNote,
    pageError,
  }) => {
    const selectedType = WEBSITE_TYPES.find((t) => t.id === projectPurpose);

    return (
      <section className="liquid-glass-card relative z-10 space-y-6 rounded-4xl p-5 sm:p-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
            02 • Website Pages & Category
          </span>
          <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            How many pages do you need & what kind of website are we building?
          </h2>
          <p className="mt-1 text-xs opacity-60">
            Start by setting the total number of pages for your website below, then tap a category
            if you want tailored recommendations. Tap any selected category again to unselect it.
          </p>
        </div>

        {/* TOP HIGHLIGHTED REQUIRED SECTION: PAGE COUNT */}
        <div
          className={`glass-subcard relative overflow-hidden rounded-3xl border-2 p-5 transition-all sm:p-6 ${
            pages > 0
              ? 'border-[#ff5733]/60 shadow-[0_0_30px_-8px_rgba(255,87,51,0.28)]'
              : 'border-[#ff5733] shadow-[0_0_32px_-6px_rgba(255,87,51,0.35)]'
          }`}
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#ff5733] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  ★ Required Step
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5733]">
                  Total Website Pages *
                </span>
              </div>
              <h3 className="pt-0.5 text-base font-bold sm:text-lg">
                How many pages do you need for your website? *
              </h3>
              <p className="text-xs opacity-75">
                {pages === 0
                  ? 'Please select at least 1 page using the + button or type your exact page count.'
                  : `You have selected ${pages} ${pages === 1 ? 'page' : 'pages'} for your project.`}
              </p>
              {pages === 0 && pageError && (
                <p className="pt-0.5 text-[11px] font-semibold text-[#ff5733]">{pageError}</p>
              )}
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <button
                type="button"
                onClick={() => onChangePages(Math.max(0, pages - 1))}
                aria-label="Decrease pages"
                className="liquid-glass-pill h-11 w-11 cursor-pointer rounded-full text-lg font-bold active:scale-95"
              >
                −
              </button>
              <input
                type="number"
                min={0}
                max={200}
                value={pages}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  onChangePages(Math.max(0, Math.min(200, val)));
                }}
                aria-label="Total pages"
                className="glass-input h-11 w-16 rounded-2xl text-center text-xl font-black focus:border-[#ff5733]"
              />
              <button
                type="button"
                onClick={() => onChangePages(Math.min(200, pages + 1))}
                aria-label="Increase pages"
                className="liquid-glass-active h-11 w-11 cursor-pointer rounded-full text-lg font-bold active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {selectedType && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-500/15 pt-3.5 text-xs">
              <span className="opacity-85">
                ★ Recommended for <strong>{selectedType.title}</strong>: around{' '}
                <strong>{selectedType.recommendedPages} pages</strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  onChangePages(
                    pages === selectedType.recommendedPages ? 0 : selectedType.recommendedPages
                  )
                }
                className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold transition ${
                  pages === selectedType.recommendedPages
                    ? 'liquid-glass-active'
                    : 'liquid-glass-pill'
                }`}
              >
                {pages === selectedType.recommendedPages
                  ? `✓ Using ${selectedType.recommendedPages} Pages (Tap to reset)`
                  : `Use Recommended (${selectedType.recommendedPages} Pages)`}
              </button>
            </div>
          )}
        </div>

        {/* WEBSITE CATEGORY SELECTION (Unselectable on clicking again, not forced) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-75">
              Select Website Category
            </h3>
            {selectedType && (
              <span className="text-[11px] font-semibold opacity-65">
                Tap selected category again to unselect
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WEBSITE_TYPES.map((t) => {
              const isSelected = projectPurpose === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectWebsiteType(t)}
                  className={`cursor-pointer rounded-3xl p-4 text-left transition-all ${
                    isSelected ? 'liquid-glass-active' : 'liquid-glass-pill'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">
                      {isSelected ? '✓ ' : ''}
                      {t.title}
                    </span>
                    <span className="text-[10px] font-semibold opacity-75">
                      ~{t.recommendedPages} pages
                    </span>
                  </div>
                  <p className="mt-1 text-xs opacity-80">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold opacity-75">
            Other website type or custom page structure? Write in your own words:
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder="e.g. Need a 7-page architecture showcase with a custom project comparison page..."
            className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-xs"
          />
        </div>
      </section>
    );
  }
);