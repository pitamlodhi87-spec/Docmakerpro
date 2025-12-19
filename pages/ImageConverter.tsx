
import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, RefreshCcw, Image as ImageIcon } from 'lucide-react';
import { ImageFormat } from '../types';
import { readFileAsDataURL, processImage, formatFileSize, getBase64Size } from '../services/imageUtils';
import { RelatedTools } from '../components/RelatedTools';
import { AdBanner } from '../components/Layout';

interface ConverterProps {
  targetFormat: ImageFormat;
  title: string;
  description: string;
}

const ImageConverter: React.FC<ConverterProps> = ({ targetFormat, title, description }) => {
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [srcSize, setSrcSize] = useState<number>(0);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('converted-image');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatName = targetFormat.split('/')[1].toUpperCase().replace('SVG+XML', 'SVG');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const name = file.name.split('.')[0];
      setFileName(name);
      setSrcSize(file.size);
      setIsProcessing(true);
      try {
        const dataUrl = await readFileAsDataURL(file);
        setSrcImage(dataUrl);
        // Auto convert on load
        const converted = await processImage(dataUrl, targetFormat);
        setProcessedImage(converted);
        setOutSize(getBase64Size(converted));
      } catch (err) {
        console.error(err);
        alert('Error processing image');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const getExtension = (fmt: ImageFormat) => {
    switch (fmt) {
      case ImageFormat.PNG: return 'png';
      case ImageFormat.JPEG: return 'jpg';
      case ImageFormat.WEBP: return 'webp';
      case ImageFormat.GIF: return 'gif';
      case ImageFormat.BMP: return 'bmp';
      case ImageFormat.SVG: return 'svg';
      default: return 'img';
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      const ext = getExtension(targetFormat);
      link.download = `${fileName}-FileMaker.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-4">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</label>
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-chrome-blue transition-colors h-64"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-full mb-4">
                <Upload className="text-chrome-blue dark:text-blue-400" size={32} />
              </div>
              <p className="text-gray-900 dark:text-white font-medium">Click to upload</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">PNG, JPG, WEBP, GIF, BMP</p>
            </div>
            {srcImage && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">Original Size: <span className="font-semibold text-gray-900 dark:text-white">{formatFileSize(srcSize)}</span></p>
            )}
          </div>

          {/* Preview & Action Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Converted Preview</label>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl h-64 flex items-center justify-center overflow-hidden relative border border-gray-200 dark:border-gray-700">
              {processedImage ? (
                <img 
                  src={processedImage} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain" 
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <ImageIcon size={48} className="mb-2 opacity-50"/>
                  <span>No image loaded</span>
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-sm">
                  <RefreshCcw className="animate-spin text-white" size={32} />
                </div>
              )}
            </div>

             {processedImage && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">Output Size: <span className="font-semibold text-green-600 dark:text-green-400">{formatFileSize(outSize)}</span></p>
            )}

            <button
              onClick={handleDownload}
              disabled={!processedImage || isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-chrome-blue hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              Download {getExtension(targetFormat).toUpperCase()}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mid-Content Ad */}
      <AdBanner />

      {/* SEO Article & FAQ */}
      <article className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700 prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Convert Images to {formatName} Online for Free</h2>
        
        <p>
          Need to convert your photos to {formatName} format? FileMaker provides the fastest and most secure way to change image formats directly in your web browser. 
          Whether you are a web developer looking to optimize site speed with WebP, a designer needing a transparent PNG, or just someone archiving photos as JPG, 
          our tool handles it all.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Why Convert to {formatName}?</h3>
        <p>
          Different image formats serve different purposes on the web and in print:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          {targetFormat === ImageFormat.JPEG && (
             <li><strong>Compatibility:</strong> JPEG is the universal standard for photography, supported by every device and browser.</li>
          )}
          {targetFormat === ImageFormat.PNG && (
             <li><strong>Transparency:</strong> PNG is the best choice for logos and graphics that require transparent backgrounds.</li>
          )}
          {targetFormat === ImageFormat.WEBP && (
             <li><strong>Performance:</strong> WebP offers superior compression compared to PNG and JPEG, making websites load faster.</li>
          )}
          {targetFormat === ImageFormat.GIF && (
             <li><strong>Animation:</strong> While this tool converts static images, GIF is widely used for simple animations and memes.</li>
          )}
          {targetFormat === ImageFormat.SVG && (
             <li><strong>Scalability:</strong> SVG files can be scaled to any size without losing quality, perfect for responsive web design.</li>
          )}
          <li><strong>Efficiency:</strong> Our converter ensures the file structure is optimized without unnecessary metadata.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">How to Use the {formatName} Converter</h3>
        <ol className="list-decimal pl-6 space-y-2">
           <li>Click the <strong>Upload Image</strong> box or drag and drop your file.</li>
           <li>The tool supports input formats like JPG, PNG, WebP, BMP, and GIF.</li>
           <li>Wait a moment for the conversion to complete automatically.</li>
           <li>Preview your new {formatName} image and click <strong>Download</strong> to save it to your device.</li>
        </ol>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Frequently Asked Questions (FAQ)</h3>
        
        <div className="space-y-4">
          <div>
             <h5 className="font-bold text-gray-900 dark:text-white">Is this converter free?</h5>
             <p>Yes, FileMaker is completely free to use. There are no limits on the number of files you can convert.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900 dark:text-white">Is it safe to upload my personal photos?</h5>
             <p>Absolutely. We use <strong>Client-Side Technology</strong>, which means your images are processed by your browser on your own computer. They are never uploaded to our servers.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900 dark:text-white">Does converting to {formatName} reduce quality?</h5>
             <p>It depends on the format. Converting to lossless formats like PNG preserves all detail. Converting to compressed formats like JPG or WebP may slightly reduce quality to save file size, but usually, it is not noticeable to the human eye.</p>
          </div>
        </div>
      </article>

      <RelatedTools />
    </div>
  );
};

export default ImageConverter;
