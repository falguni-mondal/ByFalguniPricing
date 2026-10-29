// frontend/src/components/BusinessBriefCard.tsx
import type { FC } from 'react';
import { ImageKitDirectUploader } from './ImageKitUploader';
import { buildRefinedAgreementParagraph } from '../utils/agreementPdfGenerator';

interface Props {
  businessName: string;
  setBusinessName: (v: string) => void;
  businessDescription: string;
  setBusinessDescription: (v: string) => void;
  mainGoal: string;
  setMainGoal: (v: string) => void;
  launchDateReason: string;
  setLaunchDateReason: (v: string) => void;
  rushDelivery: boolean;
  onToggleRush: () => void;
  designReferences: string;
  setDesignReferences: (v: string) => void;
  extraNote: string;
  setExtraNote: (v: string) => void;
  pendingFiles: File[];
  onFilesChange: (files: File[]) => void;
  uploadProgress: number;
  agreementAccepted: boolean;
  onToggleAgreement: () => void;
  onOpenAgreementModal: () => void;
  allRequiredFilled: boolean;
  missingFields: string[];
  fieldErrors: Record<string, string>;
  submitError: string;
  submittedSuccess: boolean;
  submitting: boolean;
  fullName: string;
  emailPhone: string;
  onSubmit: () => void;
}

export const BusinessBriefCard: FC<Props> = ({
  businessName,
  setBusinessName,
  businessDescription,
  setBusinessDescription,
  mainGoal,
  setMainGoal,
  launchDateReason,
  setLaunchDateReason,
  rushDelivery,
  onToggleRush,
  designReferences,
  setDesignReferences,
  extraNote,
  setExtraNote,
  pendingFiles,
  onFilesChange,
  uploadProgress,
  agreementAccepted,
  onToggleAgreement,
  onOpenAgreementModal,
  allRequiredFilled,
  missingFields,
  fieldErrors,
  submitError,
  submittedSuccess,
  submitting,
  fullName,
  emailPhone,
  onSubmit,
}) => {
  const previewParagraph = buildRefinedAgreementParagraph(fullName, emailPhone, businessName);

  return (
    <section className="liquid-glass-card relative z-10 space-y-5 rounded-[2rem] p-5 sm:p-10">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">
          05 • Mandatory Business Brief, Agreement & Submission
        </span>
        <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
          Tell me about your business & design references
        </h2>
        <p className="mt-1 text-xs opacity-60">
          All text fields marked with * are validated and required before you can tick the
          Agreement and submit (file upload is optional).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold opacity-80">Business Name *</label>
          <input
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Noctowls"
            className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-xs sm:text-sm"
          />
          {businessName.trim() && fieldErrors.businessName && (
            <p className="mt-1 text-[11px] font-medium text-red-500">{fieldErrors.businessName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold opacity-80">
            Main Goal (Leads, Sales, Portfolio, Pitch) *
          </label>
          <input
            type="text"
            required
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value)}
            placeholder="e.g. Drive online bookings and brand authority"
            className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-xs sm:text-sm"
          />
          {mainGoal.trim() && fieldErrors.mainGoal && (
            <p className="mt-1 text-[11px] font-medium text-red-500">{fieldErrors.mainGoal}</p>
          )}
        </div>
      </div>

      {/* Required Description of the Business */}
      <div>
        <label className="block text-xs font-semibold opacity-80">
          Description of the Business (What does your business do & who are your customers?) *
        </label>
        <textarea
          rows={2}
          required
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          placeholder="Describe what your business offers, your products/services, and your target audience..."
          className="glass-input mt-1.5 w-full rounded-2xl p-4 text-xs sm:text-sm"
        />
        {businessDescription.trim() && fieldErrors.businessDescription && (
          <p className="mt-1 text-[11px] font-medium text-red-500">
            {fieldErrors.businessDescription}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold opacity-80">
            Ideal Launch Date & Reason *
          </label>
          <input
            type="text"
            required
            value={launchDateReason}
            onChange={(e) => setLaunchDateReason(e.target.value)}
            placeholder="e.g. Nov 30 — New campaign launch"
            className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-xs sm:text-sm"
          />
          {launchDateReason.trim() && fieldErrors.launchDateReason && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              {fieldErrors.launchDateReason}
            </p>
          )}
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onToggleRush}
            className={`w-full cursor-pointer rounded-2xl px-4 py-3 text-xs font-semibold transition ${
              rushDelivery ? 'liquid-glass-active' : 'liquid-glass-pill'
            }`}
          >
            {rushDelivery ? '✓ ' : '+ '}Rush Delivery (Half the usual time)
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold opacity-80">
          Figma Design Link OR 3 Website URLs That You Love (Must include https://...) *
        </label>
        <textarea
          rows={2}
          required
          value={designReferences}
          onChange={(e) => setDesignReferences(e.target.value)}
          placeholder="Paste your Figma link or 3 reference URLs (e.g. https://example.com) and what you love about each..."
          className="glass-input mt-1.5 w-full rounded-2xl p-4 text-xs sm:text-sm"
        />
        {designReferences.trim() && fieldErrors.designReferences && (
          <p className="mt-1 text-[11px] font-medium text-red-500">
            {fieldErrors.designReferences}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold opacity-75">
          Anything else you want me to know? (Optional):
        </label>
        <input
          type="text"
          value={extraNote}
          onChange={(e) => setExtraNote(e.target.value)}
          placeholder="Any special timelines, questions, or notes..."
          className="glass-input mt-1.5 w-full rounded-2xl px-4 py-3 text-xs"
        />
      </div>

      <ImageKitDirectUploader
        pendingFiles={pendingFiles}
        onFilesChange={onFilesChange}
        uploading={submitting && pendingFiles.length > 0}
        uploadProgress={uploadProgress}
      />

      {/* MANDATORY AGREEMENT CHECKBOX & MODAL TRIGGER GATE */}
      <div className="glass-subcard space-y-3 rounded-3xl p-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggleAgreement}
            aria-label="Agree to Service Guide and Agreement"
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
              !allRequiredFilled
                ? 'cursor-not-allowed border-neutral-400/40 opacity-40'
                : agreementAccepted
                ? 'liquid-glass-active cursor-pointer border-transparent'
                : 'glass-input cursor-pointer border-neutral-400'
            }`}
          >
            {agreementAccepted && <span className="text-xs font-bold">✓</span>}
          </button>

          <div className="text-xs leading-relaxed">
            <span
              onClick={onToggleAgreement}
              className={allRequiredFilled ? 'cursor-pointer font-medium' : 'opacity-70'}
            >
              I have read, understood, and agree to the{' '}
            </span>
            <button
              type="button"
              onClick={onOpenAgreementModal}
              className="cursor-pointer font-bold underline decoration-current underline-offset-4 hover:text-[#ff5733]"
            >
              Website Development Service Guide, Procedures, Processes & Agreement
            </button>
            <span>
              . Upon clicking Submit, my signed agreement PDF will be downloaded automatically.
            </span>
          </div>
        </div>

        {!allRequiredFilled && (
          <p className="text-[11px] opacity-65">
            Complete & validate required fields to unlock this checkbox:{' '}
            <strong>{missingFields.join(' • ')}</strong>
          </p>
        )}

        {agreementAccepted && allRequiredFilled && (
          <div className="rounded-2xl border border-neutral-500/15 p-3.5 text-[11px] leading-relaxed opacity-85">
            {previewParagraph}
          </div>
        )}
      </div>

      {submitError && (
        <div className="glass-subcard rounded-2xl px-4 py-3 text-xs font-bold text-red-500">
          {submitError}
        </div>
      )}

      {submittedSuccess ? (
        <div className="liquid-glass-active rounded-3xl p-6 text-center">
          <h3 className="text-lg font-bold">
            Thank you, {fullName}. Your project brief & signed agreement have been submitted.
          </h3>
          <p className="mt-1 text-xs opacity-80">
            Your signed Agreement PDF has been downloaded to your device. I will review your
            requirements and send you a custom project quote shortly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-stretch justify-end gap-3 pt-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={submitting || !agreementAccepted || !allRequiredFilled}
            onClick={onSubmit}
            className={`rounded-full px-8 py-4 text-xs font-bold tracking-wide transition ${
              agreementAccepted && allRequiredFilled && !submitting
                ? 'liquid-glass-active cursor-pointer'
                : 'liquid-glass-pill cursor-not-allowed opacity-45'
            }`}
          >
            {submitting
              ? `Generating Agreement PDF & Uploading (${uploadProgress}%)...`
              : 'Submit Brief & Download Signed Agreement PDF →'}
          </button>
        </div>
      )}
    </section>
  );
};