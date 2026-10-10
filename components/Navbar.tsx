import React from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface NavbarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeTab: 'create' | 'editor' | 'projects';
  onTabChange: (tab: 'create' | 'editor' | 'projects') => void;
  projectTitle: string;
  onOpenExport: () => void;
  onSaveProject: () => void;
  isSaved?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  projectTitle,
  onOpenExport,
  onSaveProject,
  isSaved = true
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <span className="text-xl font-black">AI</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 font-sans">
                AI-Engine
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200/60 uppercase tracking-wider">
                Studio Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
              {projectTitle}
            </p>
          </div>
        </div>

        {/* Studio View Navigation Tabs */}
        <nav className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => onTabChange('create')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>✨</span>
            <span>{t.tabCreate}</span>
          </button>

          <button
            onClick={() => onTabChange('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎨</span>
            <span>{t.tabEditor}</span>
          </button>

          <button
            onClick={() => onTabChange('projects')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📂</span>
            <span>{t.tabProjects}</span>
          </button>
        </nav>

        {/* Actions & Language Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Explicit Language Selector */}
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-0.5">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                currentLanguage === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('ur')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                currentLanguage === 'ur'
                  ? 'bg-white text-indigo-700 shadow-xs font-serif'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="اردو"
            >
              اردو
            </button>
            <button
              onClick={() => onLanguageChange('sd')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                currentLanguage === 'sd'
                  ? 'bg-white text-indigo-700 shadow-xs font-serif'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="سنڌي"
            >
              سنڌي
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={onSaveProject}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95"
            title={t.saveProject}
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Master Export Deliverables */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{t.exportDeliverable}</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
