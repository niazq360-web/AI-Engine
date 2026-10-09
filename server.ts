import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { detectScript, STYLE_VARIANTS, generateVectorGraphicDesign } from './utils/designGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini Client (Server-side)
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// POST /api/generate - Server-side Gemini & Graphic Generation Route
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { category, subCategory, userPrompt, mode, colors, referenceImage } = req.body;
    const script = detectScript(userPrompt || '');
    const results = [];

    const primaryColor = colors?.primary || '#1e293b';
    const secondaryColor = colors?.secondary || '#6366f1';

    for (let i = 0; i < STYLE_VARIANTS.length; i++) {
      const variant = STYLE_VARIANTS[i];
      let imageUrl = '';
      let generatedSvg = '';

      // 1. Try Gemini Generative Image model if configured
      if (ai) {
        try {
          const promptText = `
            Act as a world-class senior graphic designer.
            Category: ${category}. Subcategory: ${subCategory}.
            Style: ${variant.name}. ${variant.prompt}.
            User brief: "${userPrompt}".
            Color Palette: Primary ${primaryColor}, Secondary ${secondaryColor}.
            Detected Script: ${script}. Ensure culturally authentic and visually stunning layout.
            Technical specs: 1:1 Aspect ratio, high fidelity graphics, crisp composition.
          `;

          const contents: any = {
            parts: [{ text: promptText }]
          };

          if (referenceImage && mode === 'redesign') {
            const mimeType = referenceImage.split(';')[0]?.replace('data:', '') || 'image/png';
            const base64Data = referenceImage.split(',')[1];
            if (base64Data) {
              contents.parts.push({
                inlineData: {
                  data: base64Data,
                  mimeType
                }
              });
            }
          }

          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents,
            config: {
              imageConfig: {
                aspectRatio: '1:1'
              }
            }
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
        } catch (apiErr: any) {
          console.log(`Image generation notice for variant ${i + 1}: ${apiErr?.message || 'Using high-fidelity graphic synthesis'}`);
        }
      }

      // 2. High-fidelity vector graphic synthesis
      if (!imageUrl) {
        const vectorResult = generateVectorGraphicDesign({
          category: category || 'Poster Design',
          subCategory: subCategory || 'Flyer Poster',
          userPrompt: userPrompt || '',
          styleName: variant.name,
          styleIndex: i,
          primaryColor,
          secondaryColor,
          script
        });
        imageUrl = vectorResult.dataUrl;
        generatedSvg = vectorResult.svg;
      }

      results.push({
        id: `variant_${i + 1}_${Math.random().toString(36).substring(2, 9)}`,
        imageUrl,
        style: variant.name,
        prompt: userPrompt || `${category} ${subCategory}`,
        svgContent: generatedSvg || undefined
      });
    }

    res.json({ success: true, variations: results });
  } catch (error: any) {
    console.error('Generation server error:', error);
    res.status(500).json({ error: error.message || 'Graphic Engine Error' });
  }
});

// Mount Vite in dev or serve static in prod
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use('/AI-Engine', express.static(distPath));
  app.use(express.static(distPath));

  app.get(['/AI-Engine/*', '*'], (_req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Design Engine Pro running on http://0.0.0.0:${PORT}`);
});
