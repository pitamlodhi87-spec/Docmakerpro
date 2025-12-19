
import React, { useState, useRef } from 'react';
import { Upload, FileDown, Trash2, Settings, Image as ImageIcon, MoveUp, MoveDown, RefreshCw } from 'lucide-react';
import { jsPDF } from "jspdf";
import { readFileAsDataURL, processImage, getBase64Size, formatFileSize, loadImage } from '../services/imageUtils';
import { ImageFormat } from '../types';
import { RelatedTools } from '../components/RelatedTools';
import { AdBanner } from '../components/Layout';

interface PdfImage {
  id: string;
  original: string;
  processed: string;
  size: number;
  width: number;
  height: number;
  name: string;
}

const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<PdfImage[]>([]);
  const [quality, setQuality] = useState<number>(0.9); // 0.1 to 1.0
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [margin, setMargin] = useState<number>(10); // mm
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsProcessing(true);
      const newImages: PdfImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const original = await readFileAsDataURL(file);
          const imgObj = await loadImage(original);
          
          // Initial process with current quality
          const processed = await processImage(original, ImageFormat.JPEG, undefined, quality);
          
          newImages.push({
            id: Math.random().toString(36).substr(2, 9),
            original,
            processed,
            size: getBase64Size(processed),
            width: imgObj.width,
            height: imgObj.height,
            name: file.name
          });
        } catch (err) {
          console.error("Error loading image", err);
        }
      }
      
      setImages(prev => [...prev, ...newImages]);
      setIsProcessing(false);
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const applyQuality = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    
    const updatedImages = await Promise.all(images.map(async (img) => {
      const processed = await processImage(img.original, ImageFormat.JPEG, undefined, quality);
      return {
        ...img,
        processed,
        size: getBase64Size(processed)
      };
    }));
    
    setImages(updatedImages);
    setIsProcessing(false);
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setImages(newImages);
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    // Give UI a moment to update to "Generating..."
    setTimeout(async () => {
      try {
        // Initialize jsPDF
        // @ts-ignore
        const doc = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: pageSize
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);

        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (i > 0) doc.addPage();

          // Calculate dimensions to fit
          const imgRatio = img.width / img.height;

          let finalW = availableWidth;
          let finalH = availableWidth / imgRatio;

          if (finalH > availableHeight) {
            finalH = availableHeight;
            finalW = availableHeight * imgRatio;
          }

          const x = (pageWidth - finalW) / 2;
          const y = (pageHeight - finalH) / 2;

          // Add image
          try {
            doc.addImage(
              img.processed, 
              'JPEG', 
              x, 
              y, 
              finalW, 
              finalH,
              undefined, 
              'FAST'
            );
          } catch (e) {
            console.error(`Failed to add image ${i+1}`, e);
          }
        }

        // Save PDF using Blob for better compatibility
        const pdfOutput = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfOutput);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'FileMaker-images.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

      } catch (err) {
        console.error("PDF Generation failed", err);
        alert("Failed to generate PDF. Please try again with fewer images or lower quality.");
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const totalSize = images.reduce((acc, img) => acc + img.size, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Image to PDF Converter</h1>
          <p className="text-gray-500">Convert multiple images to a single PDF. Adjust quality to manage file size.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200 space-y-6">
              
              {/* Upload */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-chrome-yellow/50 text-gray-700 font-bold rounded-xl hover:bg-yellow-50 hover:border-chrome-yellow transition-all active:scale-[0.98]"
              >
                <Upload size={20} className="text-chrome-yellow" />
                Add Images
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />

              <hr className="border-gray-200" />

              {/* Quality Control */}
              <div>
                <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>Image Quality / Compression</span>
                  <span className="text-chrome-blue">{Math.round(quality * 100)}%</span>
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05" 
                  value={quality} 
                  onChange={(e) => setQuality(parseFloat(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-chrome-blue"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Small File</span>
                  <span>Best Quality</span>
                </div>
                
                <button
                  onClick={applyQuality}
                  disabled={images.length === 0 || isProcessing}
                  className="mt-3 w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors active:bg-gray-100"
                >
                  <RefreshCw size={14} className={isProcessing ? "animate-spin" : ""} />
                  Apply Compression
                </button>
              </div>

              <hr className="border-gray-200" />

              {/* PDF Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Settings size={16} /> PDF Settings
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-xs text-gray-500 mb-1">Page Size</label>
                     <select 
                       value={pageSize}
                       onChange={(e) => setPageSize(e.target.value as any)}
                       className="w-full text-sm border-gray-300 rounded-lg focus:ring-chrome-blue focus:border-chrome-blue"
                     >
                       <option value="a4">A4</option>
                       <option value="letter">Letter</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs text-gray-500 mb-1">Orientation</label>
                     <select 
                       value={orientation}
                       onChange={(e) => setOrientation(e.target.value as any)}
                       className="w-full text-sm border-gray-300 rounded-lg focus:ring-chrome-blue focus:border-chrome-blue"
                     >
                       <option value="p">Portrait</option>
                       <option value="l">Landscape</option>
                     </select>
                   </div>
                </div>
              </div>

              {/* Stats & Action */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-sm text-gray-600">Images:</span>
                   <span className="font-bold text-gray-900">{images.length}</span>
                 </div>
                 <div className="flex justify-between items-center mb-3">
                   <span className="text-sm text-gray-600">Est. File Size:</span>
                   <span className="font-bold text-green-600">{formatFileSize(totalSize)}</span>
                 </div>
                 
                 <button 
                   onClick={generatePDF}
                   disabled={images.length === 0 || isProcessing || isGenerating}
                   className="w-full bg-chrome-blue hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                 >
                   {isGenerating ? (
                     <>
                        <RefreshCw className="animate-spin" size={20} /> Generating...
                     </>
                   ) : (
                     <>
                       <FileDown size={20} /> Download PDF
                     </>
                   )}
                 </button>
              </div>

            </div>
          </div>

          {/* Image List / Preview */}
          <div className="lg:col-span-8">
            {images.length === 0 ? (
              <div className="h-full min-h-[300px] sm:min-h-[400px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-gray-50 p-8 text-center">
                <ImageIcon size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">No images selected</p>
                <p className="text-sm">Upload images to create your PDF</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                   <h3 className="font-bold text-gray-700">Pages ({images.length})</h3>
                   <button onClick={() => setImages([])} className="text-xs text-red-500 hover:text-red-700 p-2">Clear All</button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {images.map((img, index) => (
                    <div key={img.id} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-row items-center gap-3 sm:gap-4 hover:shadow-sm transition-shadow">
                       <div className="w-6 sm:w-8 flex flex-col items-center gap-1 text-gray-400">
                          <span className="text-xs font-bold">{index + 1}</span>
                       </div>
                       
                       <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                          <img src={img.processed} alt="Thumbnail" className="w-full h-full object-contain" />
                       </div>
                       
                       <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate pr-2" title={img.name}>{img.name}</p>
                          <p className="text-xs text-gray-500">{img.width}x{img.height} • {formatFileSize(img.size)}</p>
                       </div>

                       <div className="flex items-center gap-1 sm:gap-2">
                          <div className="flex flex-col gap-1">
                             <button 
                               onClick={() => moveImage(index, 'up')}
                               disabled={index === 0}
                               className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30 touch-manipulation"
                               aria-label="Move up"
                             >
                               <MoveUp size={16} />
                             </button>
                             <button 
                               onClick={() => moveImage(index, 'down')}
                               disabled={index === images.length - 1}
                               className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30 touch-manipulation"
                               aria-label="Move down"
                             >
                               <MoveDown size={16} />
                             </button>
                          </div>
                          <button 
                            onClick={() => removeImage(img.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                            aria-label="Remove image"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mid-Content Ad */}
      <AdBanner />

      {/* SEO Article & FAQ */}
      <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Convert JPG and PNG Images to PDF Online</h2>
        
        <p>
          Managing digital documents often requires combining multiple image files into a single, professional PDF. 
          FileMaker offers a robust <strong>Image to PDF Converter</strong> that is perfect for students, professionals, and anyone organizing their digital life.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Uses for Image to PDF Conversion</h3>
        <ul className="list-disc pl-6 space-y-2">
           <li><strong>Receipt Scanning:</strong> Take photos of your receipts and combine them into one PDF for expense reports.</li>
           <li><strong>Portfolios:</strong> Photographers and designers can create simple PDF portfolios of their work to email clients.</li>
           <li><strong>Assignment Submission:</strong> Students can photograph handwritten homework pages and submit them as a single document.</li>
           <li><strong>Archiving:</strong> Store scanned old photos in a widely compatible format.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Features to Look For</h3>
        <p>
          Our tool includes specific features designed for document creation:
        </p>
        <ul className="list-disc pl-6 space-y-2">
           <li><strong>Reordering:</strong> Drag and drop or use arrows to change the sequence of pages.</li>
           <li><strong>Quality Control:</strong> Adjust the compression level to ensure your PDF is small enough to email but clear enough to read.</li>
           <li><strong>Page Settings:</strong> Choose between A4 and Letter sizes, and set Portrait or Landscape orientation.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Frequently Asked Questions (FAQ)</h3>
        
        <div className="space-y-4">
          <div>
             <h5 className="font-bold text-gray-900">Can I mix JPG and PNG files?</h5>
             <p>Yes, you can upload different image formats at the same time. Our tool will normalize them and add them to the same PDF document.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900">Is there a limit on pages?</h5>
             <p>Since the processing happens in your browser, the limit depends on your computer's memory (RAM). Most users can easily create PDFs with 50+ pages without issues.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900">Do I need Adobe Acrobat?</h5>
             <p>No. Our free online tool generates standard PDF files that can be opened by any PDF reader, including Adobe Acrobat, Chrome, Edge, and Preview.</p>
          </div>
        </div>
      </article>

      <RelatedTools />
    </div>
  );
};

export default ImageToPdf;
