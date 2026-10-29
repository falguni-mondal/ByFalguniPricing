// frontend/src/components/StickyNavbar.tsx
import { memo, type FC } from 'react';
import type { CountryOption } from '../constants/pricingData';

interface Props {
  selectedCountry: CountryOption;
  sym: string;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const StickyNavbar: FC<Props> = memo(
  ({ selectedCountry, sym, darkMode, toggleTheme }) => (
    <header className="fixed top-3 left-0 right-0 z-50 mx-auto w-full max-w-6xl px-3 sm:top-4 sm:px-6">
      <div className="liquid-glass-pill flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-black tracking-tighter">
            BY<span className="text-[#ff5733]">F</span>.
          </span>
          <span className="hidden text-xs font-semibold opacity-60 sm:inline">
            Interactive Project Scope Configurator
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="glass-subcard hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold md:flex">
            <img
              src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
              alt={selectedCountry.name}
              className="h-3.5 w-5 rounded-xs object-cover"
            />
            <span>
              {selectedCountry.name} ({sym})
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="liquid-glass-pill flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold"
            title="Switch Theme"
          >
            {darkMode ? (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </header>
  )
);