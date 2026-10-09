
import React from 'react';
import { DESIGN_CATEGORIES } from '../constants';
import { DesignCategory, CategoryID } from '../types';

interface SidebarProps {
  selectedCategory: DesignCategory;
  onSelectCategory: (cat: DesignCategory) => void;
  selectedSubId: string;
  onSelectSub: (id: string) => void;
  onNewDesign?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  selectedSubId, 
  onSelectSub,
  onNewDesign
}) => {
  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            DESIGN ENGINE PRO
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
            AI Graphic Suite
          </p>
        </div>
      </div>

      <div className="px-4 py-6 border-b border-slate-800">
        <button
          onClick={onNewDesign}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          New Design
        </button>
      </div>

      <div className="flex-1 p-4 space-y-8">
        <div>
          <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Main Categories</h3>
          <div className="space-y-1">
            {DESIGN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory.id === cat.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">
            {selectedCategory.name} Styles
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {selectedCategory.subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectSub(sub.id)}
                className={`w-full text-left px-4 py-2 rounded-md text-xs font-medium transition-all ${
                  selectedSubId === sub.id
                    ? 'bg-slate-800 border border-slate-700 text-indigo-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-600">v1.2.5 Built for Professionals</p>
      </div>
    </aside>
  );
};

export default Sidebar;
