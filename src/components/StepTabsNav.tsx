// frontend/src/components/StepTabsNav.tsx
import { memo, type FC } from 'react';

export interface StepTabItem {
  id: number;
  slug: string;
  shortLabel: string;
  fullLabel: string;
}

export const PRICING_TABS: StepTabItem[] = [
  { id: 1, slug: 'region', shortLabel: '01 • Region', fullLabel: '01 • Region & Budget' },
  { id: 2, slug: 'pages-category', shortLabel: '02 • Pages', fullLabel: '02 • Pages & Category' },
  { id: 3, slug: 'functionality', shortLabel: '03 • Features', fullLabel: '03 • Functionality' },
  { id: 4, slug: 'motion', shortLabel: '04 • Motion', fullLabel: '04 • Motion & 3D' },
  { id: 5, slug: 'brief', shortLabel: '05 • Brief', fullLabel: '05 • Brief & Submit' },
];

interface Props {
  activeTab: number;
  onSelectTab: (tabId: number) => void;
}

export const StepTabsNav: FC<Props> = memo(({ activeTab, onSelectTab }) => {
  return (
    <nav
      aria-label="Project Scope Steps"
      className="sticky top-[64px] z-30 mb-6 sm:top-[76px] sm:mb-8"
    >
      {/* Outer Liquid Glass Dock Capsule */}
      <div className="liquid-glass-pill mx-auto w-full rounded-3xl p-2 sm:w-fit sm:rounded-full sm:p-1.5">
        <div className="no-scrollbar flex snap-x snap-mandatory items-center gap-1.5 overflow-x-auto sm:flex-wrap sm:justify-center sm:overflow-visible">
          {PRICING_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={`#/${tab.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTab(tab.id);
                }}
                aria-current={isActive ? 'step' : undefined}
                className={`shrink-0 snap-start cursor-pointer rounded-full px-4 py-2 text-xs font-bold no-underline transition-all sm:px-5 sm:py-2.5 ${
                  isActive
                    ? 'liquid-glass-active'
                    : 'liquid-glass-pill opacity-85 hover:opacity-100'
                }`}
              >
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.fullLabel}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
});