export type LanguageCode = 'en' | 'ur' | 'sd';

export type CategoryID = 
  | 'social' 
  | 'thumbnails' 
  | 'ads' 
  | 'posters' 
  | 'cards' 
  | 'logos' 
  | 'menus' 
  | 'certificates' 
  | 'books' 
  | 'banners' 
  | 'mockups';

export type DesignMode = 'create' | 'redesign';

export interface SubCategory {
  id: string;
  name: string;
  nameUr?: string;
  nameSd?: string;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface DesignCategory {
  id: CategoryID;
  name: string;
  nameUr: string;
  nameSd: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface CanvasDimensions {
  id: string;
  name: string;
  nameUr: string;
  nameSd: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export type LayerType = 'text' | 'shape' | 'image' | 'background';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right';
  direction: 'ltr' | 'rtl';
  bold: boolean;
  italic: boolean;
  lineHeight: number;
  letterSpacing: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'star' | 'badge' | 'line';
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius?: number;
  shadowColor?: string;
  shadowBlur?: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  objectFit: 'contain' | 'cover' | 'fill';
  borderRadius?: number;
  filterBrightness?: number;
  filterContrast?: number;
  filterBlur?: number;
}

export interface BackgroundLayer extends BaseLayer {
  type: 'background';
  fillType: 'solid' | 'gradient';
  fillColor: string;
  gradientColor2?: string;
  gradientAngle?: number;
  patternType?: 'none' | 'dots' | 'grid' | 'islamic' | 'ajrak';
}

export type CanvasLayer = TextLayer | ShapeLayer | ImageLayer | BackgroundLayer;

export interface DesignVariation {
  id: string;
  imageUrl: string;
  style: string;
  prompt: string;
  svgContent?: string;
  layers?: CanvasLayer[];
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  message: string;
}

export interface ProjectRevision {
  id: string;
  timestamp: number;
  description: string;
  layers: CanvasLayer[];
  previewUrl: string;
}

export interface DesignProject {
  id: string;
  title: string;
  clientName?: string;
  brief?: string;
  category: CategoryID;
  subCategory: string;
  language: LanguageCode;
  width: number;
  height: number;
  layers: CanvasLayer[];
  revisions: ProjectRevision[];
  createdAt: number;
  updatedAt: number;
  approvedRevisionId?: string;
  previewUrl?: string;
}

export type ExportFormat = 'psd' | 'png' | 'jpg' | 'webp' | 'svg' | 'pdf' | 'zip' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  scale: number; // 1x, 2x, 4x
  quality: number; // 0.8 - 1.0
  includeBleed: boolean;
  bleedMm: number;
  rasterizeTextInPsd: boolean;
  flattenForWeb: boolean;
}
