
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Crop, Download, RotateCw, RefreshCcw } from 'lucide-react';
import { readFileAsDataURL, loadImage } from '../services/imageUtils';
import { RelatedTools } from '../components/RelatedTools';
import { AdBanner } from '../components/Layout';

const ImageCropper: React.FC = () => {
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Crop State (Simplistic center crop for V1, or basic aspect ratio)
  // Implementing full drag-to-crop without a library is complex. 
  // We'll provide fixed aspect ratio croppers for this version.
  const [aspectRatio, setAspectRatio] = useState<number | null>(null); // null = free/original, 1 = square, 1.77 = 16:9

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setSrcImage(dataUrl);
        const img = await loadImage(dataUrl);
        setImgElement(img);
        setCroppedImage(null); // Reset
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cropImage = () => {
    if (!imgElement || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple Crop Logic: Center Crop based on aspect ratio
    // If no aspect ratio, just return original (or prompt user this is a simple cropper)
    let cropWidth = imgElement.width;
    let cropHeight = imgElement.height;

    if (aspectRatio) {
        if (imgElement.width / imgElement.height > aspectRatio) {
            // Image is wider than target
            cropHeight = imgElement.height;
            cropWidth = imgElement.height * aspectRatio;
        } else {
            // Image is taller than target
            cropWidth = imgElement.width;
            cropHeight = imgElement.width / aspectRatio;
        }
    }

    const startX = (imgElement.width - cropWidth) / 2;
    const startY = (imgElement.height - cropHeight) / 2;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(imgElement, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    
    setCroppedImage(canvas.toDataURL('image/jpeg', 0.95));
  };

  useEffect(() => {
      if (imgElement) {
          cropImage();
      }
  }, [imgElement, aspectRatio]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Cropper</h1>
          <p className="text-gray-500">Quickly crop images to common aspect ratios (Square, 16:9, 4:3).</p>
        </div>

        {!srcImage ? (
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-colors"
           >
             <Upload className="text-orange-500 mb-4" size={48} />
             <span className="text-xl font-medium text-gray-700">Upload Image to Crop</span>
             <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
           </div>
        ) : (
          <div className="space-y-6">
             <div className="flex flex-wrap gap-2 justify-center">
                <button onClick={() => setAspectRatio(null)} className={`px-4 py-2 rounded-lg text-sm font-bold ${aspectRatio === null ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>Original</button>
                <button onClick={() => setAspectRatio(1)} className={`px-4 py-2 rounded-lg text-sm font-bold ${aspectRatio === 1 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>Square (1:1)</button>
                <button onClick={() => setAspectRatio(16/9)} className={`px-4 py-2 rounded-lg text-sm font-bold ${aspectRatio === 16/9 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>16:9</button>
                <button onClick={() => setAspectRatio(4/3)} className={`px-4 py-2 rounded-lg text-sm font-bold ${aspectRatio === 4/3 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>4:3</button>
                <button onClick={() => setAspectRatio(3/2)} className={`px-4 py-2 rounded-lg text-sm font-bold ${aspectRatio === 3/2 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>3:2</button>
             </div>

             <div className="bg-gray-100 p-4 rounded-xl overflow-auto flex justify-center min-h-[400px]">
                {/* Hidden canvas for processing */}
                <canvas ref={canvasRef} className="hidden" />
                {croppedImage ? (
                    <img src={croppedImage} alt="Cropped Preview" className="max-w-full h-auto object-contain shadow-lg" />
                ) : (
                    <p className="text-gray-400 self-center">Loading...</p>
                )}
             </div>

             <div className="flex justify-center gap-4">
               <button onClick={() => setSrcImage(null)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold">New Image</button>
               <a href={croppedImage || '#'} download="cropped-image.jpg" className={`px-6 py-3 bg-orange-600 text-white rounded-lg font-bold flex items-center gap-2 ${!croppedImage ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Download size={20} /> Download
               </a>
             </div>
          </div>
        )}
      </div>
      <AdBanner />
      <RelatedTools />
    </div>
  );
};

export default ImageCropper;
