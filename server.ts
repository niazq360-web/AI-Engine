import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

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

function detectScript(text: string): 'Urdu' | 'Sindhi' | 'Generic Arabic' | 'English' {
  const sindhiPattern = /[\u067B\u067E\u0681\u0684\u068D\u068A\u068F\u0691\u06A6\u06AB\u06B1\u06B3\u06BB]/;
  const urduPattern = /[\u0626\u0642\u0679\u0686\u0688\u0691\u0698\u06A9\u06AF\u06BA\u06BE\u06C1\u06D2]/;
  const generalRtlPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

  if (sindhiPattern.test(text)) return 'Sindhi';
  if (urduPattern.test(text)) return 'Urdu';
  if (generalRtlPattern.test(text)) return 'Generic Arabic';
  return 'English';
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Generates an intricate, professional SVG graphic design when raster image generation is not available or as vector asset
function generateVectorGraphicDesign(params: {
  category: string;
  subCategory: string;
  userPrompt: string;
  styleName: string;
  styleIndex: number;
  primaryColor: string;
  secondaryColor: string;
  script: 'Urdu' | 'Sindhi' | 'Generic Arabic' | 'English';
}): { svg: string; dataUrl: string } {
  const { category, subCategory, userPrompt, styleName, styleIndex, primaryColor, secondaryColor, script } = params;

  const width = 1080;
  const height = 1080;
  const promptSummary = userPrompt.trim() ? userPrompt.trim().slice(0, 80) : `${subCategory} Graphic`;
  const cleanTitle = escapeXml(promptSummary);
  const cleanSub = escapeXml(subCategory);
  const cleanCategory = escapeXml(category);

  // Script-specific greeting/tagline
  let scriptBadge = 'STUDIO PRO EDITION';
  let scriptAccent = 'SPECIAL EDITION';
  let fontFamilies = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

  if (script === 'Urdu') {
    scriptBadge = 'اردو ڈیزائن اسٹوڈیو • پریمیم معیار';
    scriptAccent = 'مستند اور دیدہ زیب خطاطی';
    fontFamilies = `'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Jameel Noori Nastaleeq', 'Inter', serif`;
  } else if (script === 'Sindhi') {
    scriptBadge = 'سنڌي ڊزائن اسٽوڊيو • پريميئم ڪوالٽي';
    scriptAccent = 'ثقافتي خوبصورتي ۽ نفاست';
    fontFamilies = `'Noto Sans Sindhi', 'MB Sindhi', 'PakType Tehreer', 'Inter', serif`;
  } else if (script === 'Generic Arabic') {
    scriptBadge = 'استوديو التصميم الاحترافي • جودة فائقة';
    scriptAccent = 'تصميم عربي أصيل وراقي';
    fontFamilies = `'Amiri', 'Traditional Arabic', 'Scheherazade', 'Inter', serif`;
  }

  // Distinct layouts per style
  let innerElements = '';
  const isRtl = script !== 'English';
  const textAnchor = isRtl ? 'end' : 'start';
  const titleX = isRtl ? width - 120 : 120;

  if (styleIndex === 0) {
    // Style 1: Modern Minimalist
    innerElements = `
      <defs>
        <linearGradient id="grad0_${styleIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#090d16" stop-opacity="1" />
        </linearGradient>
        <pattern id="grid_${styleIndex}" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="#ffffff" fill-opacity="0.08" />
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad0_${styleIndex})" />
      <rect width="${width}" height="${height}" fill="url(#grid_${styleIndex})" />
      
      <!-- Minimalist geometric framing -->
      <rect x="80" y="80" width="${width - 160}" height="${height - 160}" fill="none" stroke="${secondaryColor}" stroke-opacity="0.3" stroke-width="2" rx="32" />
      <rect x="100" y="100" width="${width - 200}" height="${height - 200}" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1" rx="24" />

      <!-- Top Badge -->
      <g transform="translate(${isRtl ? width - 360 : 120}, 140)">
        <rect width="240" height="42" rx="21" fill="${secondaryColor}" fill-opacity="0.15" stroke="${secondaryColor}" stroke-width="1.5" />
        <text x="120" y="26" text-anchor="middle" fill="${secondaryColor}" font-family="${fontFamilies}" font-size="14" font-weight="800" letter-spacing="3">${escapeXml(scriptBadge)}</text>
      </g>

      <!-- Central Hero Artwork -->
      <g transform="translate(${width / 2}, 480)">
        <circle r="180" fill="${secondaryColor}" fill-opacity="0.06" />
        <circle r="130" fill="none" stroke="${secondaryColor}" stroke-width="2" stroke-dasharray="8 6" />
        <circle r="90" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="4" />
        <polygon points="0,-60 52,30 -52,30" fill="none" stroke="${secondaryColor}" stroke-width="3" />
        <circle cx="0" cy="0" r="18" fill="${secondaryColor}" />
      </g>

      <!-- Category Label -->
      <text x="${titleX}" y="740" text-anchor="${textAnchor}" fill="${secondaryColor}" font-family="${fontFamilies}" font-size="22" font-weight="900" letter-spacing="6">${cleanCategory.toUpperCase()} • ${cleanSub.toUpperCase()}</text>

      <!-- Main Headline -->
      <text x="${titleX}" y="810" text-anchor="${textAnchor}" fill="#ffffff" font-family="${fontFamilies}" font-size="44" font-weight="900" letter-spacing="-1">${cleanTitle}</text>
      <text x="${titleX}" y="870" text-anchor="${textAnchor}" fill="#94a3b8" font-family="${fontFamilies}" font-size="22" font-weight="500">${escapeXml(scriptAccent)}</text>

      <!-- Footer Elements -->
      <line x1="120" y1="920" x2="${width - 120}" y2="920" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
      <text x="${isRtl ? 120 : width - 120}" y="955" text-anchor="${isRtl ? 'start' : 'end'}" fill="#64748b" font-family="${fontFamilies}" font-size="14" font-weight="700" letter-spacing="4">MINIMALIST SIGNATURE COLLECTION</text>
      <text x="${isRtl ? width - 120 : 120}" y="955" text-anchor="${isRtl ? 'end' : 'start'}" fill="#64748b" font-family="${fontFamilies}" font-size="14" font-weight="700">SCALE: 1:1 • ULTRA HD 4K</text>
    `;
  } else if (styleIndex === 1) {
    // Style 2: Bold & Vibrant
    innerElements = `
      <defs>
        <radialGradient id="vibrant_glow_${styleIndex}" cx="70%" cy="30%" r="80%">
          <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.8" />
          <stop offset="60%" stop-color="${primaryColor}" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#020617" stop-opacity="1" />
        </radialGradient>
        <linearGradient id="neon_bar_${styleIndex}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${secondaryColor}" />
          <stop offset="50%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="${secondaryColor}" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#vibrant_glow_${styleIndex})" />

      <!-- Dynamic Diagonal Shapes -->
      <path d="M-100,200 L${width + 100},-50 L${width + 100},150 L-100,400 Z" fill="#ffffff" fill-opacity="0.04" />
      <path d="M-100,750 L${width + 100},500 L${width + 100},700 L-100,950 Z" fill="${secondaryColor}" fill-opacity="0.08" />

      <!-- Glowing circles -->
      <circle cx="850" cy="250" r="300" fill="${secondaryColor}" fill-opacity="0.15" filter="blur(60px)" />
      <circle cx="200" cy="800" r="240" fill="${primaryColor}" fill-opacity="0.25" filter="blur(50px)" />

      <!-- High contrast emblem -->
      <g transform="translate(${width / 2}, 360)">
        <polygon points="0,-140 120,-70 120,70 0,140 -120,70 -120,-70" fill="none" stroke="${secondaryColor}" stroke-width="6" />
        <polygon points="0,-110 95,-55 95,55 0,110 -95,55 -95,-55" fill="${primaryColor}" stroke="#ffffff" stroke-width="2" />
        <circle cx="0" cy="0" r="45" fill="${secondaryColor}" />
        <polygon points="-15,-20 25,0 -15,20" fill="#ffffff" />
      </g>

      <!-- Badge Ribbon -->
      <g transform="translate(${isRtl ? width - 380 : 100}, 560)">
        <rect width="280" height="48" rx="14" fill="#ffffff" />
        <text x="140" y="31" text-anchor="middle" fill="#0f172a" font-family="${fontFamilies}" font-size="16" font-weight="900" letter-spacing="3">${cleanSub.toUpperCase()}</text>
      </g>

      <!-- Headline -->
      <text x="${titleX}" y="670" text-anchor="${textAnchor}" fill="#ffffff" font-family="${fontFamilies}" font-size="56" font-weight="900" letter-spacing="-1">${cleanTitle}</text>
      <text x="${titleX}" y="740" text-anchor="${textAnchor}" fill="${secondaryColor}" font-family="${fontFamilies}" font-size="28" font-weight="800">${escapeXml(scriptBadge)}</text>
      <text x="${titleX}" y="800" text-anchor="${textAnchor}" fill="#e2e8f0" font-family="${fontFamilies}" font-size="22" font-weight="500">${escapeXml(scriptAccent)}</text>

      <!-- Energy accents -->
      <rect x="100" y="860" width="${width - 200}" height="8" rx="4" fill="url(#neon_bar_${styleIndex})" />
      <text x="${width / 2}" y="940" text-anchor="middle" fill="#94a3b8" font-family="${fontFamilies}" font-size="16" font-weight="800" letter-spacing="6">BOLD DYNAMIC RENDER • HIGH CONTRAST</text>
    `;
  } else if (styleIndex === 2) {
    // Style 3: Elegant Professional
    innerElements = `
      <defs>
        <linearGradient id="royal_grad_${styleIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b0f19" />
          <stop offset="50%" stop-color="${primaryColor}" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>
        <linearGradient id="gold_${styleIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="50%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#ca8a04" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#royal_grad_${styleIndex})" />

      <!-- Ornate double luxury frame -->
      <rect x="70" y="70" width="${width - 140}" height="${height - 140}" fill="none" stroke="url(#gold_${styleIndex})" stroke-width="2.5" rx="8" />
      <rect x="85" y="85" width="${width - 170}" height="${height - 170}" fill="none" stroke="url(#gold_${styleIndex})" stroke-width="1" stroke-dasharray="10 5" rx="4" />

      <!-- Corner cornerpieces -->
      <g stroke="url(#gold_${styleIndex})" stroke-width="3" fill="none">
        <path d="M 60 110 L 110 60 L 140 60" />
        <path d="M ${width - 60} 110 L ${width - 110} 60 L ${width - 140} 60" />
        <path d="M 60 ${height - 110} L 110 ${height - 60} L 140 ${height - 60}" />
        <path d="M ${width - 60} ${height - 110} L ${width - 110} ${height - 60} L ${width - 140} ${height - 60}" />
      </g>

      <!-- Royal Crest -->
      <g transform="translate(${width / 2}, 300)">
        <circle r="110" fill="${primaryColor}" stroke="url(#gold_${styleIndex})" stroke-width="3" />
        <circle r="95" fill="none" stroke="url(#gold_${styleIndex})" stroke-width="1" stroke-dasharray="6 4" />
        <polygon points="0,-50 35,-20 35,40 -35,40 -35,-20" fill="url(#gold_${styleIndex})" />
        <circle cx="0" cy="0" r="14" fill="#0b0f19" />
        <!-- Crown tips -->
        <polygon points="0,-75 15,-55 -15,-55" fill="url(#gold_${styleIndex})" />
        <polygon points="-35,-65 -20,-50 -45,-45" fill="url(#gold_${styleIndex})" />
        <polygon points="35,-65 20,-50 45,-45" fill="url(#gold_${styleIndex})" />
      </g>

      <!-- Typography -->
      <text x="${width / 2}" y="520" text-anchor="middle" fill="url(#gold_${styleIndex})" font-family="${fontFamilies}" font-size="18" font-weight="900" letter-spacing="8">PREMIER LUXURY COLLECTION</text>
      <text x="${width / 2}" y="600" text-anchor="middle" fill="#ffffff" font-family="${fontFamilies}" font-size="52" font-weight="800" letter-spacing="1">${cleanTitle}</text>
      
      <g transform="translate(${width / 2 - 150}, 645)">
        <line x1="0" y1="0" x2="300" y2="0" stroke="url(#gold_${styleIndex})" stroke-width="1.5" />
        <polygon points="150,-6 156,0 150,6 144,0" fill="url(#gold_${styleIndex})" />
      </g>

      <text x="${width / 2}" y="710" text-anchor="middle" fill="#cbd5e1" font-family="${fontFamilies}" font-size="26" font-weight="600">${cleanCategory} • ${cleanSub}</text>
      <text x="${width / 2}" y="770" text-anchor="middle" fill="#94a3b8" font-family="${fontFamilies}" font-size="22" font-weight="400">${escapeXml(scriptBadge)}</text>
      <text x="${width / 2}" y="820" text-anchor="middle" fill="#64748b" font-family="${fontFamilies}" font-size="18" font-weight="500">${escapeXml(scriptAccent)}</text>

      <!-- Signature Seal -->
      <g transform="translate(${width / 2}, 920)">
        <rect x="-140" y="-20" width="280" height="40" rx="20" fill="none" stroke="url(#gold_${styleIndex})" stroke-width="1.5" />
        <text x="0" y="6" text-anchor="middle" fill="url(#gold_${styleIndex})" font-family="${fontFamilies}" font-size="13" font-weight="800" letter-spacing="4">EXECUTIVE SIGNATURE</text>
      </g>
    `;
  } else {
    // Style 4: Creative Geometric
    innerElements = `
      <defs>
        <linearGradient id="geom_bg_${styleIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="${primaryColor}" />
        </linearGradient>
        <pattern id="isometric_${styleIndex}" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M0,40 L40,0 L80,40 L40,80 Z" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#geom_bg_${styleIndex})" />
      <rect width="${width}" height="${height}" fill="url(#isometric_${styleIndex})" />

      <!-- Geometric Composition -->
      <g transform="translate(680, 420)">
        <polygon points="0,-160 140,-80 140,80 0,160 -140,80 -140,-80" fill="${secondaryColor}" fill-opacity="0.2" stroke="${secondaryColor}" stroke-width="3" />
        <polygon points="0,-120 100,-60 100,60 0,120 -100,60 -100,-60" fill="${primaryColor}" stroke="#ffffff" stroke-width="2" />
        <circle cx="0" cy="0" r="40" fill="${secondaryColor}" />
        <line x1="-140" y1="0" x2="140" y2="0" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 4" />
        <line x1="0" y1="-160" x2="0" y2="160" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 4" />
      </g>

      <g transform="translate(240, 260)">
        <circle r="70" fill="none" stroke="${secondaryColor}" stroke-width="4" />
        <rect x="-40" y="-40" width="80" height="80" fill="${secondaryColor}" fill-opacity="0.3" transform="rotate(45)" />
      </g>

      <!-- Modern Typography Layout -->
      <g transform="translate(${isRtl ? width - 120 : 120}, 560)">
        <rect x="${isRtl ? -200 : 0}" y="0" width="200" height="38" rx="8" fill="${secondaryColor}" />
        <text x="${isRtl ? -100 : 100}" y="24" text-anchor="middle" fill="#0f172a" font-family="${fontFamilies}" font-size="14" font-weight="900" letter-spacing="3">${cleanCategory.toUpperCase()}</text>
      </g>

      <text x="${titleX}" y="670" text-anchor="${textAnchor}" fill="#ffffff" font-family="${fontFamilies}" font-size="52" font-weight="900">${cleanTitle}</text>
      <text x="${titleX}" y="735" text-anchor="${textAnchor}" fill="${secondaryColor}" font-family="${fontFamilies}" font-size="28" font-weight="800">${cleanSub} • ${styleName}</text>
      <text x="${titleX}" y="790" text-anchor="${textAnchor}" fill="#cbd5e1" font-family="${fontFamilies}" font-size="22" font-weight="500">${escapeXml(scriptBadge)}</text>
      <text x="${titleX}" y="840" text-anchor="${textAnchor}" fill="#94a3b8" font-family="${fontFamilies}" font-size="18" font-weight="400">${escapeXml(scriptAccent)}</text>

      <!-- Bottom Specs -->
      <g transform="translate(120, 940)">
        <rect width="${width - 240}" height="48" rx="12" fill="#020617" fill-opacity="0.6" stroke="#334155" stroke-width="1" />
        <text x="30" y="30" fill="${secondaryColor}" font-family="${fontFamilies}" font-size="13" font-weight="800">GEOMETRIC ARCHITECTURE</text>
        <text x="${width - 300}" y="30" fill="#94a3b8" font-family="${fontFamilies}" font-size="13" font-weight="700">HIGH-DENSITY VECTOR GRID</text>
      </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    ${innerElements}
  </svg>`;

  const base64Svg = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

  return { svg, dataUrl };
}

const STYLE_VARIANTS = [
  {
    name: "Modern Minimalist",
    prompt: "Clean, minimalist aesthetic, lots of white space, modern sans-serif typography, high-end look."
  },
  {
    name: "Bold & Vibrant",
    prompt: "Bold colors, high contrast, dynamic layout, expressive typography, eye-catching design."
  },
  {
    name: "Elegant Professional",
    prompt: "Sophisticated color palette, serif fonts, balanced composition, professional corporate feel."
  },
  {
    name: "Creative Geometric",
    prompt: "Geometric shapes, abstract elements, unique asymmetric layout, cutting-edge creative style."
  }
];

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
          // Quota limit on free tier, paid key required, or transient failure
          console.log(`Image generation notice for variant ${i + 1}: ${apiErr?.message || 'Using high-fidelity graphic synthesis'}`);
        }
      }

      // 2. High-fidelity vector graphic synthesis if raster image model is unavailable or free-tier quota is 0
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

// Mount Vite or serve static
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Design Engine Pro running on http://0.0.0.0:${PORT}`);
});
