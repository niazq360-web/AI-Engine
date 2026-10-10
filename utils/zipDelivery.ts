import JSZip from 'jszip';
import { CanvasLayer, DesignProject } from '../types';
import { generateGenuinePsd } from './psdExport';
import { generatePrintPdf } from './pdfExport';
import { generateVectorSvg } from './svgExport';

export async function createClientDeliveryPackage(
  project: DesignProject,
  layers: CanvasLayer[],
  width: number,
  height: number
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();
  const folderName = `AI_Engine_${project.title.replace(/\s+/g, '_')}_Delivery`;
  const folder = zip.folder(folderName) || zip;

  // 1. Generate Genuine Layered PSD
  const psdResult = await generateGenuinePsd(layers, width, height, project.title);
  folder.file(`${project.title}_Master_Editable.psd`, psdResult.buffer);

  // 2. Generate Lossless PNG
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
    for (const layer of sortedLayers) {
      if (!layer.visible) continue;
      // draw
      if (layer.type === 'background') {
        const bg = layer as any;
        ctx.fillStyle = bg.fillColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);
      } else if (layer.type === 'shape') {
        const s = layer as any;
        ctx.fillStyle = s.fill;
        ctx.fillRect(s.x, s.y, s.width, s.height);
      } else if (layer.type === 'text') {
        const t = layer as any;
        ctx.font = `${t.fontSize}px ${t.fontFamily}`;
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y + t.fontSize);
      }
    }
  }
  const pngDataUrl = canvas.toDataURL('image/png');
  const pngBase64 = pngDataUrl.split(',')[1];
  if (pngBase64) {
    folder.file(`${project.title}_Lossless_Preview.png`, pngBase64, { base64: true });
  }

  // 3. Generate Vector SVG
  const svgContent = generateVectorSvg(layers, width, height);
  folder.file(`${project.title}_Vector_Artwork.svg`, svgContent);

  // 4. Generate Print-Ready PDF
  const pdfBlob = await generatePrintPdf(layers, width, height, project.title, true);
  folder.file(`${project.title}_Print_Ready.pdf`, pdfBlob);

  // 5. Project JSON Source
  const projectJson = JSON.stringify(project, null, 2);
  folder.file(`${project.title}_Source_Project.aidesign`, projectJson);

  // 6. Delivery Manifest & Licensing notes
  const manifest = `
========================================================================
AI-ENGINE PROFESSIONAL GRAPHIC STUDIO - CLIENT DELIVERY MANIFEST
========================================================================
Project Title: ${project.title}
Client Name:   ${project.clientName || 'Private Client'}
Generated:     ${new Date().toISOString()}
Canvas Size:   ${width} x ${height} px
Script Mode:   ${project.language.toUpperCase()} (Urdu / Sindhi / English)
Layer Count:   ${layers.length} Total Elements

INCLUDED DELIVERABLES:
1. ${project.title}_Master_Editable.psd
   - Genuine Adobe Photoshop format with 8BPS signature.
   - Individual separated layers (Background, Shapes, Typography).
   - High-fidelity typography rendering to preserve Arabic/Urdu/Sindhi ligatures.

2. ${project.title}_Lossless_Preview.png
   - Ultra-HD raster image with full transparency channels.

3. ${project.title}_Vector_Artwork.svg
   - Infinitely scalable XML vector graphics.

4. ${project.title}_Print_Ready.pdf
   - High-DPI document including 3mm bleed trim alignment.

5. ${project.title}_Source_Project.aidesign
   - Complete project state backup for re-importing into AI-Engine Studio.

FONT & TYPOGRAPHY SPECIFICATIONS:
- Noto Nastaliq Urdu: Google SIL Open Font License
- Noto Sans Sindhi: Google SIL Open Font License
- Amiri Arabic: Google Open Font License
- Inter: Rasmus Andersson SIL Open Font License

Generated with AI-Engine Studio Pro
========================================================================
`.trim();

  folder.file(`DELIVERY_MANIFEST.txt`, manifest);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const filename = `${folderName}_${Date.now()}.zip`;

  return { blob: zipBlob, filename };
}
