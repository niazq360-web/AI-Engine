
export type CategoryID = 'posters' | 'logos' | 'thumbnails' | 'social' | 'banners' | 'invitations' | 'cards';
export type DesignMode = 'create' | 'redesign';

export interface SubCategory {
  id: string;
  name: string;
}

export interface DesignCategory {
  id: CategoryID;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface DesignVariation {
  id: string;
  imageUrl: string;
  style: string;
  prompt: string;
  svgContent?: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  message: string;
}
