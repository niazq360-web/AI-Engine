import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { DESIGN_CATEGORIES, LOADING_MESSAGES } from './constants';
import { DesignCategory, DesignVariation, GenerationState, DesignMode } from './types';
import Sidebar from './components/Sidebar';
import DesignCard from './components/DesignCard';
import { generateDesignVariations } from './services/geminiService';

const COLOR_PRESETS = [
  { name: 'Midnight', primary: '#1e293b', secondary: '#6366f1' },
  { name: 'Royal', primary: '#1e1b4b', secondary: '#d4af37' },
  { name: 'Forest', primary: '#064e3b', secondary: '#10b981' },
  { name: 'Sunset', primary: '#7c2d12', secondary: '#fb923c' },
  { name: 'Cyber', primary: '#000000', secondary: '#39ff14' },
  { name: 'Minimal', primary: '#ffffff', secondary: '#111827' },
];

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DesignCategory>(DESIGN_CATEGORIES[0]);
  const [selectedSubId, setSelectedSubId] = useState<string>(DESIGN_CATEGORIES[0].subCategories[0].id);
  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<DesignMode>('create');
  const [primaryColor, setPrimaryColor] = useState(COLOR_PRESETS[0].primary);
  const [secondaryColor, setSecondaryColor] = useState(COLOR_PRESETS[0].secondary);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [variations, setVariations] = useState<DesignVariation[]>([]);
  const [detectedLang, setDetectedLang] = useState<'English' | 'Urdu' | 'Sindhi' | 'Other RTL'>('English');
  const [isZipping, setIsZipping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    message: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sindhiPattern = /[\u067B\u067E\u0681\u0684\u068D\u068A\u068F\u0691\u06A6\u06AB\u06B1\u06B3\u06BB]/;
    const urduPattern = /[\u0626\u0642\u0679\u0686\u0688\u0691\u0698\u06A9\u06AF\u06BA\u06BE\u06C1\u06D2]/;
    const generalRtlPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

    if (sindhiPattern.test(prompt)) {
      setDetectedLang('Sindhi');
    } else if (urduPattern.test(prompt)) {
      setDetectedLang('Urdu');
    } else if (generalRtlPattern.test(prompt)) {
      setDetectedLang('Other RTL');
    } else {
      setDetectedLang('English');
    }
  }, [prompt]);

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const resetWorkspace = () => {
    setVariations([]);
    setPrompt('');
    setReferenceImage(null);
    setMode('create');
    setPrimaryColor(COLOR_PRESETS[0].primary);
    setSecondaryColor(COLOR_PRESETS[0].secondary);
    setErrorMessage(null);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const goBackToEditor = () => {
    setVariations([]);
    setLoading({ isGenerating: false, progress: 0, message: '' });
    setErrorMessage(null);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSub = selectedCategory.subCategories.find(s => s.id === selectedSubId)?.name || '';

  const startGeneration = async () => {
    if (!prompt.trim() && !referenceImage) {
      setErrorMessage("Please describe your design concept or upload a reference image.");
      return;
    }

    setErrorMessage(null);
    setLoading({ isGenerating: true, progress: 10, message: LOADING_MESSAGES[0] });
    setVariations([]);

    let step = 0;
    const msgTicker = setInterval(() => {
      step = (step + 1) % LOADING_MESSAGES.length;
      setLoading(prev => ({
        ...prev,
        message: LOADING_MESSAGES[step],
        progress: Math.min(prev.progress + 15, 90)
      }));
    }, 1800);

    try {
      const results = await generateDesignVariations(
        selectedCategory.name,
        currentSub,
        prompt,
        mode,
        { primary: primaryColor, secondary: secondaryColor },
        referenceImage || undefined,
        (stepIndex) => {
          setLoading(prev => ({ ...prev, progress: Math.max(prev.progress, (stepIndex / 4) * 95) }));
        }
      );
      setVariations(results);
    } catch (error: any) {
      console.error("Generation failed:", error);
      setErrorMessage(error.message || "Graphic engine encountered an issue. Please try again.");
    } finally {
      clearInterval(msgTicker);
      setLoading({ isGenerating: false, progress: 100, message: '' });
    }
  };

  const exportAllToZip = async () => {
    if (variations.length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();
    const bundle = zip.folder("design_pro_export");

    try {
      variations.forEach((v, idx) => {
        const cleanStyle = v.style.replace(/\s+/g, '_').toLowerCase();
        if (v.imageUrl.startsWith('data:image/svg+xml;base64,')) {
          const rawSvg = atob(v.imageUrl.split(',')[1]);
          bundle?.file(`variant_${idx + 1}_${cleanStyle}.svg`, rawSvg);
        } else if (v.svgContent) {
          bundle?.file(`variant_${idx + 1}_${cleanStyle}.svg`, v.svgContent);
        } else if (v.imageUrl.startsWith('data:image/png;base64,')) {
          const rawPng = v.imageUrl.split(',')[1];
          bundle?.file(`variant_${idx + 1}_${cleanStyle}.png`, rawPng, { base64: true });
        } else {
          bundle?.file(`variant_${idx + 1}_${cleanStyle}.txt`, `Design Prompt:\n${v.prompt}`);
        }
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AI_Design_Bundle_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failure:", e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .loading-shimmer {
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
        .design-matrix {
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>
      <div ref={topRef} className="absolute top-0 w-px h-px invisible" />
      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedSubId(cat.subCategories[0].id);
          setVariations([]);
          setErrorMessage(null);
        }}
        selectedSubId={selectedSubId}
        onSelectSub={(id) => {
          setSelectedSubId(id);
          setVariations([]);
          setErrorMessage(null);
        }}
        onNewDesign={resetWorkspace}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative scroll-smooth">
        <header className="px-10 pt-10 pb-6 flex justify-between items-end border-b border-slate-900/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {variations.length > 0 && (
              <button 
                onClick={goBackToEditor}
                className="w-12 h-12 flex items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl group"
                title="Back to Prompt"
              >
                <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black tracking-widest uppercase">Engine v2.5</span>
                 <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                  {mode === 'create' ? 'Create' : 'Redesign'} <span className="text-indigo-500">{currentSub}</span>
                </h2>
              </div>
              <p className="text-slate-500 text-sm font-medium">Multilingual Pro Designer • Native Script Support • High Fidelity Output</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <button 
              onClick={resetWorkspace}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>
            <div className="w-14 h-14 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-2xl relative">🎨</div>
          </div>
        </header>

        {errorMessage && (
          <div className="mx-10 mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 text-sm font-medium">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white text-xs font-bold uppercase tracking-widest">
              Dismiss
            </button>
          </div>
        )}

        {loading.isGenerating ? (
          <div className="flex-1 relative flex flex-col items-center justify-center p-10 overflow-hidden bg-slate-950">
            <div className="absolute inset-0 design-matrix opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent animate-pulse pointer-events-none" />
            <div className="absolute inset-x-0 h-1 bg-indigo-500/20 blur-sm top-0 animate-[scanline_3s_infinite_linear] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl space-y-12">
              <div className="relative group">
                <div className="w-56 h-56 rounded-full border-[1px] border-indigo-500/30 absolute inset-0 animate-ping opacity-20" />
                <div className="w-56 h-56 rounded-full border-[4px] border-slate-900 relative">
                  <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-[spin_2s_linear_infinite]" />
                  <div className="absolute inset-4 rounded-full border-b-4 border-fuchsia-500 animate-[spin_1.5s_linear_infinite_reverse] opacity-60" />
                  <div className="absolute inset-8 rounded-full border-r-4 border-emerald-400 animate-[spin_3s_linear_infinite] opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-indigo-500/20 animate-pulse" />
                      <span className="text-4xl relative z-10 animate-bounce">🖌️</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xl shadow-xl animate-bounce delay-100">✨</div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xl shadow-xl animate-bounce delay-300">📐</div>
              </div>

              <div className="text-center space-y-8 w-full">
                <div className="space-y-3">
                  <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic animate-pulse">
                    {loading.message}
                  </h3>
                  <p className="text-xs text-slate-500 font-black tracking-[0.5em] uppercase">
                    Script Optimization: {detectedLang === 'English' ? 'Global Multi-Lang' : `${detectedLang} Native Processing`}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative w-full h-4 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-indigo-600 rounded-full transition-all duration-700 ease-out loading-shimmer shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                      style={{ width: `${loading.progress}%` }} 
                    />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-indigo-400 tracking-widest">THROUGHPUT: {(loading.progress * 12.5).toFixed(0)} MB/S</span>
                    <span className="text-[10px] font-black text-white tracking-[0.2em]">{Math.round(loading.progress)}% COMPLETE</span>
                    <span className="text-[10px] font-black text-fuchsia-400 tracking-widest">LATENCY: 42MS</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 rounded-2xl p-4 text-left font-mono text-[9px] text-slate-400 h-28 overflow-hidden space-y-1 opacity-80 border-t-2 border-t-indigo-500/50">
                   <div className="flex gap-3"><span className="text-emerald-500 font-bold">[SYSTEM]</span> {detectedLang === 'Sindhi' ? 'سندھی اسکرپٹ ایکٹیویٹڈ' : detectedLang === 'Urdu' ? 'اردو فونٹ انجن فعال کر دیا گیا ہے' : 'Initializing creative neural buffers...'}</div>
                   <div className={`flex gap-3 transition-opacity duration-500 ${loading.progress > 20 ? 'opacity-100' : 'opacity-0'}`}><span className="text-indigo-500 font-bold">[ENGINE]</span> Applying color theory: {primaryColor} & {secondaryColor}</div>
                   <div className={`flex gap-3 transition-opacity duration-500 ${loading.progress > 40 ? 'opacity-100' : 'opacity-0'}`}><span className="text-fuchsia-500 font-bold">[RENDER]</span> Synthesizing typography hierarchy for {currentSub}</div>
                   <div className={`flex gap-3 transition-opacity duration-500 ${loading.progress > 60 ? 'opacity-100' : 'opacity-0'}`}><span className="text-indigo-500 font-bold">[LAYOUT]</span> Balancing geometric anchors and whitespace...</div>
                   <div className={`flex gap-3 transition-opacity duration-500 ${loading.progress > 80 ? 'opacity-100' : 'opacity-0'}`}><span className="text-emerald-500 font-bold">[EXPORT]</span> Finalizing high-fidelity 4K rasterization...</div>
                </div>

                <button 
                  onClick={goBackToEditor}
                  className="px-8 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 hover:text-red-400 hover:border-red-400/30 transition-all uppercase tracking-widest active:scale-95"
                >
                  Abort Operation
                </button>
              </div>
            </div>
          </div>
        ) : variations.length > 0 ? (
          <section className="px-10 py-12 flex-1 animate-in slide-in-from-bottom-5 duration-700">
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-10 gap-6">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase italic">Output Gallery</h3>
                  <p className="text-xs text-slate-500 mt-2 uppercase tracking-[0.3em] font-black italic">Four Professional Variations Generated</p>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                   <button 
                     onClick={goBackToEditor}
                     className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-8 py-4 rounded-2xl border border-slate-800 transition-all text-xs font-black uppercase tracking-[0.2em]"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                     Modify Settings
                   </button>
                   <button 
                     onClick={resetWorkspace}
                     className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 active:scale-95"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                     Start New
                   </button>
                   <button onClick={exportAllToZip} disabled={isZipping} className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 active:scale-95 disabled:opacity-50">
                     {isZipping ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                     {isZipping ? 'Archiving...' : 'Export All (.ZIP)'}
                   </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {variations.map((v) => (
                  <DesignCard key={v.id} variation={v} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="px-10 py-8 flex-1 flex flex-col">
            <div className="bg-slate-900/40 rounded-[3rem] border border-slate-800/60 p-10 backdrop-blur-2xl shadow-2xl space-y-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50 w-fit">
                  <button onClick={() => setMode('create')} className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${mode === 'create' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>NEW DESIGN</button>
                  <button onClick={() => setMode('redesign')} className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${mode === 'redesign' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>REDESIGN</button>
                </div>
                <button onClick={resetWorkspace} className="text-[10px] font-black text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors">Reset Canvas</button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Color Theme Selection</label>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-black uppercase tracking-widest">Master Palette</span>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex gap-2 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setPrimaryColor(preset.primary);
                          setSecondaryColor(preset.secondary);
                        }}
                        className={`w-10 h-10 rounded-xl relative group transition-all overflow-hidden border-2 ${
                          primaryColor === preset.primary && secondaryColor === preset.secondary ? 'border-indigo-500 scale-110 shadow-lg shadow-indigo-500/20' : 'border-transparent'
                        }`}
                        title={preset.name}
                      >
                        <div className="absolute inset-0 flex">
                          <div className="w-1/2 h-full" style={{ backgroundColor: preset.primary }} />
                          <div className="w-1/2 h-full" style={{ backgroundColor: preset.secondary }} />
                        </div>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                      </button>
                    ))}
                  </div>
                  
                  <div className="h-10 w-px bg-slate-800 mx-2 hidden sm:block" />

                  <div className="flex gap-6 items-center bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute inset-[-4px] w-[150%] h-[150%] cursor-pointer bg-transparent"
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700">
                        <input 
                          type="color" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="absolute inset-[-4px] w-[150%] h-[150%] cursor-pointer bg-transparent"
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secondary</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Design Specification</label>
                    <div className="flex gap-2">
                      {detectedLang === 'Urdu' && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-black uppercase tracking-widest animate-pulse">Urdu Script Engine</span>}
                      {detectedLang === 'Sindhi' && <span className="text-[10px] bg-fuchsia-500/10 text-fuchsia-400 px-3 py-1 rounded-full border border-fuchsia-500/20 font-black uppercase tracking-widest animate-pulse">Sindhi Script Engine</span>}
                      {detectedLang === 'Other RTL' && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-black uppercase tracking-widest animate-pulse">RTL Script Detected</span>}
                    </div>
                  </div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    dir={detectedLang !== 'English' ? 'rtl' : 'ltr'}
                    placeholder={mode === 'create' ? "Describe your professional design concept..." : "List the specific changes you'd like to apply..."}
                    className={`flex-1 min-h-[250px] w-full bg-slate-950/50 border border-slate-800 rounded-[2rem] p-8 text-2xl focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none outline-none shadow-inner leading-relaxed ${detectedLang !== 'English' ? 'font-serif' : 'font-medium'}`}
                  />
                </div>

                <div className="lg:col-span-4 flex flex-col space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-1">Asset Reference</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${referenceImage ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-600 bg-slate-950/30'}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileUpload} />
                    {referenceImage ? (
                      <>
                        <img src={referenceImage} alt="Reference" className="w-full h-full object-contain p-4 rounded-[2rem]" />
                        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                          <span className="text-white text-xs font-black uppercase tracking-widest text-center px-2">Replace Reference</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 mx-auto group-hover:border-indigo-500 transition-all">
                          <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        <span className="text-xs text-slate-500 font-black uppercase tracking-widest">Source Image</span>
                        <p className="text-[9px] text-slate-700 mt-2 uppercase font-bold tracking-tighter">Support: PSD, JPG, PNG</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-6 border-t border-slate-800/50">
                <div className="flex gap-4">
                  {['PSD', 'SVG', 'PDF', 'ZIP'].map(tag => (
                     <span key={tag} className="text-[10px] bg-indigo-500/10 px-4 py-2 rounded-xl text-indigo-400 font-black border border-indigo-500/20 tracking-widest">{tag} EXPORT</span>
                  ))}
                </div>
                <button
                  onClick={startGeneration}
                  disabled={loading.isGenerating}
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white px-16 py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-indigo-600/30"
                >
                  <span>Begin High-Fidelity Render</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            </div>
          </section>
        )}

        <footer className="px-10 py-12 text-slate-600 text-[10px] flex flex-col md:flex-row justify-between items-center bg-slate-950/80 border-t border-slate-900/30 backdrop-blur-3xl gap-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="flex flex-col gap-1">
                <p className="font-black tracking-[0.3em] uppercase text-slate-500">AI DESIGN ENGINE PRO v2.5</p>
                <p className="text-[9px] font-bold text-slate-700 tracking-tighter">LICENSED FOR PROFESSIONAL COMMERCIAL USE</p>
             </div>
             <div className="h-8 w-px bg-slate-900 hidden md:block" />
             <div className="flex gap-6">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="font-black text-slate-500 uppercase tracking-widest">RENDER ENGINE: STABLE</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="font-black text-slate-500 uppercase tracking-widest">GPU FEED: NATIVE</span></div>
             </div>
          </div>
          <div className="flex gap-10 uppercase font-black tracking-[0.2em] text-slate-700">
            <span className="hover:text-indigo-500 cursor-pointer transition-colors">Compliance</span>
            <span className="hover:text-indigo-500 cursor-pointer transition-colors">Developer API</span>
            <span className="hover:text-indigo-500 cursor-pointer transition-colors">Enterprise Support</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
