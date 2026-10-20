// frontend/src/components/CostBreakdownModal.tsx
import type { FC } from 'react';

interface Props {
  quote: any;
  sym: string;
  showModal: boolean;
  setShowModal: (v: boolean) => void;
}

export const CostBreakdownModal: FC<Props> = ({ quote, sym, showModal, setShowModal }) => {
  if (!quote) return null;

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="liquid-glass-card max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-500/20 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                  Detailed Cost Breakdown
                </span>
                <h3 className="mt-1 text-2xl font-black sm:text-3xl">
                  {sym}
                  {Number(quote.grandTotal).toLocaleString()}
                </h3>
                <p className="text-xs opacity-65">
                  Est. Delivery: {quote.durationEstimate.realisticDaysMin}–
                  {quote.durationEstimate.realisticDaysMax} days • Revisions:{' '}
                  {quote.revisions.frontendShared} Frontend
                  {quote.revisions.backendShared > 0 &&
                    ` + ${quote.revisions.backendShared} Backend`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="liquid-glass-pill cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-5 divide-y divide-neutral-500/15 text-xs">
              {quote.items.map((item: any) => (
                <div key={item.id} className="flex justify-between gap-4 py-3">
                  <div>
                    <div className="font-bold">{item.label}</div>
                    {item.note && <div className="text-[11px] opacity-60">{item.note}</div>}
                  </div>
                  <div className="shrink-0 font-bold">
                    {sym}
                    {item.cost.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-neutral-500/20 pt-5">
              <span className="text-[11px] font-bold uppercase opacity-50">Payment Milestones</span>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {quote.milestones.map((m: any, i: number) => (
                  <div key={i} className="glass-subcard rounded-2xl p-3.5 text-xs">
                    <span className="text-[10px] font-bold uppercase opacity-60">
                      {m.name} ({m.percent}%)
                    </span>
                    <p className="mt-1 text-lg font-black">
                      {sym}
                      {m.amount.toLocaleString()}
                    </p>
                    <p className="text-[11px] opacity-65">{m.trigger}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM LIQUID GLASS BUDGET HUD (Zero-Transform inset-x-0 mx-auto) */}
      <div className="liquid-glass-pill fixed inset-x-0 bottom-3 z-40 mx-auto w-[94%] max-w-2xl rounded-full px-4 py-3 transition-all duration-300 sm:bottom-5 sm:px-6 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              {quote.budgetIntelligence.isOverBudget && (
                <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-red-500 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  quote.budgetIntelligence.isOverBudget
                    ? 'bg-red-600'
                    : quote.budgetIntelligence.popupStatus === 'NEAR_LIMIT'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
              />
            </div>

            <div className="min-w-0 flex-1 truncate">
              <p className="truncate text-xs font-semibold">
                {quote.budgetIntelligence.popupMessage}
              </p>
              {quote.freeHostingOffer.qualified && (
                <p className="truncate text-[10px] font-bold opacity-80">
                  Unlocked: Free 1st-Year Frontend Hosting Included
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              <span className="block text-[9px] font-bold uppercase tracking-wider opacity-50">
                Estimate
              </span>
              <span className="text-base font-black tracking-tight sm:text-lg">
                {sym}
                {Number(quote.grandTotal).toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="liquid-glass-active cursor-pointer rounded-full px-4 py-2 text-[11px] font-bold"
            >
              Breakdown
            </button>
          </div>
        </div>
      </div>
    </>
  );
};