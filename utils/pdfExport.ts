import { jsPDF } from 'jspdf';
import { CanvasLayer } from '../types';

export async function generatePrintPdf(
  layers: CanvasLayer[],
  width: number,
  height: number,
  title: string = 'Design Deliverable',
  includeBleed: boolean = false
): Promise<Blob> {
  // Render composite canvas
  const compositeCanvas = document.createElement('canvas');
  compositeCanvas.width = width;
  compositeCanvas.height = height;
  const ctx = compositeCanvas.getContext('2d');

  if (ctx) {
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
    for (const layer of sortedLayers) {
      if (!layer.visible) continue;
      // Draw background, shape, image, text
      if (layer.type === 'background') {
        const bg = layer as any;
        if (bg.fillType === 'gradient' && bg.gradientColor2) {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, bg.fillColor);
          grad.addColorStop(1, bg.gradientColor2);
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = bg.fillColor || '#ffffff';
        }
        ctx.fillRect(0, 0, width, height);
      } else if (layer.type === 'shape') {
        const shape = layer as any;
        ctx.save();
        ctx.globalAlpha = shape.opacity;
        ctx.fillStyle = shape.fill;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.restore();
      } else if (layer.type === 'image') {
        const imgLayer = layer as any;
        if (imgLayer.src) {
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise((res) => {
              img.onload = res;
              img.onerror = res;
              img.src = imgLayer.src;
            });
            ctx.save();
            ctx.globalAlpha = imgLayer.opacity;
            ctx.drawImage(img, imgLayer.x, imgLayer.y, imgLayer.width, imgLayer.height);
            ctx.restore();
          } catch (e) {
            console.warn(e);
          }
        }
      } else if (layer.type === 'text') {
        const textLayer = layer as any;
        ctx.save();
        ctx.globalAlpha = textLayer.opacity;
        ctx.font = `${textLayer.bold ? 'bold ' : ''}${textLayer.fontSize}px ${textLayer.fontFamily}`;
        ctx.fillStyle = textLayer.color;
        ctx.direction = textLayer.direction || 'ltr';
        ctx.textAlign = textLayer.align || 'left';
        ctx.textBaseline = 'top';

        const lines = (textLayer.text || '').split('\n');
        const lineSpacing = textLayer.fontSize * 1.3;
        const textX = textLayer.align === 'center' ? textLayer.x + textLayer.width / 2 : textLayer.align === 'right' || textLayer.direction === 'rtl' ? textLayer.x + textLayer.width : textLayer.x;

        lines.forEach((line: string, idx: number) => {
          ctx.fillText(line, textX, textLayer.y + idx * lineSpacing);
        });
        ctx.restore();
      }
    }
  }

  // Calculate PDF physical dimensions (points)
  const orientation = width >= height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format: [width, height]
  });

  const imgData = compositeCanvas.toDataURL('image/jpeg', 0.98);
  pdf.addImage(imgData, 'JPEG', 0, 0, width, height);

  // Add bleed cut marks if requested
  if (includeBleed) {
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(1);
    pdf.rect(15, 15, width - 30, height - 30);
  }

  pdf.setProperties({
    title,
    subject: 'AI-Engine Graphic Deliverable',
    author: 'AI-Engine Studio Pro',
    creator: 'AI-Engine Studio'
  });

  return pdf.output('blob');
}
