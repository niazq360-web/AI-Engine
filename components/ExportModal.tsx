import React, { useState } from 'react';
import { CanvasLayer, DesignProject, ExportFormat, LanguageCode } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { generateGenuinePsd, PsdValidationResult } from '../utils/psdExport';
import { generatePrintPdf } from '../utils/pdfExport';
import { generateVectorSvg } from '../utils/svgExport';
import { createClientDeliveryPackage } from '../utils/zipDelivery';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: DesignProject;
  layers: CanvasLayer[];
  canvasWidth: number;
  canvasHeight: number;
  language: LanguageCode;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  layers,
  canvasWidth,
  canvasHeight,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('psd');
  const [scale, setScale] = useState<number>(1);
  const [includeBleed, setIncludeBleed] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [psdValidation, setPsdValidation] = useState<PsdValidationResult | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportNotice(null);

    const safeTitle = (project.title || 'AI_Engine_Design').replace(/\s+/g, '_');
    const width = Math.round(canvasWidth * scale);
    const height = Math.round(canvasHeight * scale);

    try {
      if (selectedFormat === 'psd') {
        // Genuine Layered PSD
        const { blob, validation } = await generateGenuinePsd(layers, width, height, project.title);
        setPsdValidation(validation);

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeTitle}_Layered_Master.psd`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportNotice(`PSD Generated! ${validation.layerCount} Photoshop layers verified with 8BPS signature.`);
      } else if (selectedFormat === 'png' || selectedFormat === 'jpg' || selectedFormat === 'webp') {
        // Raster export
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);
          for (const layer of sorted) {
            if (!layer.visible) continue;
            if (layer.type === 'background') {
              const bg = layer as any;
              ctx.fillStyle = bg.fillColor || (selectedFormat === 'jpg' ? '#ffffff' : 'transparent');
              ctx.fillRect(0, 0, width, height);
            } else if (layer.type === 'shape') {
              const s = layer as any;
              ctx.save();
              ctx.globalAlpha = s.opacity;
              ctx.fillStyle = s.fill;
              ctx.fillRect(s.x * scale, s.y * scale, s.width * scale, s.height * scale);
              ctx.restore();
            } else if (layer.type === 'text') {
              const textL = layer as any;
              ctx.save();
              ctx.globalAlpha = textL.opacity;
              ctx.font = `${textL.bold ? 'bold ' : ''}${Math.round(textL.fontSize * scale)}px ${textL.fontFamily}`;
              ctx.fillStyle = textL.color;
              ctx.direction = textL.direction || 'ltr';
              ctx.textAlign = textL.align || 'left';
              ctx.fillText(textL.text, textL.x * scale, (textL.y + textL.fontSize) * scale);
              ctx.restore();
            }
          }
        }

        const mime = selectedFormat === 'jpg' ? 'image/jpeg' : selectedFormat === 'webp' ? 'image/webp' : 'image/png';
        const dataUrl = canvas.toDataURL(mime, 0.95);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${safeTitle}.${selectedFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setExportNotice(`${selectedFormat.toUpperCase()} exported at ${width}×${height}px.`);
      } else if (selectedFormat === 'svg') {
        const svgContent = generateVectorSvg(layers, canvasWidth, canvasHeight);
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeTitle}_Vector.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportNotice("Scalable Vector SVG exported.");
      } else if (selectedFormat === 'pdf') {
        const pdfBlob = await generatePrintPdf(layers, width, height, project.title, includeBleed);
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeTitle}_Print.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportNotice("Print-Ready PDF generated.");
      } else if (selectedFormat === 'zip') {
        const { blob, filename } = await createClientDeliveryPackage(project, layers, width, height);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportNotice("Full Client Delivery ZIP bundle exported with PSD, PNG, SVG, PDF, and Manifest.");
      } else if (selectedFormat === 'json') {
        const jsonStr = JSON.stringify(project, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeTitle}.aidesign`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportNotice("Project source backup exported.");
      }
    } catch (err: any) {
      console.error('Export error:', err);
      setExportNotice(`Export failed: ${err.message || 'Error occurred'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/80 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {t.masterExport} • Deliverables Suite
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Target canvas: {canvasWidth * scale} × {canvasHeight * scale} px ({scale}x scale)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Format Selection Grid */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Select Output Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Genuine PSD Option */}
              <div
                onClick={() => setSelectedFormat('psd')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedFormat === 'psd'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-indigo-700 tracking-wide uppercase">
                    Photoshop PSD
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                    Genuine Layers
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Real Adobe Photoshop document (.psd) with independent layers, alpha channels, and 8BPS signature.
                </p>
              </div>

              {/* Lossless PNG */}
              <div
                onClick={() => setSelectedFormat('png')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedFormat === 'png'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
                    Lossless PNG
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    Alpha Channel
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Transparent high-definition raster graphics suitable for web, apps, and print.
                </p>
              </div>

              {/* Scalable Vector SVG */}
              <div
                onClick={() => setSelectedFormat('svg')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedFormat === 'svg'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
                    Vector SVG
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    Scalable XML
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Pure vector format preserving crisp typography, geometric shapes, and layout bounds.
                </p>
              </div>

              {/* Print-Ready PDF */}
              <div
                onClick={() => setSelectedFormat('pdf')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedFormat === 'pdf'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
                    Print PDF
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    CMYK Print
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  High-DPI commercial print layout with optional 3mm bleed margins.
                </p>
              </div>

              {/* Full Client Delivery Package (ZIP) */}
              <div
                onClick={() => setSelectedFormat('zip')}
                className={`sm:col-span-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedFormat === 'zip'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-emerald-800 tracking-wide uppercase flex items-center gap-1.5">
                    <span>📦</span>
                    <span>Complete Client Delivery Package (ZIP)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    Agency Standard
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Includes Master PSD, Ultra-HD PNG, Vector SVG, Print PDF, Project JSON, and delivery manifest with font licenses.
                </p>
              </div>

            </div>
          </div>

          {/* Scale & Options */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Resolution Scaling
              </label>
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScale(s)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      scale === s ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {s}× ({s === 1 ? 'Standard' : s === 2 ? 'Retina' : 'Ultra 4K'})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Print Margins
              </label>
              <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={includeBleed}
                  onChange={(e) => setIncludeBleed(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Include 3mm Bleed Cut Box</span>
              </label>
            </div>
          </div>

          {/* PSD Disclosures / Verification Notice */}
          {selectedFormat === 'psd' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Photoshop PSD Compliance & Disclosure:</span>
              </span>
              <p className="text-amber-800 leading-relaxed">
                The output is an authentic 8BPS Photoshop file. Text layers are rendered as crisp, anti-aliased image layers to preserve exact Noto Nastaliq & Sindhi Naskh ligatures on any computer opening the PSD, without requiring the recipient to manually install regional fonts.
              </p>
            </div>
          )}

          {/* Notice Feedback */}
          {exportNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
              <span>✅</span>
              <span>{exportNotice}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {layers.length} Layers • {canvasWidth * scale}×{canvasHeight * scale}px
          </span>

          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Download {selectedFormat.toUpperCase()}</span>
                  <span>↓</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExportModal;
