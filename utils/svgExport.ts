import { CanvasLayer } from '../types';

export function generateVectorSvg(layers: CanvasLayer[], width: number, height: number): string {
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  let elements = '';

  for (const layer of sortedLayers) {
    if (!layer.visible) continue;

    if (layer.type === 'background') {
      const bg = layer as any;
      if (bg.fillType === 'gradient' && bg.gradientColor2) {
        elements += `
          <defs>
            <linearGradient id="svg_bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${bg.fillColor}" />
              <stop offset="100%" stop-color="${bg.gradientColor2}" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#svg_bg_grad)" opacity="${bg.opacity}" />
        `;
      } else {
        elements += `<rect width="${width}" height="${height}" fill="${bg.fillColor || '#ffffff'}" opacity="${bg.opacity}" />`;
      }
    } else if (layer.type === 'shape') {
      const s = layer as any;
      const rx = s.borderRadius || 0;
      if (s.shapeType === 'circle') {
        elements += `<ellipse cx="${s.x + s.width / 2}" cy="${s.y + s.height / 2}" rx="${s.width / 2}" ry="${s.height / 2}" fill="${s.fill}" stroke="${s.stroke || 'none'}" stroke-width="${s.strokeWidth || 0}" opacity="${s.opacity}" />`;
      } else {
        elements += `<rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" rx="${rx}" fill="${s.fill}" stroke="${s.stroke || 'none'}" stroke-width="${s.strokeWidth || 0}" opacity="${s.opacity}" />`;
      }
    } else if (layer.type === 'image') {
      const img = layer as any;
      if (img.src) {
        elements += `<image href="${img.src}" x="${img.x}" y="${img.y}" width="${img.width}" height="${img.height}" opacity="${img.opacity}" preserveAspectRatio="none" />`;
      }
    } else if (layer.type === 'text') {
      const t = layer as any;
      const isRtl = t.direction === 'rtl';
      const textAnchor = t.align === 'center' ? 'middle' : isRtl || t.align === 'right' ? 'end' : 'start';
      const textX = t.align === 'center' ? t.x + t.width / 2 : isRtl || t.align === 'right' ? t.x + t.width : t.x;
      const lines = (t.text || '').split('\n');
      const lineHeight = t.fontSize * 1.3;

      let lineTspans = '';
      lines.forEach((line: string, idx: number) => {
        const cleanLine = line.replace(/[<>&'"]/g, (c: string) => {
          switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            default: return c;
          }
        });
        lineTspans += `<tspan x="${textX}" dy="${idx === 0 ? 0 : lineHeight}">${cleanLine}</tspan>`;
      });

      elements += `
        <text 
          x="${textX}" 
          y="${t.y + t.fontSize}" 
          text-anchor="${textAnchor}" 
          direction="${t.direction || 'ltr'}"
          font-family="${t.fontFamily}" 
          font-size="${t.fontSize}" 
          font-weight="${t.bold ? 'bold' : 'normal'}" 
          fill="${t.color}" 
          opacity="${t.opacity}"
        >
          ${lineTspans}
        </text>
      `;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${elements}
</svg>`;
}
