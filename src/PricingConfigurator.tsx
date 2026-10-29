// frontend/src/PricingConfigurator.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { LiquidGlassFilterSVG } from './components/LiquidGlass';
import { COUNTRIES, type CountryOption } from './constants/pricingData';
import { StickyNavbar } from './components/StickyNavbar';
import { StepTabsNav, PRICING_TABS } from './components/StepTabsNav';
import { CountryRegionCard } from './components/CountryRegionCard';
import { WebsiteCategoryCard } from './components/WebsiteCategoryCard';
import { MotionExperienceCard, type MotionTier } from './components/MotionExperienceCard';
import { FunctionalityCard } from './components/FunctionalityCard';
import { BusinessBriefCard } from './components/BusinessBriefCard';
import { AgreementModal } from './components/AgreementModal';
import { uploadQueuedClientFiles } from './components/ImageKitUploader';
import { generateAndDownloadAgreementPdf } from './utils/agreementPdfGenerator';
import { validateClientSubmission } from './utils/validation';
import { evaluateProjectQuote } from './utils/localPricingEngine';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function PricingConfigurator() {
  // Default to Dark Mode initially with zero flash of light theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem('byf-pricing-theme') !== 'light';
    } catch {
      return true;
    }
  });
  const [activeTab, setActiveTab] = useState<number>(1);
  const cardTopRef = useRef<HTMLDivElement>(null);

  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [launchDateReason, setLaunchDateReason] = useState('');
  const [designReferences, setDesignReferences] = useState('');

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const [customSectionNotes, setCustomSectionNotes] = useState({
    pagesAndTypeNote: '',
    motionAndFeelNote: '',
    functionalityNote: '',
    briefExtraNote: '',
  });

  // Initial State: Starts at 0 pages, 0 budget, no category or services selected yet
  const [simpleChoices, setSimpleChoices] = useState({
    region: 'INDIA' as 'INDIA' | 'INTL',
    budget: 0,
    pages: 0,
    projectPurpose: '',
    animationTier: 'NONE' as MotionTier,
    webglScenes: 0,
    rushDelivery: false,
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [masterConfig, setMasterConfig] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch master pricing config once in the background so local calculation is 100% instantaneous (0ms lag)
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/api/pricing-config`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setMasterConfig(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('byf-pricing-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('byf-pricing-theme', 'light');
    }
  };

  // Run full Regex validation across all fields
  const validation = validateClientSubmission({
    fullName,
    email,
    phone,
    countryCode: selectedCountry.code,
    budget: simpleChoices.budget,
    region: simpleChoices.region,
    projectPurpose: simpleChoices.projectPurpose,
    pagesAndTypeNote: customSectionNotes.pagesAndTypeNote,
    pages: simpleChoices.pages,
    businessName,
    businessDescription,
    mainGoal,
    launchDateReason,
    designReferences,
  });

  const allRequiredFilled = validation.isValid;
  const missingFields = validation.missingList;
  const emailPhoneCombined = [email.trim(), phone.trim()].filter(Boolean).join(' | ');

  useEffect(() => {
    if (!allRequiredFilled && agreementAccepted) {
      setAgreementAccepted(false);
    }
  }, [allRequiredFilled, agreementAccepted]);

  const handleToggleAgreement = () => {
    if (!allRequiredFilled) {
      setSubmitError(
        `Please complete and validate all required fields first: ${missingFields.join(', ')}`
      );
      return;
    }
    setSubmitError('');
    setAgreementAccepted((prev) => !prev);
  };

  const goToTab = (tabNumber: number) => {
    const clamped = Math.max(1, Math.min(PRICING_TABS.length, tabNumber));
    setActiveTab(clamped);
    setSubmitError('');
    if (cardTopRef.current) {
      const y = cardTopRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const handleSelectCountry = (c: CountryOption) => {
    setSelectedCountry(c);
    const nextRegion = c.code === 'IN' ? 'INDIA' : 'INTL';
    setSimpleChoices((prev) => ({
      ...prev,
      region: nextRegion,
    }));
  };

  // Only combine the client's actual custom written notes
  const combinedCustomNotesOnly = [
    customSectionNotes.pagesAndTypeNote.trim(),
    customSectionNotes.functionalityNote.trim(),
    customSectionNotes.motionAndFeelNote.trim(),
    customSectionNotes.briefExtraNote.trim(),
  ]
    .filter(Boolean)
    .join('\n');

  // Instantaneous 0ms calculation in memory (hidden from frontend UI, sent to Admin Panel on submit)
  const quote = useMemo(() => {
    return evaluateProjectQuote(
      {
        ...simpleChoices,
        animationPages: simpleChoices.pages,
        webglScenes:
          simpleChoices.animationTier === 'WEBGL_3D'
            ? Math.max(1, simpleChoices.webglScenes || 1)
            : 0,
        selectedTags,
        clientDescription: combinedCustomNotesOnly,
      },
      masterConfig
    );
  }, [simpleChoices, selectedTags, combinedCustomNotesOnly, masterConfig]);

  const sym = quote?.currencySymbol || (simpleChoices.region === 'INDIA' ? '₹' : '$');

  const handleSubmitQuote = async () => {
    setSubmitError('');

    if (!allRequiredFilled) {
      return setSubmitError(`Please fix required fields: ${missingFields.join(', ')}`);
    }
    if (!agreementAccepted) {
      return setSubmitError(
        'Please tick the agreement checkbox to confirm you accept the Service Guide & Agreement.'
      );
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const agreedAtIso = new Date().toISOString();

      const { pdfFile, acceptanceText } = generateAndDownloadAgreementPdf({
        fullName,
        email: email.trim(),
        phone: phone.trim(),
        emailPhone: emailPhoneCombined,
        businessName: businessName.trim(),
        businessDescription: businessDescription.trim(),
        countryName: selectedCountry.name,
        region: simpleChoices.region,
        currencySymbol: sym,
        budget: simpleChoices.budget,
        grandTotal: Number(quote?.grandTotal || 0),
        pages: simpleChoices.pages,
        projectPurpose: simpleChoices.projectPurpose || 'Custom',
        animationTier: simpleChoices.animationTier,
        rushDelivery: simpleChoices.rushDelivery,
        mainGoal: mainGoal.trim(),
        launchDateReason: launchDateReason.trim(),
        designReferences: designReferences.trim(),
        selectedTags,
        customSectionNotes,
        attachedFileNames: pendingFiles.map((f) => f.name),
        quoteItems: quote?.items || [],
        milestones: quote?.milestones || [],
        agreedAtIso,
      });

      // 2. Upload client files + Signed Agreement PDF to ImageKit (/Clients/Files/{Name}_{Contact})
      let signedAgreementUrl = '';
      let signedAgreementFileId = '';
      let clientProjectAssets: any[] = [];

      try {
        const filesWithAgreement = [...pendingFiles, pdfFile];
        const allUploaded = await uploadQueuedClientFiles(
          filesWithAgreement,
          fullName,
          emailPhoneCombined,
          (pct) => setUploadProgress(pct)
        );
        const signedAsset = allUploaded[allUploaded.length - 1];
        signedAgreementUrl = signedAsset?.url || '';
        signedAgreementFileId = signedAsset?.fileId || '';
        clientProjectAssets = allUploaded.slice(0, allUploaded.length - 1);
      } catch (uploadErr) {
        console.warn('ImageKit upload skipped or failed; storing full record in MongoDB:', uploadErr);
      }

      // 3. Save complete client record + calculated estimate to MongoDB for Admin Panel
      const res = await fetch(`${API_BASE}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          emailPhone: emailPhoneCombined,
          countryName: selectedCountry.name,
          countryCode: selectedCountry.code,
          countryFlag: selectedCountry.code,
          region: simpleChoices.region,
          businessName: businessName.trim(),
          businessDescription: businessDescription.trim(),
          mainGoal: mainGoal.trim(),
          launchDateReason: launchDateReason.trim(),
          rushDelivery: simpleChoices.rushDelivery,
          designReferences: designReferences.trim(),
          budget: simpleChoices.budget,
          clientDescription: combinedCustomNotesOnly,
          uploadedAssets: clientProjectAssets,
          signedAgreementPdfUrl: signedAgreementUrl,
          signedAgreementFileId,
          signedAgreementText: acceptanceText,
          agreedAt: agreedAtIso,
          evaluatedQuote: quote,
          simpleChoices: {
            ...simpleChoices,
            selectedTags,
            customSectionNotes,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit project response.');
      }

      setPendingFiles([]);
      setSubmittedSuccess(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <LiquidGlassFilterSVG />

      {/* Background Typographic Watermark */}
      <div className="pointer-events-none fixed inset-0 flex select-none flex-col items-center justify-center overflow-hidden opacity-[0.035]">
        <span className="text-[20vw] font-black leading-none tracking-tighter">BYFALGUNI</span>
      </div>

      <StickyNavbar
        selectedCountry={selectedCountry}
        sym={sym}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-28 pt-22 sm:px-6 sm:pt-28 2xl:max-w-5xl">
        <div className="mb-7 text-center sm:mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-50">
            Interactive Project Scope Configurator
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-5xl 2xl:text-6xl">
            Tell me about your vision.
            <br />
            <span className="opacity-45">Configure your project needs for a custom quote.</span>
          </h1>
        </div>

        <div ref={cardTopRef}>
          <StepTabsNav activeTab={activeTab} onSelectTab={goToTab} />

          {activeTab === 1 && (
            <CountryRegionCard
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              selectedCountry={selectedCountry}
              onSelectCountry={handleSelectCountry}
              budget={simpleChoices.budget}
              onChangeBudget={(budget) => setSimpleChoices((p) => ({ ...p, budget }))}
              sym={sym}
              fieldErrors={validation.errors}
            />
          )}

          {activeTab === 2 && (
            <WebsiteCategoryCard
              projectPurpose={simpleChoices.projectPurpose}
              pages={simpleChoices.pages}
              onSelectWebsiteType={(t) => {
                // Only set the selected category; do NOT auto-select services or overwrite page count
                setSimpleChoices((p) => ({
                  ...p,
                  projectPurpose: t.id,
                }));
              }}
              onChangePages={(pages) => setSimpleChoices((p) => ({ ...p, pages }))}
              note={customSectionNotes.pagesAndTypeNote}
              onChangeNote={(pagesAndTypeNote) =>
                setCustomSectionNotes((p) => ({ ...p, pagesAndTypeNote }))
              }
            />
          )}

          {activeTab === 3 && (
            <FunctionalityCard
              projectPurpose={simpleChoices.projectPurpose}
              selectedTags={selectedTags}
              onToggleTag={(tag) =>
                setSelectedTags((prev) =>
                  prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                )
              }
              note={customSectionNotes.functionalityNote}
              onChangeNote={(functionalityNote) =>
                setCustomSectionNotes((p) => ({ ...p, functionalityNote }))
              }
            />
          )}

          {activeTab === 4 && (
            <MotionExperienceCard
              animationTier={simpleChoices.animationTier}
              onSelectTier={(animationTier) =>
                setSimpleChoices((p) => ({
                  ...p,
                  animationTier,
                  webglScenes: animationTier === 'WEBGL_3D' ? 1 : 0,
                }))
              }
              note={customSectionNotes.motionAndFeelNote}
              onChangeNote={(motionAndFeelNote) =>
                setCustomSectionNotes((p) => ({ ...p, motionAndFeelNote }))
              }
            />
          )}

          {activeTab === 5 && (
            <BusinessBriefCard
              businessName={businessName}
              setBusinessName={setBusinessName}
              businessDescription={businessDescription}
              setBusinessDescription={setBusinessDescription}
              mainGoal={mainGoal}
              setMainGoal={setMainGoal}
              launchDateReason={launchDateReason}
              setLaunchDateReason={setLaunchDateReason}
              rushDelivery={simpleChoices.rushDelivery}
              onToggleRush={() =>
                setSimpleChoices((p) => ({ ...p, rushDelivery: !p.rushDelivery }))
              }
              designReferences={designReferences}
              setDesignReferences={setDesignReferences}
              extraNote={customSectionNotes.briefExtraNote}
              setExtraNote={(briefExtraNote) =>
                setCustomSectionNotes((p) => ({ ...p, briefExtraNote }))
              }
              pendingFiles={pendingFiles}
              onFilesChange={setPendingFiles}
              uploadProgress={uploadProgress}
              agreementAccepted={agreementAccepted}
              onToggleAgreement={handleToggleAgreement}
              onOpenAgreementModal={() => setShowAgreementModal(true)}
              allRequiredFilled={allRequiredFilled}
              missingFields={missingFields}
              fieldErrors={validation.errors}
              submitError={submitError}
              submittedSuccess={submittedSuccess}
              submitting={submitting}
              fullName={fullName}
              emailPhone={emailPhoneCombined}
              onSubmit={handleSubmitQuote}
            />
          )}

          {/* PREVIOUS / NEXT TAB CONTROLS BAR */}
          <div className="mt-6 flex items-center justify-between gap-3">
            {activeTab > 1 ? (
              <button
                type="button"
                onClick={() => goToTab(activeTab - 1)}
                className="liquid-glass-pill cursor-pointer rounded-full px-6 py-3.5 text-xs font-bold"
              >
                ← Previous
              </button>
            ) : (
              <div />
            )}

            {activeTab < PRICING_TABS.length && (
              <button
                type="button"
                onClick={() => goToTab(activeTab + 1)}
                className="liquid-glass-active cursor-pointer rounded-full px-7 py-3.5 text-xs font-bold"
              >
                Next: {PRICING_TABS[activeTab]?.fullLabel.split('• ')[1]} →
              </button>
            )}
          </div>
        </div>
      </main>

      <AgreementModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        fullName={fullName}
        emailPhone={emailPhoneCombined}
        businessName={businessName}
        businessDescription={businessDescription}
        mainGoal={mainGoal}
        launchDateReason={launchDateReason}
        designReferences={designReferences}
        countryName={selectedCountry.name}
        sym={sym}
        budget={simpleChoices.budget}
        projectPurpose={simpleChoices.projectPurpose}
        pages={simpleChoices.pages}
        animationTier={simpleChoices.animationTier}
        rushDelivery={simpleChoices.rushDelivery}
        selectedTags={selectedTags}
        customSectionNotes={customSectionNotes}
        canAccept={allRequiredFilled}
        onAcceptAndClose={() => {
          setAgreementAccepted(true);
          setShowAgreementModal(false);
        }}
      />
    </div>
  );
}