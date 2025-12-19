
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Eraser, Download, RefreshCw, MousePointerClick } from 'lucide-react';
import { readFileAsDataURL, loadImage } from '../services/imageUtils';
import { RelatedTools } from '../components/RelatedTools';
import { AdBanner } from '../components/Layout';

const RemoveBg: React.FC = () => {
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tolerance, setTolerance] = useState(30);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      setSrcImage(dataUrl);
      // Initialize canvas
      const img = await loadImage(dataUrl);
      drawToCanvas(img);
    }
  };

  const drawToCanvas = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setResultImage(canvas.toDataURL());
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      floodFill(ctx, x, y, tolerance);
      setResultImage(canvas.toDataURL());
  };

  // Simple Flood Fill Algorithm to remove color (make transparent)
  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, tolerance: number) => {
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

      const startPos = (startY * width + startX) * 4;
      const startR = data[startPos];
      const startG = data[startPos + 1];
      const startB = data[startPos + 2];
      const startA = data[startPos + 3];

      const stack = [[startX, startY]];
      const visited = new Uint8Array(width * height); // keep track

      while (stack.length > 0) {
          const [x, y] = stack.pop()!;
          const pos = (y * width + x) * 4;

          if (visited[y * width + x]) continue;
          visited[y * width + x] = 1;

          // Check color match
          const r = data[pos];
          const g = data[pos + 1];
          const b = data[pos + 2];
          
          const diff = Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB);
          
          if (diff <= tolerance * 3) {
              // Make Transparent
              data[pos + 3] = 0;

              if (x > 0) stack.push([x - 1, y]);
              if (x < width - 1) stack.push([x + 1, y]);
              if (y > 0) stack.push([x, y - 1]);
              if (y < height - 1) stack.push([x, y + 1]);
          }
      }
      ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Magic Background Remover</h1>
          <p className="text-gray-500">Click on any color in your image to make it transparent instantly.</p>
        </div>

        {!srcImage ? (
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-pink-300 bg-pink-50 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-100 transition-colors"
           >
             <Eraser className="text-pink-500 mb-4" size={48} />
             <span className="text-xl font-medium text-gray-700">Upload Image</span>
             <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
           </div>
        ) : (
          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-bold text-gray-700">Tolerance:</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={tolerance} 
                      onChange={(e) => setTolerance(parseInt(e.target.value))} 
                      className="w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                    <span className="text-xs font-mono">{tolerance}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MousePointerClick size={16} /> Click image to remove color
                </div>
                <button 
                    onClick={() => {
                        setSrcImage(null); 
                        setResultImage(null);
                        fileInputRef.current!.value = '';
                    }} 
                    className="text-red-500 text-sm font-bold hover:underline"
                >
                    Reset
                </button>
             </div>

             <div className="border border-gray-200 rounded-xl overflow-hidden bg-[url('https://border-image.com/img/transparent-grid.png')] flex justify-center cursor-crosshair">
                <canvas 
                    ref={canvasRef} 
                    onClick={handleCanvasClick}
                    className="max-w-full h-auto"
                />
             </div>

             <div className="flex justify-center">
               <a 
                 href={resultImage || '#'} 
                 download="removed-bg.png" 
                 className={`px-8 py-4 bg-pink-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-pink-700 transition-colors ${!resultImage ? 'pointer-events-none opacity-50' : ''}`}
               >
                  <Download size={24} /> Download PNG
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

export default RemoveBg;
