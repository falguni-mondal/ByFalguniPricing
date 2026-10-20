// frontend/src/components/StepTabsNav.tsx
import type { FC } from 'react';

export interface StepTabItem {
  id: number;
  shortLabel: string;
  fullLabel: string;
}

export const PRICING_TABS: StepTabItem[] = [
  { id: 1, shortLabel: '01 • Region', fullLabel: '01 • Region & Budget' },
  { id: 2, shortLabel: '02 • Category', fullLabel: '02 • Category & Pages' },
  { id: 3, shortLabel: '03 • Motion', fullLabel: '03 • Motion & 3D' },
  { id: 4, shortLabel: '04 • Features', fullLabel: '04 • Functionality' },
  { id: 5, shortLabel: '05 • Brief', fullLabel: '05 • Brief & Submit' },
];

interface Props {
  activeTab: number;
  onSelectTab: (tabId: number) => void;
}

export const StepTabsNav: FC<Props> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="sticky top-[64px] z-30 mb-6 sm:top-[76px] sm:mb-8">
      {/* Outer Liquid Glass Dock Capsule */}
      <div className="liquid-glass-pill mx-auto w-full rounded-3xl p-2 sm:w-fit sm:rounded-full sm:p-1.5">
        <div className="no-scrollbar flex snap-x snap-mandatory items-center gap-1.5 overflow-x-auto sm:flex-wrap sm:justify-center sm:overflow-visible">
          {PRICING_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`shrink-0 snap-start cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all sm:px-5 sm:py-2.5 ${
                  isActive
                    ? 'liquid-glass-active'
                    : 'liquid-glass-pill opacity-85 hover:opacity-100'
                }`}
              >
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.fullLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};