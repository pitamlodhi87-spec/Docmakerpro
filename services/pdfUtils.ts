
import { PdfPageData } from "../types";

// Access global libraries loaded via <script> tags
declare const PDFLib: any;
declare const pdfjsLib: any;

export const loadPdfDocument = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return await PDFLib.PDFDocument.load(arrayBuffer);
};

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFLib.PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page: any) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
};

export const renderPdfPageToImage = async (file: File, pageIndex: number, scale: number = 1.0): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(pageIndex + 1); // pdf.js uses 1-based indexing
  
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;
  
  return canvas.toDataURL('image/jpeg', 0.8);
};

export const getAllPdfPagesAsImages = async (file: File, scale: number = 0.5): Promise<PdfPageData[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;
  const pages: PdfPageData[] = [];

  for (let i = 0; i < pageCount; i++) {
    const page = await pdf.getPage(i + 1);
    const viewport = page.getViewport({ scale }); // Thumbnail scale
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({ canvasContext: context, viewport }).promise;
    
    pages.push({
      pageIndex: i,
      originalIndex: i,
      thumbnail: canvas.toDataURL('image/jpeg', 0.7),
      rotation: 0,
      selected: false
    });
  }
  return pages;
};

// Helper to convert data URL to ArrayBuffer
const dataUrlToArrayBuffer = (dataUrl: string): ArrayBuffer => {
  const base64 = dataUrl.split(',')[1];
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// "Compress" PDF by rasterizing pages to JPEGs and re-creating the PDF
// This is effective for scanned docs or heavy vector docs, basically "Flattening"
export const compressPdf = async (file: File, quality: number = 0.7): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = srcPdf.numPages;
  
  const newPdf = await PDFLib.PDFDocument.create();

  for (let i = 0; i < pageCount; i++) {
    const page = await srcPdf.getPage(i + 1);
    // Render at a reasonable scale (e.g., 2.0 for decent readability)
    // Adjust scale based on quality to avoid huge canvases
    const scale = quality > 0.8 ? 2.0 : 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Draw white background first (for transparent PDFs)
    if (context) {
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    await page.render({ canvasContext: context, viewport }).promise;
    
    const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
    const imgBuffer = dataUrlToArrayBuffer(imgDataUrl);
    
    const jpgImage = await newPdf.embedJpg(imgBuffer);
    
    const newPage = newPdf.addPage([viewport.width, viewport.height]);
    newPage.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return await newPdf.save();
};

export const organizePdf = async (file: File, pages: PdfPageData[]): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFLib.PDFDocument.load(arrayBuffer);
  const newPdf = await PDFLib.PDFDocument.create();

  for (const p of pages) {
    const [copiedPage] = await newPdf.copyPages(srcPdf, [p.originalIndex]);
    if (p.rotation !== 0) {
      const currentRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(PDFLib.degrees(currentRotation + p.rotation));
    }
    newPdf.addPage(copiedPage);
  }

  return await newPdf.save();
};

export const downloadPdf = (data: Uint8Array, filename: string) => {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
