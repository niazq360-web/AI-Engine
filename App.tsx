import React, { useState, useEffect } from 'react';
import {
  LanguageCode,
  CanvasLayer,
  DesignProject,
  TextLayer,
  ShapeLayer,
  BackgroundLayer,
  DesignVariation
} from './types';
import Navbar from './components/Navbar';
import AIStudioGenerator from './components/AIStudioGenerator';
import CanvasEditor from './components/CanvasEditor';
import LayersPanel from './components/LayersPanel';
import PropertiesPanel from './components/PropertiesPanel';
import ProjectManager from './components/ProjectManager';
import ExportModal from './components/ExportModal';

const DEFAULT_WIDTH = 1080;
const DEFAULT_HEIGHT = 1080;

const createInitialLayers = (width: number, height: number): CanvasLayer[] => [
  {
    id: 'layer_bg',
    name: 'Background Gradient',
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
    fillColor: '#1e1b4b',
    gradientColor2: '#0f172a',
    patternType: 'grid'
  } as BackgroundLayer,
  {
    id: 'layer_frame',
    name: 'Golden Frame Border',
    type: 'shape',
    shapeType: 'rectangle',
    x: 50,
    y: 50,
    width: width - 100,
    height: height - 100,
    rotation: 0,
    opacity: 0.4,
    visible: true,
    locked: false,
    zIndex: 1,
    fill: 'transparent',
    stroke: '#d97706',
    strokeWidth: 2,
    borderRadius: 24
  } as ShapeLayer,
  {
    id: 'layer_tag',
    name: 'Studio Tag',
    type: 'text',
    x: Math.round(width * 0.1),
    y: 110,
    width: Math.round(width * 0.8),
    height: 50,
    rotation: 0,
    opacity: 0.9,
    visible: true,
    locked: false,
    zIndex: 2,
    text: 'AI-ENGINE PROFESSIONAL GRAPHIC SUITE',
    fontSize: 16,
    fontFamily: "'Inter', sans-serif",
    color: '#fbbf24',
    align: 'center',
    direction: 'ltr',
    bold: true,
    italic: false,
    lineHeight: 1.2,
    letterSpacing: 4
  } as TextLayer,
  {
    id: 'layer_headline_ur',
    name: 'Urdu Master Title',
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
    text: 'شاندار گرافک ڈیزائن اور نستعلیق خطاطی',
    fontSize: 54,
    fontFamily: "'Noto Nastaliq Urdu', serif",
    color: '#ffffff',
    align: 'center',
    direction: 'rtl',
    bold: true,
    italic: false,
    lineHeight: 1.4,
    letterSpacing: 0,
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowBlur: 16
  } as TextLayer,
  {
    id: 'layer_sub_sd',
    name: 'Sindhi Cultural Subtitle',
    type: 'text',
    x: Math.round(width * 0.1),
    y: Math.round(height * 0.58),
    width: Math.round(width * 0.8),
    height: 100,
    rotation: 0,
    opacity: 0.85,
    visible: true,
    locked: false,
    zIndex: 4,
    text: 'سنڌي ثقافت، شاعري ۽ پريميئم ڪوالٽي ڊزائن',
    fontSize: 32,
    fontFamily: "'Noto Sans Sindhi', serif",
    color: '#cbd5e1',
    align: 'center',
    direction: 'rtl',
    bold: false,
    italic: false,
    lineHeight: 1.4,
    letterSpacing: 0
  } as TextLayer,
  {
    id: 'layer_cta_box',
    name: 'Badge CTA Button',
    type: 'shape',
    shapeType: 'rectangle',
    x: Math.round(width * 0.28),
    y: Math.round(height * 0.78),
    width: Math.round(width * 0.44),
    height: 60,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 5,
    fill: '#4f46e5',
    stroke: '#fbbf24',
    strokeWidth: 1.5,
    borderRadius: 30
  } as ShapeLayer,
  {
    id: 'layer_cta_text',
    name: 'CTA Action Text',
    type: 'text',
    x: Math.round(width * 0.28),
    y: Math.round(height * 0.795),
    width: Math.round(width * 0.44),
    height: 40,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 6,
    text: 'DOWNLOAD EDITABLE PSD',
    fontSize: 16,
    fontFamily: "'Inter', sans-serif",
    color: '#ffffff',
    align: 'center',
    direction: 'ltr',
    bold: true,
    italic: false,
    lineHeight: 1.2,
    letterSpacing: 2
  } as TextLayer
];

const LOCAL_STORAGE_KEY = 'ai_engine_projects_v2';

const App: React.FC = () => {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'create' | 'editor' | 'projects'>('create');

  // Canvas & Project State
  const [canvasWidth, setCanvasWidth] = useState<number>(DEFAULT_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState<number>(DEFAULT_HEIGHT);
  const [layers, setLayers] = useState<CanvasLayer[]>(() => createInitialLayers(DEFAULT_WIDTH, DEFAULT_HEIGHT));
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('layer_headline_ur');
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Undo / Redo stacks
  const [history, setHistory] = useState<CanvasLayer[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasLayer[][]>([]);

  // Projects list
  const [projects, setProjects] = useState<DesignProject[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  const [currentProject, setCurrentProject] = useState<DesignProject>({
    id: 'proj_default',
    title: 'Multilingual Master Showcase',
    clientName: 'Studio Pro Client',
    brief: 'Urdu and Sindhi typography showcase with genuine Photoshop PSD layers.',
    category: 'posters',
    subCategory: 'Conference & Event Poster',
    language: 'en',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    layers: createInitialLayers(DEFAULT_WIDTH, DEFAULT_HEIGHT),
    revisions: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn(e);
    }
  }, [projects]);

  // Push to history before updating layers
  const updateLayersWithHistory = (newLayers: CanvasLayer[]) => {
    setHistory((prev) => [...prev.slice(-25), layers]);
    setRedoStack([]);
    setLayers(newLayers);
    setIsSaved(false);
  };

  const handleUpdateLayer = (id: string, updates: Partial<CanvasLayer>) => {
    updateLayersWithHistory(
      layers.map((l) => (l.id === id ? ({ ...l, ...updates } as CanvasLayer) : l))
    );
  };

  const handleAddLayer = (newLayer: CanvasLayer) => {
    updateLayersWithHistory([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleReorderLayer = (id: string, direction: 'up' | 'down') => {
    const layer = layers.find((l) => l.id === id);
    if (!layer || layer.type === 'background') return;

    const movable = layers.filter((l) => l.type !== 'background').sort((a, b) => a.zIndex - b.zIndex);
    const idx = movable.findIndex((l) => l.id === id);

    if (direction === 'up' && idx < movable.length - 1) {
      const target = movable[idx + 1];
      const tempZ = layer.zIndex;
      updateLayersWithHistory(
        layers.map((l) => {
          if (l.id === layer.id) return { ...l, zIndex: target.zIndex };
          if (l.id === target.id) return { ...l, zIndex: tempZ };
          return l;
        })
      );
    } else if (direction === 'down' && idx > 0) {
      const target = movable[idx - 1];
      const tempZ = layer.zIndex;
      updateLayersWithHistory(
        layers.map((l) => {
          if (l.id === layer.id) return { ...l, zIndex: target.zIndex };
          if (l.id === target.id) return { ...l, zIndex: tempZ };
          return l;
        })
      );
    }
  };

  const handleDuplicateLayer = (id: string) => {
    const target = layers.find((l) => l.id === id);
    if (!target || target.type === 'background') return;

    const nextZ = Math.max(1, ...layers.map((l) => l.zIndex)) + 1;
    const duplicated: CanvasLayer = {
      ...target,
      id: `${target.type}_${Date.now()}`,
      name: `${target.name} (Copy)`,
      x: target.x + 30,
      y: target.y + 30,
      zIndex: nextZ
    };

    updateLayersWithHistory([...layers, duplicated]);
    setSelectedLayerId(duplicated.id);
  };

  const handleDeleteLayer = (id: string) => {
    const target = layers.find((l) => l.id === id);
    if (!target || target.type === 'background') return;

    updateLayersWithHistory(layers.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, layers]);
    setHistory((prev) => prev.slice(0, -1));
    setLayers(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, layers]);
    setRedoStack((prev) => prev.slice(0, -1));
    setLayers(next);
  };

  // Open an AI variation into the canvas editor
  const handleOpenVariationInEditor = (
    newLayers: CanvasLayer[],
    width: number,
    height: number,
    title: string,
    previewUrl?: string
  ) => {
    setCanvasWidth(width);
    setCanvasHeight(height);
    setLayers(newLayers);
    setHistory([]);
    setRedoStack([]);
    setSelectedLayerId(newLayers[3]?.id || newLayers[0]?.id || null);

    const updatedProj: DesignProject = {
      ...currentProject,
      id: `proj_${Date.now()}`,
      title,
      width,
      height,
      layers: newLayers,
      previewUrl,
      updatedAt: Date.now()
    };
    setCurrentProject(updatedProj);
    setActiveTab('editor');
    setIsSaved(false);
  };

  // Direct export from variation card
  const handleDirectExport = (variation: DesignVariation, width: number, height: number) => {
    setCanvasWidth(width);
    setCanvasHeight(height);
    if (variation.layers) {
      setLayers(variation.layers);
    }
    setIsExportOpen(true);
  };

  // Save current project
  const handleSaveProject = () => {
    const updatedProj: DesignProject = {
      ...currentProject,
      layers,
      width: canvasWidth,
      height: canvasHeight,
      updatedAt: Date.now()
    };

    setCurrentProject(updatedProj);
    setProjects((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === updatedProj.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedProj;
        return copy;
      }
      return [updatedProj, ...prev];
    });
    setIsSaved(true);
  };

  // Switch to project
  const handleSelectProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    setCurrentProject(target);
    setCanvasWidth(target.width || DEFAULT_WIDTH);
    setCanvasHeight(target.height || DEFAULT_HEIGHT);
    setLayers(target.layers);
    setSelectedLayerId(target.layers[0]?.id || null);
    setHistory([]);
    setRedoStack([]);
    setActiveTab('editor');
    setIsSaved(true);
  };

  const handleNewProject = () => {
    const initial = createInitialLayers(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    const newProj: DesignProject = {
      id: `proj_${Date.now()}`,
      title: 'Untitled Project',
      category: 'posters',
      subCategory: 'Event Poster',
      language,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      layers: initial,
      revisions: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setCanvasWidth(DEFAULT_WIDTH);
    setCanvasHeight(DEFAULT_HEIGHT);
    setLayers(initial);
    setSelectedLayerId('layer_headline_ur');
    setHistory([]);
    setRedoStack([]);
    setCurrentProject(newProj);
    setActiveTab('create');
    setIsSaved(true);
  };

  const handleDuplicateProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    const copy: DesignProject = {
      ...target,
      id: `proj_${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setProjects((prev) => [copy, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/20 overflow-hidden">
      
      {/* Top Studio Navbar */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        projectTitle={currentProject.title}
        onOpenExport={() => setIsExportOpen(true)}
        onSaveProject={handleSaveProject}
        isSaved={isSaved}
      />

      {/* Main Studio Views */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Tab 1: AI Creation Studio */}
        {activeTab === 'create' && (
          <AIStudioGenerator
            language={language}
            onOpenInEditor={handleOpenVariationInEditor}
            onDirectExport={handleDirectExport}
          />
        )}

        {/* Tab 2: Canvas Layer Editor */}
        {activeTab === 'editor' && (
          <div className="flex-1 flex overflow-hidden">
            <CanvasEditor
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateLayer={handleUpdateLayer}
              onAddLayer={handleAddLayer}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={history.length > 0}
              canRedo={redoStack.length > 0}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              language={language}
            />

            {/* Properties Inspector */}
            <PropertiesPanel
              selectedLayer={selectedLayer}
              onUpdateLayer={handleUpdateLayer}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              language={language}
            />

            {/* Layers Panel */}
            <LayersPanel
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateLayer={handleUpdateLayer}
              onReorderLayer={handleReorderLayer}
              onDuplicateLayer={handleDuplicateLayer}
              onDeleteLayer={handleDeleteLayer}
              language={language}
            />
          </div>
        )}

        {/* Tab 3: Saved Projects & Client Delivery */}
        {activeTab === 'projects' && (
          <ProjectManager
            projects={projects}
            currentProjectId={currentProject.id}
            onSelectProject={handleSelectProject}
            onNewProject={handleNewProject}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onOpenExportForProject={(proj) => {
              setCurrentProject(proj);
              setLayers(proj.layers);
              setCanvasWidth(proj.width);
              setCanvasHeight(proj.height);
              setIsExportOpen(true);
            }}
            language={language}
          />
        )}

      </div>

      {/* Master Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={currentProject}
        layers={layers}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        language={language}
      />

    </div>
  );
};

export default App;
