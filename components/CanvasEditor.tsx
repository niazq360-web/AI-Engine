import React, { useState, useRef, useEffect } from 'react';
import { CanvasLayer, TextLayer, ShapeLayer, ImageLayer, BackgroundLayer, LanguageCode } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface CanvasEditorProps {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onAddLayer: (newLayer: CanvasLayer) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canvasWidth: number;
  canvasHeight: number;
  language: LanguageCode;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onAddLayer,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  canvasWidth,
  canvasHeight,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [zoom, setZoom] = useState<number>(0.55);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; layerX: number; layerY: number } | null>(null);

  // Sort layers for rendering by zIndex ascending
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  // Auto-fit zoom on mount or dimension change
  useEffect(() => {
    if (canvasContainerRef.current) {
      const containerW = canvasContainerRef.current.clientWidth - 100;
      const containerH = canvasContainerRef.current.clientHeight - 100;
      const fitZoom = Math.min(containerW / canvasWidth, containerH / canvasHeight, 0.85);
      setZoom(Math.max(0.25, Math.min(1.2, fitZoom)));
    }
  }, [canvasWidth, canvasHeight]);

  // Drag handling
  const handleLayerMouseDown = (e: React.MouseEvent, layer: CanvasLayer) => {
    e.stopPropagation();
    if (layer.locked) return;

    onSelectLayer(layer.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      layerX: layer.x,
      layerY: layer.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !selectedLayerId || !selectedLayer) return;

    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;

    onUpdateLayer(selectedLayerId, {
      x: Math.round(dragStart.layerX + dx),
      y: Math.round(dragStart.layerY + dy)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Keyboard shortcuts (Delete, Undo, Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          if (canRedo) onRedo();
        } else {
          if (canUndo) onUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        if (canRedo) onRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, onUndo, onRedo]);

  // Quick Add Helpers
  const addTextPreset = (scriptType: 'urdu' | 'sindhi' | 'english') => {
    const nextZ = Math.max(1, ...layers.map((l) => l.zIndex)) + 1;
    let newText = 'New Heading';
    let fontFamily = "'Inter', sans-serif";
    let direction: 'ltr' | 'rtl' = 'ltr';
    let align: 'left' | 'center' | 'right' = 'center';

    if (scriptType === 'urdu') {
      newText = 'شاندار اردو خطاطی کا عنوان';
      fontFamily = "'Noto Nastaliq Urdu', serif";
      direction = 'rtl';
    } else if (scriptType === 'sindhi') {
      newText = 'سنڌي ڪلچر ۽ خوبصورت عنوان';
      fontFamily = "'Noto Sans Sindhi', serif";
      direction = 'rtl';
    }

    const newLayer: TextLayer = {
      id: `text_${Date.now()}`,
      name: `${scriptType.toUpperCase()} Text`,
      type: 'text',
      x: Math.round(canvasWidth * 0.15),
      y: Math.round(canvasHeight * 0.4),
      width: Math.round(canvasWidth * 0.7),
      height: 120,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: nextZ,
      text: newText,
      fontSize: 48,
      fontFamily,
      color: '#ffffff',
      align,
      direction,
      bold: true,
      italic: false,
      lineHeight: 1.3,
      letterSpacing: 0,
      shadowColor: 'rgba(0,0,0,0.4)',
      shadowBlur: 10
    };

    onAddLayer(newLayer);
  };

  const addShapePreset = (shapeType: 'rectangle' | 'circle' | 'badge' | 'line') => {
    const nextZ = Math.max(1, ...layers.map((l) => l.zIndex)) + 1;
    const newLayer: ShapeLayer = {
      id: `shape_${Date.now()}`,
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Shape`,
      type: 'shape',
      shapeType,
      x: Math.round(canvasWidth * 0.25),
      y: Math.round(canvasHeight * 0.35),
      width: shapeType === 'line' ? Math.round(canvasWidth * 0.6) : 320,
      height: shapeType === 'line' ? 8 : 220,
      rotation: 0,
      opacity: 0.9,
      visible: true,
      locked: false,
      zIndex: nextZ,
      fill: shapeType === 'line' ? '#6366f1' : '#1e1b4b',
      stroke: '#d97706',
      strokeWidth: shapeType === 'line' ? 0 : 2,
      borderRadius: shapeType === 'rectangle' ? 16 : 0
    };

    onAddLayer(newLayer);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const nextZ = Math.max(1, ...layers.map((l) => l.zIndex)) + 1;

      const newLayer: ImageLayer = {
        id: `img_${Date.now()}`,
        name: 'Uploaded Graphic Asset',
        type: 'image',
        x: Math.round(canvasWidth * 0.25),
        y: Math.round(canvasHeight * 0.25),
        width: Math.round(canvasWidth * 0.5),
        height: Math.round(canvasHeight * 0.5),
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: nextZ,
        src,
        objectFit: 'contain'
      };

      onAddLayer(newLayer);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="flex-1 flex flex-col h-full bg-slate-100/70 select-none overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Studio Toolbar Header */}
      <div className="h-12 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between shadow-2xs z-10">
        
        {/* Quick Add Assets */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => addTextPreset('urdu')}
              className="px-2.5 py-1 rounded text-xs font-bold text-slate-700 hover:bg-white hover:text-indigo-600 transition-all font-serif"
              title="Add Nastaliq Urdu Text"
            >
              + اردو متن
            </button>
            <button
              onClick={() => addTextPreset('sindhi')}
              className="px-2.5 py-1 rounded text-xs font-bold text-slate-700 hover:bg-white hover:text-indigo-600 transition-all font-serif"
              title="Add Sindhi Text"
            >
              + سنڌي اکر
            </button>
            <button
              onClick={() => addTextPreset('english')}
              className="px-2.5 py-1 rounded text-xs font-bold text-slate-700 hover:bg-white hover:text-indigo-600 transition-all"
              title="Add English Heading"
            >
              + Heading
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => addShapePreset('rectangle')}
              className="px-2 py-1 rounded text-xs font-medium text-slate-700 hover:bg-white transition-all"
              title="Add Rectangle"
            >
              ▢ Box
            </button>
            <button
              onClick={() => addShapePreset('circle')}
              className="px-2 py-1 rounded text-xs font-medium text-slate-700 hover:bg-white transition-all"
              title="Add Circle"
            >
              ◯ Circle
            </button>
            <button
              onClick={() => addShapePreset('line')}
              className="px-2 py-1 rounded text-xs font-medium text-slate-700 hover:bg-white transition-all"
              title="Add Divider Line"
            >
              ― Line
            </button>
          </div>

          <label className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-2xs">
            <span>🖼️</span>
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Undo/Redo & Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
              title={t.undo}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
              title={t.redo}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold bg-white px-2 py-1 rounded-lg border border-slate-200">
            <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))} className="px-1.5 hover:text-indigo-600">-</button>
            <span className="w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))} className="px-1.5 hover:text-indigo-600">+</button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            {canvasWidth} × {canvasHeight} px
          </span>
        </div>

      </div>

      {/* Main Canvas Work Area */}
      <div
        ref={canvasContainerRef}
        onClick={() => onSelectLayer(null)}
        className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"
      >
        {/* Render Canvas */}
        <div
          style={{
            width: `${canvasWidth * zoom}px`,
            height: `${canvasHeight * zoom}px`,
            transformOrigin: 'center center'
          }}
          className="relative bg-white shadow-2xl rounded-sm transition-all overflow-hidden border border-slate-300"
        >
          <div
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left'
            }}
            className="absolute inset-0"
          >
            {sortedLayers.map((layer) => {
              if (!layer.visible) return null;
              const isSelected = layer.id === selectedLayerId;

              // Render text layer
              if (layer.type === 'text') {
                const tLayer = layer as TextLayer;
                return (
                  <div
                    key={layer.id}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                    style={{
                      position: 'absolute',
                      left: `${tLayer.x}px`,
                      top: `${tLayer.y}px`,
                      width: `${tLayer.width}px`,
                      height: `${tLayer.height}px`,
                      opacity: tLayer.opacity,
                      transform: tLayer.rotation ? `rotate(${tLayer.rotation}deg)` : undefined,
                      cursor: tLayer.locked ? 'default' : 'move'
                    }}
                    className={`group ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:outline-1 hover:outline-dashed hover:outline-indigo-400'}`}
                  >
                    <div
                      style={{
                        fontFamily: tLayer.fontFamily,
                        fontSize: `${tLayer.fontSize}px`,
                        fontWeight: tLayer.bold ? 'bold' : 'normal',
                        fontStyle: tLayer.italic ? 'italic' : 'normal',
                        color: tLayer.color,
                        textAlign: tLayer.align,
                        direction: tLayer.direction,
                        lineHeight: tLayer.lineHeight || 1.3,
                        textShadow: tLayer.shadowColor ? `0 4px ${tLayer.shadowBlur || 8}px ${tLayer.shadowColor}` : undefined
                      }}
                      className="w-full h-full whitespace-pre-wrap select-none leading-relaxed"
                    >
                      {tLayer.text}
                    </div>

                    {/* Selection Handles */}
                    {isSelected && (
                      <>
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                      </>
                    )}
                  </div>
                );
              }

              // Render shape layer
              if (layer.type === 'shape') {
                const sLayer = layer as ShapeLayer;
                return (
                  <div
                    key={layer.id}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                    style={{
                      position: 'absolute',
                      left: `${sLayer.x}px`,
                      top: `${sLayer.y}px`,
                      width: `${sLayer.width}px`,
                      height: `${sLayer.height}px`,
                      opacity: sLayer.opacity,
                      transform: sLayer.rotation ? `rotate(${sLayer.rotation}deg)` : undefined,
                      cursor: sLayer.locked ? 'default' : 'move'
                    }}
                    className={`group ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:outline-1 hover:outline-dashed hover:outline-indigo-400'}`}
                  >
                    {sLayer.shapeType === 'circle' ? (
                      <div
                        style={{
                          backgroundColor: sLayer.fill,
                          borderColor: sLayer.stroke,
                          borderWidth: `${sLayer.strokeWidth}px`
                        }}
                        className="w-full h-full rounded-full"
                      />
                    ) : sLayer.shapeType === 'line' ? (
                      <div
                        style={{
                          backgroundColor: sLayer.fill || sLayer.stroke,
                          height: `${sLayer.height}px`
                        }}
                        className="w-full rounded-full"
                      />
                    ) : (
                      <div
                        style={{
                          backgroundColor: sLayer.fill,
                          borderColor: sLayer.stroke,
                          borderWidth: `${sLayer.strokeWidth}px`,
                          borderRadius: `${sLayer.borderRadius || 0}px`
                        }}
                        className="w-full h-full"
                      />
                    )}

                    {isSelected && (
                      <>
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                      </>
                    )}
                  </div>
                );
              }

              // Render image layer
              if (layer.type === 'image') {
                const imgLayer = layer as ImageLayer;
                return (
                  <div
                    key={layer.id}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                    style={{
                      position: 'absolute',
                      left: `${imgLayer.x}px`,
                      top: `${imgLayer.y}px`,
                      width: `${imgLayer.width}px`,
                      height: `${imgLayer.height}px`,
                      opacity: imgLayer.opacity,
                      transform: imgLayer.rotation ? `rotate(${imgLayer.rotation}deg)` : undefined,
                      cursor: imgLayer.locked ? 'default' : 'move'
                    }}
                    className={`group ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:outline-1 hover:outline-dashed hover:outline-indigo-400'}`}
                  >
                    <img
                      src={imgLayer.src}
                      alt={imgLayer.name}
                      style={{ objectFit: imgLayer.objectFit }}
                      className="w-full h-full pointer-events-none"
                    />
                    {isSelected && (
                      <>
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-sm" />
                      </>
                    )}
                  </div>
                );
              }

              // Render background layer
              if (layer.type === 'background') {
                const bgLayer = layer as BackgroundLayer;
                const bgStyle: React.CSSProperties = {
                  position: 'absolute',
                  inset: 0,
                  opacity: bgLayer.opacity
                };

                if (bgLayer.fillType === 'gradient' && bgLayer.gradientColor2) {
                  bgStyle.background = `linear-gradient(${bgLayer.gradientAngle || 135}deg, ${bgLayer.fillColor}, ${bgLayer.gradientColor2})`;
                } else {
                  bgStyle.backgroundColor = bgLayer.fillColor;
                }

                return (
                  <div
                    key={layer.id}
                    onMouseDown={() => onSelectLayer(layer.id)}
                    style={bgStyle}
                    className="w-full h-full"
                  >
                    {bgLayer.patternType === 'grid' && (
                      <div className="w-full h-full opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
                    )}
                    {bgLayer.patternType === 'dots' && (
                      <div className="w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CanvasEditor;
