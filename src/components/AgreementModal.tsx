// frontend/src/components/AgreementModal.tsx
import { memo, type FC } from 'react';
import {
  SCOPE_COMPARISON,
  WORKFLOW_STEPS,
  AGREEMENT_SECTIONS,
  MOTION_TIER_LABELS,
  buildRefinedAgreementParagraph,
} from '../utils/agreementPdfGenerator';
import { WEBSITE_TYPES } from '../constants/pricingData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  emailPhone: string;
  businessName: string;
  businessDescription?: string;
  mainGoal?: string;
  launchDateReason?: string;
  designReferences?: string;
  countryName?: string;
  sym?: string;
  budget?: number;
  projectPurpose?: string;
  pages?: number;
  animationTier?: string;
  rushDelivery?: boolean;
  selectedTags?: string[];
  customSectionNotes?: {
    pagesAndTypeNote?: string;
    motionAndFeelNote?: string;
    functionalityNote?: string;
    briefExtraNote?: string;
  };
  canAccept: boolean;
  onAcceptAndClose: () => void;
}

export const AgreementModal: FC<Props> = memo(
  ({
    isOpen,
    onClose,
    fullName,
    emailPhone,
    businessName,
    businessDescription = '',
    mainGoal = '',
    launchDateReason = '',
    designReferences = '',
    countryName = 'India',
    sym = '₹',
    budget = 0,
    projectPurpose = '',
    pages = 0,
    animationTier = '',
    rushDelivery = false,
    selectedTags = [],
    customSectionNotes = {},
    canAccept,
    onAcceptAndClose,
  }) => {
    if (!isOpen) return null;

    const liveStatement = buildRefinedAgreementParagraph(fullName, emailPhone, businessName);
    const categoryObj = WEBSITE_TYPES.find((t) => t.id === projectPurpose);
    const categoryLabel = categoryObj ? categoryObj.title : projectPurpose || 'Not specified';
    const motionLabel = animationTier
      ? MOTION_TIER_LABELS[animationTier] || animationTier
      : 'Not specified';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-xs sm:p-6">
        <div className="liquid-glass-card flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-4xl shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between gap-4 border-b border-neutral-500/15 px-5 py-4 sm:px-8 sm:py-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                • Official Project Scope & Service Agreement
              </span>
              <h2 className="mt-0.5 text-lg font-black tracking-tight sm:text-2xl">
                Website Development: Service Guide, Procedures & Agreement
              </h2>
            </div>
          </div>

          {/* Scrollable Agreement Body */}
          <div className="space-y-6 overflow-y-auto px-5 py-6 text-xs leading-relaxed sm:px-8">
            {/* 0. Live Summary of Client's Choices & Custom Writings (Included in PDF) */}
            <div className="glass-subcard space-y-3 rounded-2xl border border-[#ff5733]/30 p-4 sm:p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5733]">
                Your Submitted Choices & Custom Writings (Recorded in Agreement PDF)
              </span>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <span className="opacity-60">Client & Contact:</span>{' '}
                  <strong>{fullName || '—'}</strong> ({emailPhone || '—'})
                </div>
                <div>
                  <span className="opacity-60">Country & Target Budget:</span>{' '}
                  <strong>
                    {countryName} • {budget > 0 ? `${sym}${budget.toLocaleString()}` : 'Not specified'}
                  </strong>
                </div>
                <div>
                  <span className="opacity-60">Pages & Website Category:</span>{' '}
                  <strong>
                    {pages} {pages === 1 ? 'Page' : 'Pages'} • {categoryLabel}
                  </strong>
                </div>
                <div>
                  <span className="opacity-60">Motion Tier & Timeline:</span>{' '}
                  <strong>
                    {motionLabel} • {rushDelivery ? 'Rush Delivery' : 'Standard Timeline'}
                  </strong>
                </div>
                <div>
                  <span className="opacity-60">Business & Main Goal:</span>{' '}
                  <strong>
                    {businessName || '—'} — {mainGoal || '—'}
                  </strong>
                </div>
                <div>
                  <span className="opacity-60">Ideal Launch:</span>{' '}
                  <strong>{launchDateReason.trim() || 'Not specified'}</strong>
                </div>
              </div>

              {businessDescription && (
                <div>
                  <span className="opacity-60">Business Description:</span>{' '}
                  <span className="font-medium">{businessDescription}</span>
                </div>
              )}

              <div>
                <span className="opacity-60">Design / Reference URLs:</span>{' '}
                <span className="font-medium break-all">
                  {designReferences.trim() || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="opacity-60">
                  Selected Functionalities ({selectedTags.length}):
                </span>{' '}
                <span className="font-semibold">
                  {selectedTags.length > 0 ? selectedTags.join(', ') : 'None selected'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 border-t border-neutral-500/15 pt-2.5 sm:grid-cols-2">
                <div>
                  <span className="opacity-60">Pages / Category Custom Note:</span>{' '}
                  <span className="font-medium">
                    {customSectionNotes.pagesAndTypeNote?.trim() || 'None'}
                  </span>
                </div>
                <div>
                  <span className="opacity-60">Functionality Custom Note:</span>{' '}
                  <span className="font-medium">
                    {customSectionNotes.functionalityNote?.trim() || 'None'}
                  </span>
                </div>
                <div>
                  <span className="opacity-60">Motion & 3D Custom Note:</span>{' '}
                  <span className="font-medium">
                    {customSectionNotes.motionAndFeelNote?.trim() || 'None'}
                  </span>
                </div>
                <div>
                  <span className="opacity-60">Additional Brief Custom Note:</span>{' '}
                  <span className="font-medium">
                    {customSectionNotes.briefExtraNote?.trim() || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Scope Comparison Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="glass-subcard rounded-2xl p-4 sm:p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  ✓ What I Provide (Development & Deployment)
                </h3>
                <ul className="mt-3 space-y-2 opacity-85">
                  {SCOPE_COMPARISON.provided.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-subcard rounded-2xl p-4 sm:p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  ✕ What I Do Not Provide (Out of Scope)
                </h3>
                <ul className="mt-3 space-y-2 opacity-85">
                  {SCOPE_COMPARISON.notProvided.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. The 10-Step Workflow */}
            <div className="glass-subcard rounded-2xl p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">
                How We Work Together — Step-by-Step Procedure
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {WORKFLOW_STEPS.map((step, idx) => (
                  <div key={idx} className="rounded-xl border border-neutral-500/10 p-3 text-xs">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. All 8 Core Agreement Clauses */}
            <div className="space-y-4">
              {AGREEMENT_SECTIONS.map((sec) => (
                <div key={sec.number} className="glass-subcard rounded-2xl p-4 sm:p-5">
                  <h4 className="text-sm font-bold">
                    {sec.number}. {sec.title}
                  </h4>
                  <ul className="mt-2.5 space-y-1.5 opacity-85">
                    {sec.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* 4. Binding Electronic Acceptance Statement Preview */}
            <div className="rounded-2xl border-2 border-current/20 p-4 sm:p-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5733]">
                Your Binding Electronic Acceptance Statement (Included on Downloaded PDF)
              </span>
              <p className="mt-2 text-xs font-semibold leading-relaxed">{liveStatement}</p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-500/15 px-5 py-4 sm:px-8">
            <span className="text-[11px] opacity-65">
              {canAccept
                ? 'All required fields are filled. You may accept the agreement below.'
                : 'Complete all required (*) fields to enable the agreement checkbox.'}
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="liquid-glass-pill cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold"
              >
                Close
              </button>
              {canAccept && (
                <button
                  type="button"
                  onClick={onAcceptAndClose}
                  className="liquid-glass-active cursor-pointer rounded-full px-6 py-2.5 text-xs font-bold"
                >
                  ✓ I Agree to This Agreement
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);