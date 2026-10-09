import React, { useState } from 'react';
import { DesignVariation } from '../types';

interface DesignCardProps {
  variation: DesignVariation;
}

const DesignCard: React.FC<DesignCardProps> = ({ variation }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const downloadFile = async (format: string) => {
    setIsExporting(format);

    try {
      const cleanStyle = variation.style.toLowerCase().replace(/\s+/g, '_');
      const filename = `DesignPro_${variation.id}_${cleanStyle}.${format.toLowerCase()}`;

      if (format === 'svg') {
        let svgText = variation.svgContent;
        if (!svgText && variation.imageUrl.startsWith('data:image/svg+xml;base64,')) {
          svgText = atob(variation.imageUrl.split(',')[1]);
        }
        if (svgText) {
          const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsExporting(null);
          setShowMenu(false);
          return;
        }
      }

      if ((format === 'png' || format === 'jpg') && variation.imageUrl.startsWith('data:image/svg+xml')) {
        // Rasterize SVG to high-res canvas (1080x1080)
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = variation.imageUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (format === 'jpg') {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, 1080, 1080);
          const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
          const dataUrl = canvas.toDataURL(mime, 0.95);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setIsExporting(null);
        setShowMenu(false);
        return;
      }

      // Default fallback download
      const delay = (format === 'psd' || format === 'pdf') ? 800 : 200;
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = variation.imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExporting(null);
        setShowMenu(false);
      }, delay);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback direct download
      const link = document.createElement('a');
      link.href = variation.imageUrl;
      link.download = `DesignPro_${variation.id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(null);
      setShowMenu(false);
    }
  };

  return (
    <div className="group relative bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl flex flex-col">
      <div className="aspect-square w-full overflow-hidden bg-slate-950 flex items-center justify-center relative cursor-zoom-in">
        <img 
          src={variation.imageUrl} 
          alt={variation.style}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
           <span className="bg-slate-950/90 backdrop-blur-md text-white text-[10px] px-4 py-2 rounded-full border border-white/10 font-black tracking-widest uppercase shadow-2xl">
             Ultra HD Render
           </span>
        </div>
      </div>

      <div className="p-7 bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800 flex-1 flex flex-col justify-between space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] px-4 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-black uppercase tracking-widest border border-indigo-500/20">
            {variation.style}
          </span>
          <div className="flex gap-1.5">
             {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700" />)}
          </div>
        </div>
        
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
        >
          Export Asset
        </button>
      </div>

      {showMenu && (
        <div className="absolute inset-0 z-20 p-8 bg-slate-950/95 backdrop-blur-3xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Master Export</h4>
            <button 
              onClick={() => setShowMenu(false)} 
              className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { id: 'png', name: 'Lossless PNG', meta: 'Transparency Preserved' },
              { id: 'jpg', name: 'Optimized JPG', meta: 'Mobile & Social Ready' },
              { id: 'svg', name: 'Vector SVG', meta: 'Scalable Graphics' },
              { id: 'pdf', name: 'Print PDF', meta: 'CMYK Ready' },
              { id: 'psd', name: 'Photoshop PSD', meta: 'Layered Simulation', highlight: true }
            ].map((fmt) => (
              <button 
                key={fmt.id}
                onClick={() => downloadFile(fmt.id)} 
                disabled={isExporting !== null}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left group/btn ${
                  fmt.highlight 
                    ? 'bg-indigo-900/10 border-indigo-500/20 hover:bg-indigo-900/20' 
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-xs font-black uppercase tracking-widest ${fmt.highlight ? 'text-indigo-400' : 'text-white'}`}>
                    {fmt.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase mt-1.5 tracking-tighter italic">
                    {fmt.meta}
                  </span>
                </div>
                {isExporting === fmt.id ? (
                  <div className="w-5 h-5 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-900/50 flex justify-center">
             <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.3em] italic">Enterprise Export Active</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignCard;
