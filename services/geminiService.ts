import { DesignVariation, DesignMode } from '../types';

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

  if (onProgress) onProgress(2);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with ${response.status}`);
  }

  if (onProgress) onProgress(3);

  const data = await response.json();
  if (onProgress) onProgress(4);

  return data.variations || [];
}
