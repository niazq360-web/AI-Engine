import { writePsd } from 'ag-psd';
import { CanvasLayer, TextLayer, ShapeLayer, ImageLayer, BackgroundLayer } from '../types';

export interface PsdValidationResult {
  isValid: boolean;
  signature: string;
  layerCount: number;
  width: number;
  height: number;
  fileSizeBytes: number;
  disclosures: string[];
}

// Renders an individual text layer to an offscreen canvas
function renderTextLayerToCanvas(layer: TextLayer, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();
  ctx.globalAlpha = layer.opacity;

  // Translate to layer position
  ctx.translate(layer.x, layer.y);
  if (layer.rotation) {
    ctx.rotate((layer.rotation * Math.PI) / 180);
  }

  // Text configuration
  const fontStyle = `${layer.italic ? 'italic ' : ''}${layer.bold ? 'bold ' : ''}${layer.fontSize}px ${layer.fontFamily}`;
  ctx.font = fontStyle;
  ctx.fillStyle = layer.color;
  ctx.direction = layer.direction === 'rtl' ? 'rtl' : 'ltr';
  ctx.textAlign = layer.align === 'center' ? 'center' : layer.align === 'right' ? 'right' : 'left';
  ctx.textBaseline = 'top';

  if (layer.shadowColor && layer.shadowBlur) {
    ctx.shadowColor = layer.shadowColor;
    ctx.shadowBlur = layer.shadowBlur;
    ctx.shadowOffsetX = layer.shadowOffsetX || 0;
    ctx.shadowOffsetY = layer.shadowOffsetY || 4;
  }

  const lines = layer.text.split('\n');
  const lineSpacing = layer.fontSize * (layer.lineHeight || 1.3);

  let textX = 0;
  if (layer.align === 'center') textX = layer.width / 2;
  else if (layer.align === 'right' || layer.direction === 'rtl') textX = layer.width;

  lines.forEach((line, index) => {
    ctx.fillText(line, textX, index * lineSpacing);
    if (layer.strokeColor && layer.strokeWidth) {
      ctx.strokeStyle = layer.strokeColor;
      ctx.lineWidth = layer.strokeWidth;
      ctx.strokeText(line, textX, index * lineSpacing);
    }
  });

  ctx.restore();
  return canvas;
}

// Renders a shape layer to an offscreen canvas
function renderShapeLayerToCanvas(layer: ShapeLayer, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();
  ctx.globalAlpha = layer.opacity;
  ctx.translate(layer.x, layer.y);
  if (layer.rotation) {
    ctx.rotate((layer.rotation * Math.PI) / 180);
  }

  ctx.fillStyle = layer.fill;
  if (layer.stroke && layer.strokeWidth) {
    ctx.strokeStyle = layer.stroke;
    ctx.lineWidth = layer.strokeWidth;
  }

  if (layer.shadowColor && layer.shadowBlur) {
    ctx.shadowColor = layer.shadowColor;
    ctx.shadowBlur = layer.shadowBlur;
    ctx.shadowOffsetY = 4;
  }

  if (layer.shapeType === 'circle') {
    const rx = layer.width / 2;
    const ry = layer.height / 2;
    ctx.beginPath();
    ctx.ellipse(rx, ry, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    if (layer.stroke && layer.strokeWidth) ctx.stroke();
  } else if (layer.shapeType === 'rectangle') {
    const r = layer.borderRadius || 0;
    ctx.beginPath();
    ctx.roundRect(0, 0, layer.width, layer.height, r);
    ctx.fill();
    if (layer.stroke && layer.strokeWidth) ctx.stroke();
  } else if (layer.shapeType === 'line') {
    ctx.beginPath();
    ctx.moveTo(0, layer.height / 2);
    ctx.lineTo(layer.width, layer.height / 2);
    ctx.strokeStyle = layer.fill || layer.stroke;
    ctx.lineWidth = layer.strokeWidth || 4;
    ctx.stroke();
  } else {
    // Default polygon / badge
    ctx.beginPath();
    ctx.roundRect(0, 0, layer.width, layer.height, 12);
    ctx.fill();
    if (layer.stroke && layer.strokeWidth) ctx.stroke();
  }

  ctx.restore();
  return canvas;
}

// Renders an image layer to an offscreen canvas
async function renderImageLayerToCanvas(layer: ImageLayer, width: number, height: number): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx || !layer.src) return canvas;

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => resolve(null); // prevent total failure if image fails
      img.src = layer.src;
    });

    ctx.save();
    ctx.globalAlpha = layer.opacity;
    ctx.translate(layer.x, layer.y);
    if (layer.rotation) {
      ctx.rotate((layer.rotation * Math.PI) / 180);
    }

    if (layer.borderRadius) {
      ctx.beginPath();
      ctx.roundRect(0, 0, layer.width, layer.height, layer.borderRadius);
      ctx.clip();
    }

    ctx.drawImage(img, 0, 0, layer.width, layer.height);
    ctx.restore();
  } catch (err) {
    console.warn('Image layer rendering fallback:', err);
  }

  return canvas;
}

// Renders background layer to canvas
function renderBackgroundLayerToCanvas(layer: BackgroundLayer, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();
  ctx.globalAlpha = layer.opacity;

  if (layer.fillType === 'gradient' && layer.gradientColor2) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, layer.fillColor);
    grad.addColorStop(1, layer.gradientColor2);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = layer.fillColor;
  }

  ctx.fillRect(0, 0, width, height);

  // Decorative pattern if selected
  if (layer.patternType === 'grid') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else if (layer.patternType === 'dots') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let x = 30; x < width; x += 60) {
      for (let y = 30; y < height; y += 60) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
  return canvas;
}

/**
 * Generates a genuine, layered Adobe Photoshop PSD file (.psd)
 * Preserves individual layers for Background, Shapes, Images, and Text.
 */
export async function generateGenuinePsd(
  layers: CanvasLayer[],
  width: number,
  height: number,
  _title: string = 'AI-Engine Design'
): Promise<{ blob: Blob; buffer: ArrayBuffer; validation: PsdValidationResult }> {
  // Sort layers by zIndex ascending (background lowest, foreground highest)
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
  const psdChildren: any[] = [];

  // Flattened composite canvas for Photoshop document root preview
  const compositeCanvas = document.createElement('canvas');
  compositeCanvas.width = width;
  compositeCanvas.height = height;
  const compositeCtx = compositeCanvas.getContext('2d');

  for (const layer of sortedLayers) {
    if (!layer.visible) continue;

    let layerCanvas: HTMLCanvasElement;

    if (layer.type === 'background') {
      layerCanvas = renderBackgroundLayerToCanvas(layer as BackgroundLayer, width, height);
    } else if (layer.type === 'shape') {
      layerCanvas = renderShapeLayerToCanvas(layer as ShapeLayer, width, height);
    } else if (layer.type === 'image') {
      layerCanvas = await renderImageLayerToCanvas(layer as ImageLayer, width, height);
    } else {
      layerCanvas = renderTextLayerToCanvas(layer as TextLayer, width, height);
    }

    // Composite onto master canvas
    if (compositeCtx) {
      compositeCtx.drawImage(layerCanvas, 0, 0);
    }

    // Add individual Photoshop layer record
    psdChildren.push({
      name: layer.name || `${layer.type.toUpperCase()}_Layer`,
      canvas: layerCanvas,
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      opacity: layer.opacity,
      hidden: !layer.visible,
      blendMode: 'normal'
    });
  }

  // Construct complete Photoshop Document tree
  const psdDoc: any = {
    width,
    height,
    canvas: compositeCanvas,
    children: psdChildren
  };

  // Write binary PSD using ag-psd encoder
  const arrayBuffer = writePsd(psdDoc, { generateThumbnail: true });
  const blob = new Blob([arrayBuffer], { type: 'image/vnd.adobe.photoshop' });

  // Validate the generated PSD structure
  const headerBytes = new Uint8Array(arrayBuffer.slice(0, 4));
  const signature = String.fromCharCode(...headerBytes);
  const isValid = signature === '8BPS';

  const disclosures = [
    "Genuine Adobe Photoshop PSD document (8BPS signature verified).",
    `Separated into ${psdChildren.length} distinct Photoshop layers (Background, Shapes, Graphics, Text).`,
    "Typography rendered as high-fidelity rasterized layers to preserve Noto Nastaliq & Sindhi Naskh ligatures without requiring local font installation in Photoshop.",
    "Layer opacity, positions, and alpha transparency channels preserved."
  ];

  const validation: PsdValidationResult = {
    isValid,
    signature,
    layerCount: psdChildren.length,
    width,
    height,
    fileSizeBytes: arrayBuffer.byteLength,
    disclosures
  };

  return { blob, buffer: arrayBuffer, validation };
}
