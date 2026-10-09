import { DesignVariation, DesignMode } from '../types';
import { detectScript, STYLE_VARIANTS, generateVectorGraphicDesign } from '../utils/designGenerator';

export async function generateDesignVariations(
  category: string,
  subCategory: string,
  userPrompt: string,
  mode: DesignMode,
  colors: { primary: string; secondary: string },
  referenceImage?: string,
  onProgress?: (index: number) => void
): Promise<DesignVariation[]> {
  if (onProgress) onProgress(1);

  // Attempt server-side API first (used when hosted in fullstack environment)
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category,
        subCategory,
        userPrompt,
        mode,
        colors,
        referenceImage,
      }),
    });

    if (response.ok) {
      if (onProgress) onProgress(2);
      const data = await response.json();
      if (onProgress) onProgress(4);
      if (data.variations && data.variations.length > 0) {
        return data.variations;
      }
    }
  } catch (err) {
    // When hosted on GitHub Pages or other static hosting, server is unavailable.
    console.info('Operating in static mode (e.g. GitHub Pages); using client-side vector synthesis engine.', err);
  }

  // Client-side synthesis fallback (enables 100% functionality on static GitHub Pages)
  if (onProgress) onProgress(2);
  const script = detectScript(userPrompt || '');
  const variations: DesignVariation[] = [];

  for (let i = 0; i < STYLE_VARIANTS.length; i++) {
    const variant = STYLE_VARIANTS[i];
    const { svg, dataUrl } = generateVectorGraphicDesign({
      category: category || 'Poster Design',
      subCategory: subCategory || 'Flyer Poster',
      userPrompt: userPrompt || '',
      styleName: variant.name,
      styleIndex: i,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      script,
    });

    variations.push({
      id: `gh_${i + 1}_${Math.random().toString(36).substring(2, 9)}`,
      imageUrl: dataUrl,
      style: variant.name,
      prompt: userPrompt || `${category} ${subCategory}`,
      svgContent: svg,
    });

    if (onProgress) onProgress(i + 1);
  }

  return variations;
}
