import React from 'react';
import { CanvasLayer, TextLayer, ShapeLayer, BackgroundLayer, LanguageCode } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { FONT_OPTIONS } from '../constants/templates';

interface PropertiesPanelProps {
  selectedLayer: CanvasLayer | null;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  canvasWidth: number;
  canvasHeight: number;
  language: LanguageCode;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedLayer,
  onUpdateLayer,
  canvasWidth,
  canvasHeight,
  language
}) => {
  const t = TRANSLATIONS[language];

  if (!selectedLayer) {
    return (
      <div className="w-80 bg-white border-l border-slate-200/80 p-6 flex flex-col items-center justify-center text-center text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-3">
          👆
        </div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select a Layer</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
          Click any text, shape, or element on the canvas to inspect and edit properties.
        </p>
      </div>
    );
  }

  // Quick alignment helpers
  const alignLeft = () => onUpdateLayer(selectedLayer.id, { x: 0 });
  const alignCenter = () => onUpdateLayer(selectedLayer.id, { x: Math.round((canvasWidth - selectedLayer.width) / 2) });
  const alignRight = () => onUpdateLayer(selectedLayer.id, { x: canvasWidth - selectedLayer.width });
  const alignTop = () => onUpdateLayer(selectedLayer.id, { y: 0 });
  const alignMiddle = () => onUpdateLayer(selectedLayer.id, { y: Math.round((canvasHeight - selectedLayer.height) / 2) });
  const alignBottom = () => onUpdateLayer(selectedLayer.id, { y: canvasHeight - selectedLayer.height });

  return (
    <div className="w-80 bg-white border-l border-slate-200/80 flex flex-col h-full overflow-y-auto p-4 space-y-5 shadow-xs text-slate-900">
      
      {/* Layer Header & Rename */}
      <div className="pb-3 border-b border-slate-200/80">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          {t.properties}
        </label>
        <input
          type="text"
          value={selectedLayer.name}
          onChange={(e) => onUpdateLayer(selectedLayer.id, { name: e.target.value })}
          className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Quick Alignment Tool */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Canvas Alignment
        </span>
        <div className="grid grid-cols-6 gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button type="button" onClick={alignLeft} className="p-1.5 hover:bg-white rounded text-[11px] font-bold text-slate-700" title="Align Left">⇤</button>
          <button type="button" onClick={alignCenter} className="p-1.5 hover:bg-white rounded text-[11px] font-bold text-slate-700" title="Align Center">⇥⇤</button>
          <button type="button" onClick={alignRight} className="p-1.5 hover:bg-white rounded text-[11px] font-bold text-slate-700" title="Align Right">⇥</button>
          <button type="button" onClick={alignTop} className="p-1.5 hover:bg-white rounded text-[11px] font-bold text-slate-700" title="Align Top">⤒</button>
          <button type="button" onClick={alignMiddle} className="p-1.5 hover:bg-white rounded text-[11px] font-bold text-slate-700" title="Align Middle">⤓⤒</button>
          <button type="button" onClick={alignBottom} className="p-1.5 hover:bg-white rounded text-[11px] font-bold text-slate-700" title="Align Bottom">⤓</button>
        </div>
      </div>

      {/* TEXT SPECIFIC PROPERTIES */}
      {selectedLayer.type === 'text' && (() => {
        const textLayer = selectedLayer as TextLayer;
        const isUrduOrSindhi = /[\u0600-\u06FF]/.test(textLayer.text);

        return (
          <div className="space-y-4">
            {/* Text Editor Area */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Text Content
                </label>
                {isUrduOrSindhi && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    RTL Script
                  </span>
                )}
              </div>
              <textarea
                value={textLayer.text}
                dir={textLayer.direction}
                onChange={(e) => onUpdateLayer(textLayer.id, { text: e.target.value })}
                rows={3}
                className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-serif leading-relaxed"
              />
            </div>

            {/* Typography Font Selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t.fontFamily}
              </label>
              <select
                value={textLayer.fontFamily}
                onChange={(e) => onUpdateLayer(textLayer.id, { fontFamily: e.target.value })}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.name} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Direction */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {t.fontSize} ({textLayer.fontSize}px)
                </label>
                <input
                  type="range"
                  min="14"
                  max="160"
                  value={textLayer.fontSize}
                  onChange={(e) => onUpdateLayer(textLayer.id, { fontSize: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Text Direction
                </label>
                <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onUpdateLayer(textLayer.id, { direction: 'ltr', align: 'left' })}
                    className={`flex-1 py-1 rounded text-xs font-bold ${textLayer.direction === 'ltr' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
                  >
                    LTR
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateLayer(textLayer.id, { direction: 'rtl', align: 'right' })}
                    className={`flex-1 py-1 rounded text-xs font-bold ${textLayer.direction === 'rtl' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
                  >
                    RTL
                  </button>
                </div>
              </div>
            </div>

            {/* Alignment & Styles */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => onUpdateLayer(textLayer.id, { align: 'left' })}
                  className={`px-3 py-1 rounded text-xs font-bold ${textLayer.align === 'left' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLayer(textLayer.id, { align: 'center' })}
                  className={`px-3 py-1 rounded text-xs font-bold ${textLayer.align === 'center' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLayer(textLayer.id, { align: 'right' })}
                  className={`px-3 py-1 rounded text-xs font-bold ${textLayer.align === 'right' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
                >
                  Right
                </button>
              </div>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateLayer(textLayer.id, { bold: !textLayer.bold })}
                  className={`w-8 h-8 rounded-lg border font-bold text-xs ${textLayer.bold ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLayer(textLayer.id, { italic: !textLayer.italic })}
                  className={`w-8 h-8 rounded-lg border italic font-serif text-xs ${textLayer.italic ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                >
                  I
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Text Color
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="color"
                    value={textLayer.color}
                    onChange={(e) => onUpdateLayer(textLayer.id, { color: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-600">{textLayer.color}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Shadow Color
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="color"
                    value={textLayer.shadowColor || '#000000'}
                    onChange={(e) => onUpdateLayer(textLayer.id, { shadowColor: e.target.value, shadowBlur: textLayer.shadowBlur || 8 })}
                    className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-600">{textLayer.shadowColor || 'None'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SHAPE SPECIFIC PROPERTIES */}
      {selectedLayer.type === 'shape' && (() => {
        const shapeLayer = selectedLayer as ShapeLayer;
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Shape Type
              </label>
              <select
                value={shapeLayer.shapeType}
                onChange={(e) => onUpdateLayer(shapeLayer.id, { shapeType: e.target.value as any })}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
              >
                <option value="rectangle">Rectangle / Box</option>
                <option value="circle">Circle / Ellipse</option>
                <option value="line">Divider Line</option>
                <option value="badge">Badge / Ribbon</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Fill Color
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="color"
                    value={shapeLayer.fill}
                    onChange={(e) => onUpdateLayer(shapeLayer.id, { fill: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-600">{shapeLayer.fill}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Border Stroke
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="color"
                    value={shapeLayer.stroke || '#000000'}
                    onChange={(e) => onUpdateLayer(shapeLayer.id, { stroke: e.target.value, strokeWidth: shapeLayer.strokeWidth || 2 })}
                    className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-600">{shapeLayer.stroke || 'None'}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Border Radius ({shapeLayer.borderRadius || 0}px)
              </label>
              <input
                type="range"
                min="0"
                max="60"
                value={shapeLayer.borderRadius || 0}
                onChange={(e) => onUpdateLayer(shapeLayer.id, { borderRadius: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        );
      })()}

      {/* BACKGROUND SPECIFIC PROPERTIES */}
      {selectedLayer.type === 'background' && (() => {
        const bgLayer = selectedLayer as BackgroundLayer;
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Fill Style
              </label>
              <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => onUpdateLayer(bgLayer.id, { fillType: 'solid' })}
                  className={`flex-1 py-1 rounded text-xs font-bold ${bgLayer.fillType === 'solid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
                >
                  Solid Color
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLayer(bgLayer.id, { fillType: 'gradient', gradientColor2: bgLayer.gradientColor2 || '#1e293b' })}
                  className={`flex-1 py-1 rounded text-xs font-bold ${bgLayer.fillType === 'gradient' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
                >
                  Gradient
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="color"
                    value={bgLayer.fillColor}
                    onChange={(e) => onUpdateLayer(bgLayer.id, { fillColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-600">{bgLayer.fillColor}</span>
                </div>
              </div>

              {bgLayer.fillType === 'gradient' && (
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Gradient End
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <input
                      type="color"
                      value={bgLayer.gradientColor2 || '#0f172a'}
                      onChange={(e) => onUpdateLayer(bgLayer.id, { gradientColor2: e.target.value })}
                      className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-[11px] font-mono text-slate-600">{bgLayer.gradientColor2}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Subtle Pattern
              </label>
              <select
                value={bgLayer.patternType || 'none'}
                onChange={(e) => onUpdateLayer(bgLayer.id, { patternType: e.target.value as any })}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
              >
                <option value="none">None (Clean Solid)</option>
                <option value="grid">Studio Grid</option>
                <option value="dots">Modern Dot Matrix</option>
              </select>
            </div>
          </div>
        );
      })()}

      {/* GENERAL GEOMETRY & OPACITY */}
      <div className="pt-3 border-t border-slate-200/80 space-y-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Geometry & Opacity
        </span>

        <div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
            <span>Opacity</span>
            <span>{Math.round(selectedLayer.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={selectedLayer.opacity}
            onChange={(e) => onUpdateLayer(selectedLayer.id, { opacity: Number(e.target.value) })}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-medium">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">X Position</span>
            <input
              type="number"
              value={selectedLayer.x}
              onChange={(e) => onUpdateLayer(selectedLayer.id, { x: Number(e.target.value) })}
              className="w-full bg-transparent font-bold outline-none"
            />
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Y Position</span>
            <input
              type="number"
              value={selectedLayer.y}
              onChange={(e) => onUpdateLayer(selectedLayer.id, { y: Number(e.target.value) })}
              className="w-full bg-transparent font-bold outline-none"
            />
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Width</span>
            <input
              type="number"
              value={selectedLayer.width}
              onChange={(e) => onUpdateLayer(selectedLayer.id, { width: Math.max(10, Number(e.target.value)) })}
              className="w-full bg-transparent font-bold outline-none"
            />
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Height</span>
            <input
              type="number"
              value={selectedLayer.height}
              onChange={(e) => onUpdateLayer(selectedLayer.id, { height: Math.max(10, Number(e.target.value)) })}
              className="w-full bg-transparent font-bold outline-none"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default PropertiesPanel;
