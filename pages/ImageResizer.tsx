
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCcw, Lock, Unlock, Image as ImageIcon, Settings, Save, Info } from 'lucide-react';
import { ImageFormat } from '../types';
import { readFileAsDataURL, processImage, loadImage, formatFileSize, getBase64Size, compressToTargetSize } from '../services/imageUtils';
import { RelatedTools } from '../components/RelatedTools';
import { AdBanner } from '../components/Layout';

type Unit = 'px' | '%' | 'inch';

const ImageResizer: React.FC = () => {
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [srcSize, setSrcSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  // Input States (Text based to allow clearing inputs)
  const [widthInput, setWidthInput] = useState<string>('');
  const [heightInput, setHeightInput] = useState<string>('');
  
  // Settings
  const [unit, setUnit] = useState<Unit>('px');
  const [format, setFormat] = useState<ImageFormat>(ImageFormat.JPEG);
  const [quality, setQuality] = useState<number>(0.92);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  
  // Target File Size Settings
  const [targetSizeValue, setTargetSizeValue] = useState<string>('');
  const [targetSizeUnit, setTargetSizeUnit] = useState<'KB' | 'MB'>('KB');

  // Output State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [outSize, setOutSize] = useState<number>(0);
  const [outDims, setOutDims] = useState({ width: 0, height: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Image
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setSrcSize(file.size);
      try {
        const dataUrl = await readFileAsDataURL(file);
        setSrcImage(dataUrl);
        const img = await loadImage(dataUrl);
        
        setOriginalDimensions({ width: img.width, height: img.height });
        
        // Initial values
        setWidthInput(img.width.toString());
        setHeightInput(img.height.toString());
        setAspectRatio(img.width / img.height);
        
        // Process once
        await runResize(dataUrl, img.width, img.height, format, quality);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Processing Logic
  const runResize = async (src: string, w: number, h: number, fmt: string, q: number) => {
    setIsProcessing(true);
    try {
        let result = await processImage(src, fmt, { width: w, height: h }, q);
        
        // Compress to target size if needed
        if (targetSizeValue) {
            let targetBytes = parseFloat(targetSizeValue);
            if (!isNaN(targetBytes) && targetBytes > 0) {
                if (targetSizeUnit === 'KB') targetBytes *= 1024;
                if (targetSizeUnit === 'MB') targetBytes *= 1024 * 1024;
                // Use the resized image as base for further compression
                result = await compressToTargetSize(result, fmt, targetBytes);
            }
        }

        setProcessedImage(result);
        setOutSize(getBase64Size(result));
        setOutDims({ width: w, height: h });
    } catch (e) {
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  };

  // Handle Input Changes
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWidthInput(val);
    
    if (lockRatio && val && !isNaN(parseFloat(val))) {
        if (unit === 'px') {
            const w = parseFloat(val);
            setHeightInput(Math.round(w / aspectRatio).toString());
        }
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeightInput(val);

    if (lockRatio && val && !isNaN(parseFloat(val))) {
        if (unit === 'px') {
            const h = parseFloat(val);
            setWidthInput(Math.round(h * aspectRatio).toString());
        }
    }
  };

  const handleApplyResize = () => {
      if (!srcImage) return;
      
      let finalW = parseFloat(widthInput);
      let finalH = parseFloat(heightInput);

      if (isNaN(finalW) || isNaN(finalH)) return;

      // Convert units to pixels if needed
      if (unit === '%') {
          finalW = (finalW / 100) * originalDimensions.width;
          finalH = (finalH / 100) * originalDimensions.height;
      } else if (unit === 'inch') {
          finalW = finalW * 96;
          finalH = finalH * 96;
      }

      runResize(srcImage, Math.round(finalW), Math.round(finalH), format, quality);
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      let ext = 'jpg';
      if (format === ImageFormat.PNG) ext = 'png';
      if (format === ImageFormat.WEBP) ext = 'webp';
      
      link.download = `resized-${outDims.width}x${outDims.height}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Advanced Image Resizer</h1>
          <p className="text-gray-500 dark:text-gray-400">Resize by pixels, percentage, or inches. Convert formats and optimize file size.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Section */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6">
                
                {/* Upload Button */}
                <div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-chrome-blue transition-colors shadow-sm active:bg-gray-100 dark:active:bg-gray-600"
                  >
                    <Upload size={18} />
                    {srcImage ? 'Change Image' : 'Upload Image'}
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>

                {srcImage && (
                  <>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                      <span>Original: {originalDimensions.width}x{originalDimensions.height} px</span>
                      <span>{formatFileSize(srcSize)}</span>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* Dimensions & Units */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                         <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                           <Settings size={14} /> Resize Options
                         </label>
                         <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-1">
                           {(['px', '%', 'inch'] as Unit[]).map((u) => (
                             <button
                               key={u}
                               onClick={() => setUnit(u)}
                               className={`px-3 py-1 text-xs rounded-md transition-colors ${unit === u ? 'bg-chrome-blue text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                             >
                               {u}
                             </button>
                           ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Width ({unit})</label>
                          <input 
                            type="number" 
                            value={widthInput}
                            onChange={handleWidthChange}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-chrome-blue focus:border-chrome-blue bg-white dark:bg-gray-800 p-2.5 text-gray-900 dark:text-white font-medium shadow-sm transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Height ({unit})</label>
                          <input 
                            type="number" 
                            value={heightInput}
                            onChange={handleHeightChange}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-chrome-blue focus:border-chrome-blue bg-white dark:bg-gray-800 p-2.5 text-gray-900 dark:text-white font-medium shadow-sm transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => {
                             setLockRatio(!lockRatio);
                             // Re-lock logic if switching back to locked
                             if (!lockRatio && unit === 'px' && widthInput) {
                                setHeightInput(Math.round(parseFloat(widthInput) / aspectRatio).toString());
                             }
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                            lockRatio 
                              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' 
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {lockRatio ? <Lock size={12} /> : <Unlock size={12} />}
                          {lockRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                        </button>
                      </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* Format & Quality */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Output Format</label>
                        <div className="grid grid-cols-3 gap-2">
                           {[
                             { label: 'JPG', val: ImageFormat.JPEG },
                             { label: 'PNG', val: ImageFormat.PNG },
                             { label: 'WEBP', val: ImageFormat.WEBP }
                           ].map((f) => (
                             <button
                               key={f.label}
                               onClick={() => setFormat(f.val)}
                               className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                                 format === f.val 
                                   ? 'border-chrome-blue bg-blue-50 dark:bg-blue-900/30 text-chrome-blue dark:text-blue-300 ring-1 ring-chrome-blue' 
                                   : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                               }`}
                             >
                               {f.label}
                             </button>
                           ))}
                        </div>
                      </div>
                      
                      {/* Target Size Option */}
                      <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                Max File Size <span className="text-xs font-normal text-chrome-blue bg-blue-50 dark:bg-blue-900/50 px-1 rounded">PRO</span>
                            </label>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Optional</span>
                          </div>
                          <div className="flex gap-2">
                            <input 
                                type="number" 
                                placeholder="e.g. 200"
                                value={targetSizeValue}
                                onChange={(e) => setTargetSizeValue(e.target.value)}
                                className="flex-grow border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-chrome-blue focus:border-chrome-blue text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <select
                                value={targetSizeUnit}
                                onChange={(e) => setTargetSizeUnit(e.target.value as any)}
                                className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
                            >
                                <option value="KB">KB</option>
                                <option value="MB">MB</option>
                            </select>
                          </div>
                      </div>

                      {/* Manual Quality Slider - Only show if Target Size is NOT set */}
                      {(!targetSizeValue && format !== ImageFormat.PNG) && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quality (0-100)</label>
                             <div className="relative">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={Math.round(quality * 100)}
                                  onChange={(e) => {
                                    let val = parseInt(e.target.value);
                                    if (isNaN(val)) val = 90;
                                    if (val > 100) val = 100;
                                    if (val < 1) val = 1;
                                    setQuality(val / 100);
                                  }}
                                  className="w-16 py-1 px-2 text-right text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-chrome-blue focus:border-chrome-blue bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                                <span className="absolute right-6 top-1 text-gray-400 text-xs pointer-events-none">%</span>
                             </div>
                          </div>
                          <input 
                            type="range" 
                            min="0.01" 
                            max="1.0" 
                            step="0.01" 
                            value={quality}
                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-chrome-blue"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>Low Quality</span>
                              <span>High Quality</span>
                           </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={handleApplyResize}
                      disabled={isProcessing}
                      className="w-full bg-chrome-blue hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <RefreshCcw className="animate-spin" size={20} /> : <Save size={20} />}
                      Resize & Download
                    </button>
                  </>
                )}
             </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-grow bg-gray-100 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 relative overflow-hidden flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
              {processedImage ? (
                <div className="relative p-4 w-full h-full flex items-center justify-center">
                    {/* Transparency Grid Pattern */}
                    <div className="absolute inset-0 z-0 opacity-10" style={{ 
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
                        backgroundSize: '20px 20px' 
                    }}></div>
                    
                    <img 
                      src={processedImage} 
                      alt="Preview" 
                      className="relative z-10 shadow-2xl rounded-sm max-w-full max-h-full object-contain"
                    />
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center p-4 text-center">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                     <ImageIcon size={40} className="text-gray-400"/>
                  </div>
                  <span className="text-lg font-medium">Upload an image to start editing</span>
                  <span className="text-sm text-gray-400 mt-2">Supports JPG, PNG, WEBP</span>
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                  <RefreshCcw className="animate-spin text-chrome-blue mb-2" size={48} />
                  <span className="font-medium text-gray-600 dark:text-gray-300">Processing...</span>
                </div>
              )}
            </div>

            {processedImage && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-auto text-center sm:text-left">
                    <p className="text-xs text-gray-500 uppercase font-bold">New Size</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatFileSize(outSize)}</p>
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Dimensions: <strong>{outDims.width} x {outDims.height} px</strong></p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Format: <strong>{format.split('/')[1].toUpperCase()}</strong></p>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Download size={20} />
                  Download Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mid-Content Ad */}
      <AdBanner />
      <RelatedTools />
    </div>
  );
};

export default ImageResizer;
