// frontend/src/components/CountryRegionCard.tsx
import { useState, useRef, useEffect, memo, type FC } from 'react';
import { COUNTRIES, type CountryOption } from '../constants/pricingData';

interface Props {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  selectedCountry: CountryOption;
  onSelectCountry: (c: CountryOption) => void;
  budget: number;
  onChangeBudget: (b: number) => void;
  sym: string;
  fieldErrors: Record<string, string>;
}

export const CountryRegionCard: FC<Props> = memo(
  ({
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    selectedCountry,
    onSelectCountry,
    budget,
    onChangeBudget,
    sym,
    fieldErrors,
  }) => {
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setCountryDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
      <section className="liquid-glass-card relative z-20 rounded-4xl p-5 sm:p-10">
        <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
          01 • Client, Contact & Region Details
        </span>
        <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
          Where are you based & how can I reach you?
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold opacity-80">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-sm"
            />
            {fullName.trim() && fieldErrors.fullName && (
              <p className="mt-1 text-[11px] font-medium text-red-500">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Searchable Country Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold opacity-80">
              Region / Country (Sets Currency Automatically) *
            </label>
            <button
              type="button"
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="glass-input mt-1.5 flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium"
            >
              <span className="flex items-center gap-2.5 truncate">
                <img
                  src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                  alt={selectedCountry.name}
                  className="h-4 w-6 shrink-0 rounded-xs object-cover shadow-2xs"
                />
                <span className="font-semibold">{selectedCountry.name}</span>
                <span className="glass-subcard rounded-full px-2 py-0.5 text-[10px] font-bold">
                  {selectedCountry.code === 'IN' ? '₹ INR' : '$ USD'}
                </span>
              </span>
              <svg
                className="h-3.5 w-3.5 opacity-60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {countryDropdownOpen && (
              <div className="liquid-glass-pill absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-hidden rounded-3xl shadow-2xl">
                <div className="border-b border-neutral-500/15 p-2.5">
                  <input
                    type="text"
                    autoFocus
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search country..."
                    className="glass-input w-full rounded-2xl px-3.5 py-2 text-xs"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto p-1.5">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        onSelectCountry(c);
                        setCountryDropdownOpen(false);
                        setCountrySearch('');
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-xs transition ${
                        selectedCountry.code === c.code
                          ? 'liquid-glass-active font-bold'
                          : 'hover:bg-neutral-500/10'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <img
                          src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                          alt={c.name}
                          className="h-4 w-6 shrink-0 rounded-xs object-cover"
                        />
                        <span>{c.name}</span>
                      </span>
                      <span className="text-[10px] opacity-75">
                        {c.code === 'IN' ? '₹ INR' : '$ USD'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold opacity-80">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-sm"
            />
            {email.trim() && fieldErrors.email && (
              <p className="mt-1 text-[11px] font-medium text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone / WhatsApp Number */}
          <div>
            <label className="block text-xs font-semibold opacity-80">
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={
                selectedCountry.code === 'IN' ? '+91 9876543210' : '+1 555 234 5678'
              }
              className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-sm"
            />
            {phone.trim() && fieldErrors.phone && (
              <p className="mt-1 text-[11px] font-medium text-red-500">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Optional Target Budget */}
          <div className="sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-semibold opacity-80">
                Your Target Budget ({sym})
              </label>
              {budget > 0 && (
                <button
                  type="button"
                  onClick={() => onChangeBudget(0)}
                  className="cursor-pointer text-[11px] font-semibold underline opacity-65 hover:opacity-100"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="glass-input mt-1.5 flex items-center rounded-2xl px-4 py-3">
              <span className="mr-1.5 font-bold opacity-50">{sym}</span>
              <input
                type="number"
                min={0}
                value={budget === 0 ? '' : budget}
                onChange={(e) =>
                  onChangeBudget(
                    e.target.value === '' ? 0 : Math.max(0, Number(e.target.value))
                  )
                }
                className="w-full bg-transparent text-sm font-bold focus:outline-none"
                placeholder={
                  selectedCountry.code === 'IN'
                    ? 'Enter your target budget in ₹ INR (or leave blank for a custom quote)'
                    : 'Enter your target budget in $ USD (or leave blank for a custom quote)'
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
);