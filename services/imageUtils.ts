
import { ImageDimension, ImageFormat } from "../types";

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getBase64Size = (base64String: string): number => {
  if (!base64String) return 0;
  // Remove header if present
  const base64 = base64String.split(',')[1] || base64String;
  let padding = 0;
  if (base64.endsWith('==')) padding = 2;
  else if (base64.endsWith('=')) padding = 1;
  return (base64.length * (3/4)) - padding;
};

// Simple BMP Encoder for Canvas Data
const canvasToBMP = (canvas: HTMLCanvasElement): string => {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("No context");
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const fileSize = 54 + width * height * 3; // Header + RGB Data
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);
    
    // Bitmap File Header
    view.setUint16(0, 0x424D, false); // BM
    view.setUint32(2, fileSize, true); // File size
    view.setUint32(6, 0, true); // Reserved
    view.setUint32(10, 54, true); // Offset to data
    
    // DIB Header
    view.setUint32(14, 40, true); // Header size
    view.setInt32(18, width, true); // Width
    view.setInt32(22, -height, true); // Height (top-down)
    view.setUint16(26, 1, true); // Planes
    view.setUint16(28, 24, true); // Bit count (24-bit RGB)
    view.setUint32(30, 0, true); // Compression (BI_RGB)
    view.setUint32(34, width * height * 3, true); // Image size
    view.setInt32(38, 0, true); // X ppm
    view.setInt32(42, 0, true); // Y ppm
    view.setUint32(46, 0, true); // Colors used
    view.setUint32(50, 0, true); // Important colors
    
    // Pixel Data
    let pos = 54;
    const pad = (4 - (width * 3) % 4) % 4;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            // BMP stores BGR
            view.setUint8(pos++, data[i + 2]); // B
            view.setUint8(pos++, data[i + 1]); // G
            view.setUint8(pos++, data[i]);     // R
        }
        pos += pad;
    }
    
    // Convert buffer to base64
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/bmp;base64,' + window.btoa(binary);
};

const createSVG = (width: number, height: number, dataUrl: string): string => {
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <image href="${dataUrl}" width="${width}" height="${height}" />
</svg>`;
    return 'data:image/svg+xml;base64,' + window.btoa(svg);
};

export const processImage = async (
  imageSrc: string,
  format: string,
  targetSize?: ImageDimension,
  quality: number = 0.92
): Promise<string> => {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  
  const width = targetSize?.width || img.width;
  const height = targetSize?.height || img.height;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // White background for non-transparent formats
  if (format === 'image/jpeg' || format === 'image/bmp') {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  // Handle formats
  if (format === ImageFormat.BMP) {
      return canvasToBMP(canvas);
  } else if (format === ImageFormat.SVG) {
      // For SVG, we embed the resized/processed JPEG to keep size down, or PNG if transparent
      const innerFormat = (imageSrc.startsWith('data:image/png') || imageSrc.startsWith('data:image/webp')) ? 'image/png' : 'image/jpeg';
      const innerData = canvas.toDataURL(innerFormat, quality);
      return createSVG(width, height, innerData);
  } else {
      // Standard formats: image/png, image/jpeg, image/webp
      return canvas.toDataURL(format, quality);
  }
};

export const rotateImage = async (
  imageSrc: string, 
  rotation: number, // degrees 0, 90, 180, 270
  flipH: boolean, 
  flipV: boolean
): Promise<string> => {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Determine new dimensions based on rotation
  if (rotation % 180 === 90) {
    canvas.width = img.height;
    canvas.height = img.width;
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return canvas.toDataURL("image/png");
};

export const createMeme = async (
  imageSrc: string,
  topText: string,
  bottomText: string,
  textColor: string = "#FFFFFF",
  strokeColor: string = "#000000",
  fontSizeMultiplier: number = 1
): Promise<string> => {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Context");

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  // Text Config
  const baseFontSize = canvas.width / 10;
  const fontSize = Math.floor(baseFontSize * fontSizeMultiplier);
  
  ctx.font = `900 ${fontSize}px Impact, sans-serif`;
  ctx.fillStyle = textColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = fontSize / 15;
  ctx.textAlign = "center";

  // Draw Top Text
  if (topText) {
    ctx.textBaseline = "top";
    ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 10);
    ctx.fillText(topText.toUpperCase(), canvas.width / 2, 10);
  }

  // Draw Bottom Text
  if (bottomText) {
    ctx.textBaseline = "bottom";
    ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 10);
    ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 10);
  }

  return canvas.toDataURL("image/png");
};

// Advanced function to compress image to a specific target size in bytes
export const compressToTargetSize = async (
  imageSrc: string,
  format: string,
  targetBytes: number
): Promise<string> => {
  const img = await loadImage(imageSrc);
  const originalWidth = img.width;
  const originalHeight = img.height;

  const generateCandidate = async (scale: number, quality: number): Promise<string | null> => {
    const w = Math.max(1, Math.floor(originalWidth * scale));
    const h = Math.max(1, Math.floor(originalHeight * scale));
    return processImage(imageSrc, format, { width: w, height: h }, quality);
  };

  let bestResult = await generateCandidate(1.0, 0.92);
  if (!bestResult) return imageSrc;
  if (getBase64Size(bestResult) <= targetBytes) return bestResult;

  if (format === ImageFormat.JPEG || format === ImageFormat.WEBP) {
    let minQ = 0.01;
    let maxQ = 1.0;
    let qualityPassResult = null;

    for (let i = 0; i < 7; i++) {
      const midQ = (minQ + maxQ) / 2;
      const candidate = await generateCandidate(1.0, midQ);
      if (!candidate) continue;

      if (getBase64Size(candidate) <= targetBytes) {
        qualityPassResult = candidate;
        minQ = midQ;
      } else {
        maxQ = midQ;
      }
    }
    if (qualityPassResult) return qualityPassResult;
  }

  const resizePassQuality = (format === ImageFormat.JPEG || format === ImageFormat.WEBP) ? 0.8 : 1.0;
  
  let minScale = 0.01;
  let maxScale = 1.0;
  let scalePassResult = bestResult;
  
  for (let i = 0; i < 8; i++) {
    const midScale = (minScale + maxScale) / 2;
    const candidate = await generateCandidate(midScale, resizePassQuality);
    if (!candidate) continue;

    if (getBase64Size(candidate) <= targetBytes) {
      scalePassResult = candidate;
      minScale = midScale;
    } else {
      maxScale = midScale;
    }
  }

  return scalePassResult;
};

// New function to INCREASE file size by appending padding
export const increaseFileSize = async (
  file: File,
  targetBytes: number
): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const currentSize = arrayBuffer.byteLength;

  // If already larger or equal, just return the file blob URL
  if (currentSize >= targetBytes) {
      return URL.createObjectURL(file);
  }

  const paddingSize = targetBytes - currentSize;
  const padding = new Uint8Array(paddingSize);
  // We leave the padding as zeros (null bytes). 
  // Most image viewers stop reading after the file header defines the content, 
  // so trailing zeros increase disk usage without corrupting the visual image.

  const newBlob = new Blob([arrayBuffer, padding], { type: file.type });
  return URL.createObjectURL(newBlob);
};
