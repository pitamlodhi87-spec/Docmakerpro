
import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCcw, ArrowRightLeft, FileInput, Settings, Info } from 'lucide-react';
import { ImageFormat } from '../types';
import { readFileAsDataURL, processImage, formatFileSize, getBase64Size, compressToTargetSize } from '../services/imageUtils';
import { RelatedTools } from '../components/RelatedTools';
import { AdBanner } from '../components/Layout';

const UniversalConverter: React.FC = () => {
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [srcSize, setSrcSize] = useState<number>(0);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number>(0);
  
  // Settings
  const [targetFormat, setTargetFormat] = useState<ImageFormat>(ImageFormat.JPEG);
  const [targetSizeValue, setTargetSizeValue] = useState<string>('');
  const [targetSizeUnit, setTargetSizeUnit] = useState<'KB' | 'MB'>('KB');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSrcSize(file.size);
      setIsProcessing(true);
      setProcessedImage(null);
      try {
        const dataUrl = await readFileAsDataURL(file);
        setSrcImage(dataUrl);
        // Default conversion on load (no size constraint yet)
        const result = await processImage(dataUrl, targetFormat);
        setProcessedImage(result);
        setOutSize(getBase64Size(result));
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleConvert = async () => {
    if (!srcImage) return;
    setIsProcessing(true);
    
    try {
      let result;
      // Check if target size is requested
      if (targetSizeValue) {
         let targetBytes = parseFloat(targetSizeValue);
         if (isNaN(targetBytes) || targetBytes <= 0) {
             // Fallback to standard process if invalid number
             result = await processImage(srcImage, targetFormat);
         } else {
             if (targetSizeUnit === 'KB') targetBytes *= 1024;
             if (targetSizeUnit === 'MB') targetBytes *= 1024 * 1024;
             
             result = await compressToTargetSize(srcImage, targetFormat, targetBytes);
         }
      } else {
         result = await processImage(srcImage, targetFormat);
      }
      
      setProcessedImage(result);
      setOutSize(getBase64Size(result));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      const ext = targetFormat.split('/')[1].replace('svg+xml', 'svg');
      link.download = `converted-filemakeron.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Universal Image Converter</h1>
          <p className="text-gray-500">Convert any image format to another. Set a target file size for output.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Left: Input & Settings */}
           <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors h-48"
              >
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                {srcImage ? (
                   <img src={srcImage} alt="Source" className="h-full object-contain opacity-80" />
                ) : (
                   <>
                     <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                        <ArrowRightLeft className="text-chrome-blue" size={24} />
                     </div>
                     <span className="font-bold text-blue-900">Upload Image</span>
                     <span className="text-xs text-blue-600 mt-1">Any Format (JPG, PNG, GIF, BMP, WEBP)</span>
                   </>
                )}
              </div>

              {srcImage && (
                 <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-sm">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Convert To</label>
                       <select 
                         value={targetFormat} 
                         onChange={(e) => setTargetFormat(e.target.value as ImageFormat)}
                         className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-chrome-blue focus:border-chrome-blue"
                       >
                         <option value={ImageFormat.JPEG}>JPG / JPEG</option>
                         <option value={ImageFormat.PNG}>PNG (Transparent)</option>
                         <option value={ImageFormat.WEBP}>WebP (Best Web)</option>
                         <option value={ImageFormat.GIF}>GIF (Static)</option>
                         <option value={ImageFormat.BMP}>BMP (Bitmap)</option>
                         <option value={ImageFormat.SVG}>SVG (Embedded)</option>
                       </select>
                    </div>

                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                             <Settings size={14} /> Target File Size (Optional)
                          </label>
                          <span className="text-xs text-gray-500">Auto-compress to fit</span>
                       </div>
                       <div className="flex gap-2">
                          <input 
                             type="number" 
                             placeholder="e.g. 500"
                             value={targetSizeValue}
                             onChange={(e) => setTargetSizeValue(e.target.value)}
                             className="flex-grow border-gray-300 rounded-lg p-2.5 focus:ring-chrome-blue focus:border-chrome-blue"
                          />
                          <select
                             value={targetSizeUnit}
                             onChange={(e) => setTargetSizeUnit(e.target.value as any)}
                             className="w-20 border-gray-300 rounded-lg p-2.5 bg-gray-50"
                          >
                             <option value="KB">KB</option>
                             <option value="MB">MB</option>
                          </select>
                       </div>
                       {(targetFormat !== ImageFormat.JPEG && targetFormat !== ImageFormat.WEBP) ? (
                          <p className="text-xs text-blue-600 mt-2 flex items-start gap-1">
                            <Info size={14} className="mt-0.5 flex-shrink-0" />
                            <span>For non-lossy formats (PNG/BMP/GIF), image dimensions will be resized to meet the size target.</span>
                          </p>
                       ) : (
                          <p className="text-xs text-gray-400 mt-2">
                             We adjust quality first, then dimensions if necessary.
                          </p>
                       )}
                    </div>

                    <button 
                      onClick={handleConvert}
                      disabled={isProcessing}
                      className="w-full bg-chrome-blue hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <RefreshCcw className="animate-spin" /> : <ArrowRightLeft />}
                      Convert Image
                    </button>
                 </div>
              )}
           </div>

           {/* Right: Output */}
           <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[400px]">
              {processedImage ? (
                 <div className="w-full h-full flex flex-col items-center">
                    <div className="flex-grow flex items-center justify-center w-full mb-6 relative">
                       <img src={processedImage} alt="Converted" className="max-w-full max-h-[300px] object-contain shadow-md rounded-md" />
                    </div>
                    
                    <div className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500 uppercase font-bold">Original</span>
                          <span className="text-xs text-gray-500 uppercase font-bold">Converted</span>
                       </div>
                       <div className="flex justify-between items-center text-lg font-bold">
                          <span className="text-gray-700">{formatFileSize(srcSize)}</span>
                          <span className="text-green-600">{formatFileSize(outSize)}</span>
                       </div>
                    </div>

                    <button 
                      onClick={handleDownload}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={20} /> Download File
                    </button>
                 </div>
              ) : (
                 <div className="text-gray-400 text-center">
                    <FileInput size={48} className="mx-auto mb-3 opacity-30" />
                    <p>Converted image will appear here</p>
                 </div>
              )}
           </div>
        </div>
      </div>
      
      <AdBanner />

      <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Convert Any Image File Format Online</h2>
        <p>
           The <strong>Universal Image Converter</strong> by FileMakerOn is your Swiss Army knife for digital images. 
           In the past, you might have needed separate tools to convert PNG to JPG, then another to resize it to 500KB. 
           We have combined everything into one smart interface.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Supported Conversions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-medium text-gray-700">
           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">JPG to PNG</div>
           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">PNG to JPG</div>
           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">WebP to JPG</div>
           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">HEIC to JPG</div>
           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">BMP to PNG</div>
           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">Any to SVG</div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Target File Size Feature</h3>
        <p>
           Have you ever tried to upload a profile picture and seen the error "File must be less than 2MB"? 
           Our unique <strong>Target Size</strong> feature solves this instantly. 
           Simply enter your desired size (e.g., "500 KB"), and we will automatically adjust the image to fit.
        </p>
        <p>
           For variable formats like JPEG and WebP, we first optimize compression quality. 
           For fixed formats like PNG or BMP, or if compression isn't enough, we intelligently resize the image dimensions until it meets your requirement.
        </p>
      </article>

      <RelatedTools />
    </div>
  );
};

export default UniversalConverter;
