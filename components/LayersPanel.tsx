import React from 'react';
import { CanvasLayer, LanguageCode } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface LayersPanelProps {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  language: LanguageCode;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onReorderLayer,
  onDuplicateLayer,
  onDeleteLayer,
  language
}) => {
  const t = TRANSLATIONS[language];
  // Display layers from highest zIndex (top) to lowest (bottom)
  const displayLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="w-72 bg-white border-l border-slate-200/80 flex flex-col h-full shadow-xs">
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {t.layers} ({layers.length})
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {displayLayers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          const isBackground = layer.type === 'background';

          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`group flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-transparent text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-400 text-sm">
                  {layer.type === 'text' && '🔤'}
                  {layer.type === 'shape' && '🔷'}
                  {layer.type === 'image' && '🖼️'}
                  {layer.type === 'background' && '🎨'}
                </span>
                <span className="truncate font-semibold text-[11px]">
                  {layer.name}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { visible: !layer.visible });
                  }}
                  className={`p-1 rounded hover:bg-slate-200/60 ${layer.visible ? 'text-slate-500' : 'text-slate-300'}`}
                  title={layer.visible ? t.hideLayer : t.showLayer}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {layer.visible ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    )}
                  </svg>
                </button>

                {/* Lock Toggle */}
                {!isBackground && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateLayer(layer.id, { locked: !layer.locked });
                    }}
                    className={`p-1 rounded hover:bg-slate-200/60 ${layer.locked ? 'text-amber-600' : 'text-slate-400'}`}
                    title={layer.locked ? t.unlockLayer : t.lockLayer}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {layer.locked ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      )}
                    </svg>
                  </button>
                )}

                {/* Reorder Up/Down */}
                {!isBackground && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderLayer(layer.id, 'up');
                      }}
                      className="p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
                      title={t.bringForward}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderLayer(layer.id, 'down');
                      }}
                      className="p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
                      title={t.sendBackward}
                    >
                      ▼
                    </button>
                  </>
                )}

                {/* Duplicate */}
                {!isBackground && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateLayer(layer.id);
                    }}
                    className="p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
                    title={t.duplicateLayer}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}

                {/* Delete */}
                {!isBackground && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                    className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                    title={t.deleteLayer}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LayersPanel;
