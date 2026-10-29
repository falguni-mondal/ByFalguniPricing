// frontend/src/PricingConfigurator.tsx
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { LiquidGlassFilterSVG } from './components/LiquidGlass';
import { COUNTRIES, type CountryOption, type WebsiteTypeOption } from './constants/pricingData';
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

function resolveTabFromLocation(): number {
  if (typeof window === 'undefined') return 1;
  const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  if (!rawHash) return 1;

  const exactMatch = PRICING_TABS.find(
    (t) => t.slug.toLowerCase() === rawHash || String(t.id) === rawHash
  );
  if (exactMatch) return exactMatch.id;

  if (rawHash.includes('page') || rawHash.includes('categor')) return 2;
  if (rawHash.includes('func') || rawHash.includes('feature')) return 3;
  if (rawHash.includes('motion') || rawHash.includes('3d')) return 4;
  if (rawHash.includes('brief') || rawHash.includes('submit')) return 5;
  return 1;
}

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

  // URL-routed active tab state
  const [activeTab, setActiveTab] = useState<number>(() => resolveTabFromLocation());
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

  // Initial State: Starts at 0 pages, 0 budget, no category, no motion tier, no features pre-selected
  const [simpleChoices, setSimpleChoices] = useState({
    region: 'INDIA' as 'INDIA' | 'INTL',
    budget: 0,
    pages: 0,
    projectPurpose: '',
    animationTier: '' as MotionTier,
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

  // Sync URL hash route on initial mount and browser Back/Forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.location.hash) {
      const initialTabObj = PRICING_TABS.find((t) => t.id === activeTab) || PRICING_TABS[0];
      window.history.replaceState(null, '', `#/${initialTabObj.slug}`);
    }

    const handleRouteChange = () => {
      const nextTab = resolveTabFromLocation();
      setActiveTab(nextTab);
      setSubmitError('');
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

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

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('byf-pricing-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('byf-pricing-theme', 'light');
      }
      return next;
    });
  }, []);

  // Memoize validation so it only runs when relevant inputs change
  const validation = useMemo(
    () =>
      validateClientSubmission({
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
      }),
    [
      fullName,
      email,
      phone,
      selectedCountry.code,
      simpleChoices.budget,
      simpleChoices.region,
      simpleChoices.projectPurpose,
      customSectionNotes.pagesAndTypeNote,
      simpleChoices.pages,
      businessName,
      businessDescription,
      mainGoal,
      launchDateReason,
      designReferences,
    ]
  );

  const allRequiredFilled = validation.isValid;
  const missingFields = validation.missingList;
  const emailPhoneCombined = useMemo(
    () => [email.trim(), phone.trim()].filter(Boolean).join(' | '),
    [email, phone]
  );

  useEffect(() => {
    if (!allRequiredFilled && agreementAccepted) {
      setAgreementAccepted(false);
    }
  }, [allRequiredFilled, agreementAccepted]);

  const handleToggleAgreement = useCallback(() => {
    if (!allRequiredFilled) {
      setSubmitError(
        `Please complete and validate all required fields first: ${missingFields.join(', ')}`
      );
      return;
    }
    setSubmitError('');
    setAgreementAccepted((prev) => !prev);
  }, [allRequiredFilled, missingFields]);

  const goToTab = useCallback((tabNumber: number) => {
    const clamped = Math.max(1, Math.min(PRICING_TABS.length, tabNumber));
    const targetTabObj = PRICING_TABS.find((t) => t.id === clamped) || PRICING_TABS[0];
    const targetHash = `#/${targetTabObj.slug}`;
    if (typeof window !== 'undefined' && window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
    setActiveTab(clamped);
    setSubmitError('');
    if (cardTopRef.current) {
      const y = cardTopRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  }, []);

  const handleSelectCountry = useCallback((c: CountryOption) => {
    setSelectedCountry(c);
    const nextRegion = c.code === 'IN' ? 'INDIA' : 'INTL';
    setSimpleChoices((prev) => ({
      ...prev,
      region: nextRegion,
    }));
  }, []);

  const handleChangeBudget = useCallback((budget: number) => {
    setSimpleChoices((p) => ({ ...p, budget }));
  }, []);

  // Clicking an already-selected category unselects it
  const handleSelectWebsiteType = useCallback((t: WebsiteTypeOption) => {
    setSimpleChoices((p) => ({
      ...p,
      projectPurpose: p.projectPurpose === t.id ? '' : t.id,
    }));
  }, []);

  const handleChangePages = useCallback((pages: number) => {
    setSimpleChoices((p) => ({ ...p, pages }));
  }, []);

  const handlePagesNoteChange = useCallback((pagesAndTypeNote: string) => {
    setCustomSectionNotes((p) => ({ ...p, pagesAndTypeNote }));
  }, []);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  // Single-click toggle for all recommended features in Tab 3
  const handleToggleRecommendedTags = useCallback((recTags: string[]) => {
    setSelectedTags((prev) => {
      const allPresent = recTags.length > 0 && recTags.every((t) => prev.includes(t));
      if (allPresent) {
        return prev.filter((t) => !recTags.includes(t));
      }
      return Array.from(new Set([...prev, ...recTags]));
    });
  }, []);

  const handleFunctionalityNoteChange = useCallback((functionalityNote: string) => {
    setCustomSectionNotes((p) => ({ ...p, functionalityNote }));
  }, []);

  const handleSelectMotionTier = useCallback((animationTier: MotionTier) => {
    setSimpleChoices((p) => ({
      ...p,
      animationTier,
      webglScenes: animationTier === 'WEBGL_3D' ? 1 : 0,
    }));
  }, []);

  const handleMotionNoteChange = useCallback((motionAndFeelNote: string) => {
    setCustomSectionNotes((p) => ({ ...p, motionAndFeelNote }));
  }, []);

  const handleToggleRush = useCallback(() => {
    setSimpleChoices((p) => ({ ...p, rushDelivery: !p.rushDelivery }));
  }, []);

  const handleBriefExtraNoteChange = useCallback((briefExtraNote: string) => {
    setCustomSectionNotes((p) => ({ ...p, briefExtraNote }));
  }, []);

  const handleOpenAgreementModal = useCallback(() => {
    setShowAgreementModal(true);
  }, []);

  const handleCloseAgreementModal = useCallback(() => {
    setShowAgreementModal(false);
  }, []);

  // Only combine the client's actual custom written notes
  const combinedCustomNotesOnly = useMemo(
    () =>
      [
        customSectionNotes.pagesAndTypeNote.trim(),
        customSectionNotes.functionalityNote.trim(),
        customSectionNotes.motionAndFeelNote.trim(),
        customSectionNotes.briefExtraNote.trim(),
      ]
        .filter(Boolean)
        .join('\n'),
    [customSectionNotes]
  );

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
        projectPurpose: simpleChoices.projectPurpose || '',
        animationTier: simpleChoices.animationTier || '',
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
              onChangeBudget={handleChangeBudget}
              sym={sym}
              fieldErrors={validation.errors}
            />
          )}

          {activeTab === 2 && (
            <WebsiteCategoryCard
              projectPurpose={simpleChoices.projectPurpose}
              pages={simpleChoices.pages}
              onSelectWebsiteType={handleSelectWebsiteType}
              onChangePages={handleChangePages}
              note={customSectionNotes.pagesAndTypeNote}
              onChangeNote={handlePagesNoteChange}
              pageError={validation.errors.pages}
            />
          )}

          {activeTab === 3 && (
            <FunctionalityCard
              projectPurpose={simpleChoices.projectPurpose}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              onToggleRecommendedTags={handleToggleRecommendedTags}
              note={customSectionNotes.functionalityNote}
              onChangeNote={handleFunctionalityNoteChange}
            />
          )}

          {activeTab === 4 && (
            <MotionExperienceCard
              animationTier={simpleChoices.animationTier}
              onSelectTier={handleSelectMotionTier}
              note={customSectionNotes.motionAndFeelNote}
              onChangeNote={handleMotionNoteChange}
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
              onToggleRush={handleToggleRush}
              designReferences={designReferences}
              setDesignReferences={setDesignReferences}
              extraNote={customSectionNotes.briefExtraNote}
              setExtraNote={handleBriefExtraNoteChange}
              pendingFiles={pendingFiles}
              onFilesChange={setPendingFiles}
              uploadProgress={uploadProgress}
              agreementAccepted={agreementAccepted}
              onToggleAgreement={handleToggleAgreement}
              onOpenAgreementModal={handleOpenAgreementModal}
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

      {showAgreementModal && (
        <AgreementModal
          isOpen={showAgreementModal}
          onClose={handleCloseAgreementModal}
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
      )}
    </div>
  );
}