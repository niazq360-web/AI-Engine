import React, { useState, useRef } from 'react';
import { DesignCategory, SubCategory, DesignVariation, GenerationState, LanguageCode, CanvasLayer, TextLayer, ShapeLayer, BackgroundLayer } from '../types';
import { DESIGN_CATEGORIES, CANVAS_PRESETS, COLOR_PRESETS, LOADING_MESSAGES } from '../constants/templates';
import { TRANSLATIONS } from '../constants/translations';
import { generateDesignVariations } from '../services/geminiService';

interface AIStudioGeneratorProps {
  language: LanguageCode;
  onOpenInEditor: (layers: CanvasLayer[], width: number, height: number, title: string, previewUrl?: string) => void;
  onDirectExport: (variation: DesignVariation, width: number, height: number) => void;
}

const AIStudioGenerator: React.FC<AIStudioGeneratorProps> = ({
  language,
  onOpenInEditor,
  onDirectExport
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<DesignCategory>(DESIGN_CATEGORIES[0]);
  const [selectedSub, setSelectedSub] = useState<SubCategory>(DESIGN_CATEGORIES[0].subCategories[0]);
  const [selectedPreset, setSelectedPreset] = useState(CANVAS_PRESETS[0]);
  const [mode, setMode] = useState<'create' | 'redesign'>('create');

  // Brief fields
  const [headline, setHeadline] = useState<string>('');
  const [subText, setSubText] = useState<string>('');
  const [callToAction, setCallToAction] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('General Audience & Customers');
  const [primaryColor, setPrimaryColor] = useState(COLOR_PRESETS[0].primary);
  const [secondaryColor, setSecondaryColor] = useState(COLOR_PRESETS[0].secondary);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  // Results & Loading
  const [variations, setVariations] = useState<DesignVariation[]>([]);
  const [loading, setLoading] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    message: ''
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Script detection
  const fullText = `${headline} ${subText} ${callToAction}`;
  const isUrdu = /[\u0626\u0642\u0679\u0686\u0688\u0691\u0698\u06A9\u06AF\u06BA\u06BE\u06C1\u06D2]/.test(fullText);
  const isSindhi = /[\u067B\u067E\u0681\u0684\u068D\u068A\u068F\u0691\u06A6\u06AB\u06B1\u06B3\u06BB]/.test(fullText);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        setMode('redesign');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategorySelect = (cat: DesignCategory) => {
    setSelectedCategory(cat);
    setSelectedSub(cat.subCategories[0]);
    // find preset matching width
    const matchingPreset = CANVAS_PRESETS.find(p => p.width === cat.subCategories[0].defaultWidth && p.height === cat.subCategories[0].defaultHeight) || CANVAS_PRESETS[0];
    setSelectedPreset(matchingPreset);
  };

  const startGeneration = async () => {
    if (!headline.trim() && !referenceImage) {
      setErrorMessage("Please enter a headline or upload a reference image.");
      return;
    }

    setErrorMessage(null);
    setLoading({ isGenerating: true, progress: 15, message: LOADING_MESSAGES[0] });
    setVariations([]);

    let step = 0;
    const ticker = setInterval(() => {
      step = (step + 1) % LOADING_MESSAGES.length;
      setLoading(prev => ({
        ...prev,
        message: LOADING_MESSAGES[step],
        progress: Math.min(prev.progress + 15, 90)
      }));
    }, 1800);

    const userPrompt = [
      headline && `Headline: "${headline}"`,
      subText && `Subtitle: "${subText}"`,
      callToAction && `CTA: "${callToAction}"`,
      targetAudience && `Audience: ${targetAudience}`
    ].filter(Boolean).join('. ');

    try {
      const results = await generateDesignVariations(
        selectedCategory.name,
        selectedSub.name,
        userPrompt,
        mode,
        { primary: primaryColor, secondary: secondaryColor },
        referenceImage || undefined,
        (progressStep) => {
          setLoading(prev => ({ ...prev, progress: Math.max(prev.progress, (progressStep / 4) * 95) }));
        }
      );
      setVariations(results);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to generate designs. Please try again.");
    } finally {
      clearInterval(ticker);
      setLoading({ isGenerating: false, progress: 100, message: '' });
    }
  };

  // Converts a generated variation into rich editable layers for the Canvas Editor
  const sendVariationToEditor = (variant: DesignVariation) => {
    const width = selectedPreset.width;
    const height = selectedPreset.height;

    const layers: CanvasLayer[] = [
      // 1. Background layer
      {
        id: `bg_${Date.now()}`,
        name: 'Background Base',
        type: 'background',
        x: 0,
        y: 0,
        width,
        height,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: true,
        zIndex: 0,
        fillType: 'gradient',
        fillColor: primaryColor,
        gradientColor2: '#0b0f19',
        patternType: 'grid'
      } as BackgroundLayer,

      // 2. Decorative frame shape
      {
        id: `shape_frame_${Date.now()}`,
        name: 'Decorative Frame Accent',
        type: 'shape',
        shapeType: 'rectangle',
        x: 40,
        y: 40,
        width: width - 80,
        height: height - 80,
        rotation: 0,
        opacity: 0.35,
        visible: true,
        locked: false,
        zIndex: 1,
        fill: 'transparent',
        stroke: secondaryColor,
        strokeWidth: 2,
        borderRadius: 24
      } as ShapeLayer,

      // 3. Category Badge
      {
        id: `badge_cat_${Date.now()}`,
        name: 'Category Tag',
        type: 'text',
        x: Math.round(width * 0.1),
        y: 80,
        width: Math.round(width * 0.8),
        height: 50,
        rotation: 0,
        opacity: 0.9,
        visible: true,
        locked: false,
        zIndex: 2,
        text: `${selectedCategory.name.toUpperCase()} • ${selectedSub.name.toUpperCase()}`,
        fontSize: 18,
        fontFamily: "'Inter', sans-serif",
        color: secondaryColor,
        align: 'center',
        direction: 'ltr',
        bold: true,
        italic: false,
        lineHeight: 1.2,
        letterSpacing: 4
      } as TextLayer,

      // 4. Primary Headline Layer
      {
        id: `headline_${Date.now()}`,
        name: 'Primary Headline Text',
        type: 'text',
        x: Math.round(width * 0.08),
        y: Math.round(height * 0.35),
        width: Math.round(width * 0.84),
        height: 180,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: 3,
        text: headline || selectedSub.name,
        fontSize: Math.round(width * 0.055),
        fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : isSindhi ? "'Noto Sans Sindhi', serif" : "'Inter', sans-serif",
        color: '#ffffff',
        align: 'center',
        direction: isUrdu || isSindhi ? 'rtl' : 'ltr',
        bold: true,
        italic: false,
        lineHeight: 1.35,
        letterSpacing: isUrdu || isSindhi ? 0 : -0.5,
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowBlur: 14
      } as TextLayer,

      // 5. Sub-headline / Tagline Layer
      {
        id: `sub_${Date.now()}`,
        name: 'Sub-headline Tagline',
        type: 'text',
        x: Math.round(width * 0.1),
        y: Math.round(height * 0.6),
        width: Math.round(width * 0.8),
        height: 100,
        rotation: 0,
        opacity: 0.85,
        visible: true,
        locked: false,
        zIndex: 4,
        text: subText || variant.style,
        fontSize: Math.round(width * 0.028),
        fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : isSindhi ? "'Noto Sans Sindhi', serif" : "'Inter', sans-serif",
        color: '#cbd5e1',
        align: 'center',
        direction: isUrdu || isSindhi ? 'rtl' : 'ltr',
        bold: false,
        italic: false,
        lineHeight: 1.4,
        letterSpacing: 0
      } as TextLayer,

      // 6. Call to Action / Footer button
      {
        id: `cta_box_${Date.now()}`,
        name: 'CTA Button Background',
        type: 'shape',
        shapeType: 'rectangle',
        x: Math.round(width * 0.25),
        y: Math.round(height * 0.78),
        width: Math.round(width * 0.5),
        height: 64,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: 5,
        fill: secondaryColor,
        stroke: '#ffffff',
        strokeWidth: 1,
        borderRadius: 32
      } as ShapeLayer,

      {
        id: `cta_text_${Date.now()}`,
        name: 'Call to Action Text',
        type: 'text',
        x: Math.round(width * 0.25),
        y: Math.round(height * 0.795),
        width: Math.round(width * 0.5),
        height: 50,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: 6,
        text: callToAction || 'Special Offer • Limited Time',
        fontSize: 20,
        fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : isSindhi ? "'Noto Sans Sindhi', serif" : "'Inter', sans-serif",
        color: '#ffffff',
        align: 'center',
        direction: isUrdu || isSindhi ? 'rtl' : 'ltr',
        bold: true,
        italic: false,
        lineHeight: 1.2,
        letterSpacing: 1
      } as TextLayer
    ];

    onOpenInEditor(layers, width, height, headline || selectedSub.name, variant.imageUrl);
  };

  return (
    <div className="flex-1 bg-slate-50/60 p-6 sm:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200/60 uppercase tracking-wider">
                Multilingual AI Engine
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Supports English, اردو, and سنڌي
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.designBriefTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {t.designBriefSubtitle}
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setMode('create')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'create' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              New Concept
            </button>
            <button
              onClick={() => setMode('redesign')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'redesign' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Redesign Asset
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">Dismiss</button>
          </div>
        )}

        {/* Brief Form */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8">
          
          {/* Step 1: Category & Subcategory Selection */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              1. Choose Category & Workflow
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {DESIGN_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Subcategory Pills */}
            <div className="mt-3 flex flex-wrap gap-2 pt-2">
              {selectedCategory.subCategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSub(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedSub.id === sub.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Canvas Dimensions Preset */}
          <div className="pt-4 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              2. Canvas Dimensions & Aspect Ratio
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CANVAS_PRESETS.map((p) => {
                const isSel = selectedPreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPreset(p)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSel ? 'border-indigo-600 bg-indigo-50/30 font-bold' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs text-slate-900 block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{p.aspectRatio}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Multilingual Design Brief Text */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                3. Design Copy & Typography (Urdu, Sindhi, or English)
              </label>
              {(isUrdu || isSindhi) && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {isSindhi ? 'Sindhi Naskh Detected' : 'Urdu Nastaliq Detected'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{t.primaryHeadline} *</span>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  dir={isUrdu || isSindhi ? 'rtl' : 'ltr'}
                  placeholder="e.g. سالانہ گرینڈ فیسٹیول یا شاندار افتتاحی تقریب"
                  className="w-full text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-serif"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{t.subHeadlineText}</span>
                <input
                  type="text"
                  value={subText}
                  onChange={(e) => setSubText(e.target.value)}
                  dir={isUrdu || isSindhi ? 'rtl' : 'ltr'}
                  placeholder="e.g. جدید ثقافت اور روایات کا سنگم"
                  className="w-full text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-serif"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{t.callToAction}</span>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  dir={isUrdu || isSindhi ? 'rtl' : 'ltr'}
                  placeholder="e.g. فوری بکنگ کے لیے رابطہ کریں: 0300-1234567"
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-serif"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{t.targetAudience}</span>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Young professionals, families, university students"
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Brand Palette & Asset Reference */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Palette */}
            <div className="md:col-span-7 space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                4. Brand Palette & Colors
              </label>

              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(p.primary);
                      setSecondaryColor(p.secondary);
                    }}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition-all ${
                      primaryColor === p.primary && secondaryColor === p.secondary
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex w-6 h-6 rounded-lg overflow-hidden border border-slate-300 shadow-2xs">
                      <div className="w-1/2 h-full" style={{ backgroundColor: p.primary }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: p.secondary }} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">{p.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-600">{primaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-600">{secondaryColor}</span>
                </div>
              </div>
            </div>

            {/* Asset / Logo Upload */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                5. Brand Logo / Reference Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px] ${
                  referenceImage ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
                {referenceImage ? (
                  <div className="flex items-center gap-3">
                    <img src={referenceImage} alt="Ref" className="w-14 h-14 object-contain rounded-xl border border-slate-200 bg-white" />
                    <div className="text-left">
                      <span className="text-xs font-bold text-indigo-700 block">Asset Uploaded</span>
                      <span className="text-[10px] text-slate-400">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl mb-1">📤</span>
                    <span className="text-xs font-bold text-slate-700">{t.dragOrUploadImage}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or SVG Logo</span>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Generates 4 variations • {selectedPreset.width}×{selectedPreset.height} px
            </span>

            <button
              onClick={startGeneration}
              disabled={loading.isGenerating}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
            >
              {loading.isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{loading.message || 'Generating...'}</span>
                </>
              ) : (
                <>
                  <span>{t.generateConcepts}</span>
                  <span>✨</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Loading Progress State */}
        {loading.isGenerating && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl mx-auto animate-bounce">
              🖌️
            </div>
            <h3 className="text-lg font-bold text-slate-900">{loading.message}</h3>
            <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${loading.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 font-mono">{Math.round(loading.progress)}% Complete</p>
          </div>
        )}

        {/* Output Gallery */}
        {variations.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {t.outputGallery}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Four professional concepts synthesized. Click to open in Canvas Editor or export genuine deliverables.
                </p>
              </div>

              <button
                onClick={startGeneration}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                🔄 {t.regenerate}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {variations.map((v, idx) => (
                <div
                  key={v.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-square bg-slate-950 relative overflow-hidden">
                    <img
                      src={v.imageUrl}
                      alt={v.style}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] bg-slate-900/80 backdrop-blur-md text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Concept {idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {v.style}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">
                        {headline || selectedSub.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => sendVariationToEditor(v)}
                        className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-xs text-center"
                      >
                        🎨 {t.openInEditor}
                      </button>

                      <button
                        onClick={() => onDirectExport(v, selectedPreset.width, selectedPreset.height)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all text-center"
                      >
                        📥 Export PSD
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AIStudioGenerator;
