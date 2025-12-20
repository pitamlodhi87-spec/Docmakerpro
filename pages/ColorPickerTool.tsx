
import React, { useState } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const ColorPickerTool: React.FC = () => {
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState('');

  // Helper to hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  const rgb = hexToRgb(color);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette size={32} />
           </div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Online Color Picker</h1>
           <p className="text-gray-500 dark:text-gray-400">Get HEX, RGB, and HSL codes easily.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
           <div className="space-y-4">
              <div 
                className="w-full aspect-square rounded-2xl shadow-inner border border-gray-200 dark:border-gray-600 relative overflow-hidden group cursor-pointer"
                style={{ backgroundColor: color }}
              >
                 <input 
                   type="color" 
                   value={color} 
                   onChange={(e) => setColor(e.target.value)} 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-white font-bold text-lg">Click to Change</span>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                 <div className="group">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">HEX</label>
                    <button 
                      onClick={() => copyToClipboard(color)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg text-left font-mono text-lg flex justify-between items-center hover:border-cyan-500 transition-colors"
                    >
                       <span className="text-gray-800 dark:text-gray-200">{color.toUpperCase()}</span>
                       {copied === color ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </button>
                 </div>

                 <div className="group">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">RGB</label>
                    <button 
                      onClick={() => rgb && copyToClipboard(`rgb(${rgb})`)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-lg text-left font-mono text-lg flex justify-between items-center hover:border-cyan-500 transition-colors"
                    >
                       <span className="text-gray-800 dark:text-gray-200">{rgb ? `rgb(${rgb})` : '-'}</span>
                       {copied.includes('rgb') ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </button>
                 </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                 Click the colored box to open the system color picker.
              </p>
           </div>
        </div>
      </div>
      
      <AdBanner />
      <RelatedTools />
    </div>
  );
};

export default ColorPickerTool;
