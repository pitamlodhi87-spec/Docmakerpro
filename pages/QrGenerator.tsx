
import React, { useState } from 'react';
import { QrCode, Download, Link } from 'lucide-react';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const QrGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [size, setSize] = useState(300);
  const [color, setColor] = useState('000000');
  const [bgColor, setBgColor] = useState('ffffff');

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(input)}&color=${color}&bgcolor=${bgColor}&margin=10`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-100 dark:border-gray-700 pb-6 mb-6 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
             <QrCode size={32} className="text-gray-800 dark:text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">QR Code Generator</h1>
          <p className="text-gray-500 dark:text-gray-400">Generate custom QR codes for URLs, text, Wi-Fi, and more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Enter Content (URL or Text)</label>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Foreground Color</label>
                  <div className="flex items-center gap-2">
                     <input type="color" value={`#${color}`} onChange={e => setColor(e.target.value.substring(1))} className="h-10 w-10 rounded border-0 p-0 cursor-pointer" />
                     <span className="text-sm font-mono dark:text-gray-300">#{color}</span>
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                     <input type="color" value={`#${bgColor}`} onChange={e => setBgColor(e.target.value.substring(1))} className="h-10 w-10 rounded border-0 p-0 cursor-pointer" />
                     <span className="text-sm font-mono dark:text-gray-300">#{bgColor}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
             {input ? (
               <>
                 <img src={qrUrl} alt="QR Code" className="rounded-lg shadow-sm border border-white mb-6" style={{ maxWidth: '100%', height: 'auto' }} />
                 <button 
                   onClick={handleDownload}
                   className="flex items-center gap-2 bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                 >
                   <Download size={20} /> Download PNG
                 </button>
               </>
             ) : (
               <div className="text-gray-400 text-center">
                  <Link size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Enter text to generate QR code</p>
               </div>
             )}
          </div>
        </div>
      </div>
      
      <AdBanner />
      <RelatedTools />
    </div>
  );
};

export default QrGenerator;
