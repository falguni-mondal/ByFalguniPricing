// frontend/src/components/AgreementModal.tsx
import type { FC } from 'react';
import {
  SCOPE_COMPARISON,
  WORKFLOW_STEPS,
  AGREEMENT_SECTIONS,
  buildRefinedAgreementParagraph,
} from '../utils/agreementPdfGenerator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  emailPhone: string;
  businessName: string;
  canAccept: boolean;
  onAcceptAndClose: () => void;
}

export const AgreementModal: FC<Props> = ({
  isOpen,
  onClose,
  fullName,
  emailPhone,
  businessName,
  canAccept,
  onAcceptAndClose,
}) => {
  if (!isOpen) return null;

  const liveStatement = buildRefinedAgreementParagraph(fullName, emailPhone, businessName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-xs sm:p-6">
      <div className="liquid-glass-card flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 border-b border-neutral-500/15 px-5 py-4 sm:px-8 sm:py-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              • 15-Day Quote Validity
            </span>
            <h2 className="mt-0.5 text-lg font-black tracking-tight sm:text-2xl">
              Website Development: Service Guide, Procedures & Agreement
            </h2>
          </div>
        </div>

        {/* Scrollable Agreement Body */}
        <div className="space-y-6 overflow-y-auto px-5 py-6 text-xs leading-relaxed sm:px-8">
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
              : 'Complete all required (*) fields across Tabs 01–05 to enable the agreement checkbox.'}
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
};