// frontend/src/components/WebsiteCategoryCard.tsx
import type { FC } from 'react';
import { WEBSITE_TYPES } from '../constants/pricingData';

interface Props {
  projectPurpose: string;
  pages: number;
  onSelectWebsiteType: (t: (typeof WEBSITE_TYPES)[0]) => void;
  onChangePages: (p: number) => void;
  note: string;
  onChangeNote: (n: string) => void;
}

export const WebsiteCategoryCard: FC<Props> = ({
  projectPurpose,
  pages,
  onSelectWebsiteType,
  onChangePages,
  note,
  onChangeNote,
}) => (
  <section className="liquid-glass-card relative z-10 space-y-6 rounded-[2rem] p-5 sm:p-10">
    <div>
      <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
        02 • Website Category & Size
      </span>
      <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
        What kind of website are we building?
      </h2>
      <p className="mt-1 text-xs opacity-60">
        Selecting a category smartly sets the recommended page count and features for that website
        type (you can adjust pages or features anytime).
      </p>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {WEBSITE_TYPES.map((t) => {
        const isSelected = projectPurpose === t.id;
        return (
          <div
            key={t.id}
            onClick={() => onSelectWebsiteType(t)}
            className={`cursor-pointer rounded-3xl p-4 transition-all ${
              isSelected ? 'liquid-glass-active' : 'liquid-glass-pill'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{t.title}</span>
              <span className="text-[10px] font-semibold opacity-75">
                ~{t.recommendedPages} pages
              </span>
            </div>
            <p className="mt-1 text-xs opacity-80">{t.desc}</p>
          </div>
        );
      })}
    </div>

    <div className="glass-subcard flex flex-col justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center">
      <div>
        <h3 className="text-sm font-bold">How many pages do you need? *</h3>
        <p className="mt-0.5 text-xs opacity-65">
          Starts at 1 page initially, and updates to the recommended page count when you pick a
          category above.
        </p>
      </div>
      <div className="flex items-center gap-4 self-start sm:self-center">
        <button
          type="button"
          onClick={() => onChangePages(Math.max(1, pages - 1))}
          className="liquid-glass-pill h-11 w-11 cursor-pointer rounded-full text-lg font-bold"
        >
          −
        </button>
        <span className="w-10 text-center text-2xl font-black">{pages}</span>
        <button
          type="button"
          onClick={() => onChangePages(pages + 1)}
          className="liquid-glass-pill h-11 w-11 cursor-pointer rounded-full text-lg font-bold"
        >
          +
        </button>
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