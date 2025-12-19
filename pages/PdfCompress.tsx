
import React, { useState, useRef } from 'react';
import { Upload, Minimize2, FileDown, CheckCircle, Download, RefreshCw } from 'lucide-react';
import { compressPdf } from '../services/pdfUtils';
import { formatFileSize } from '../services/imageUtils';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const PdfCompress: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Result State
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
      setResultSize(0);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const compressedBytes = await compressPdf(file, quality);
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setResultSize(blob.size);
    } catch (err) {
      console.error(err);
      alert('Failed to compress PDF. Please check if the file is valid and not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl && file) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `compressed-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFile(null);
    setDownloadUrl(null);
    setResultSize(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const savedPct = file && resultSize ? Math.round(((file.size - resultSize) / file.size) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-gray-900 mb-2">Compress PDF Online</h1>
           <p className="text-gray-500">Reduce PDF file size securely by optimizing visual elements.</p>
        </div>
        
        {!file ? (
           <div 
             onClick={() => inputRef.current?.click()}
             className="border-2 border-dashed border-green-300 bg-green-50 rounded-xl p-12 cursor-pointer hover:bg-green-100 transition-colors text-center"
           >
             <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
             <Minimize2 className="mx-auto text-green-600 mb-4" size={48} />
             <span className="font-bold text-gray-700 block text-lg">Upload PDF to Compress</span>
             <span className="text-sm text-gray-500 mt-2">Max 50MB (Recommended)</span>
           </div>
        ) : downloadUrl ? (
           // Success State
           <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">PDF Compressed!</h2>
              
              <div className="flex justify-center items-center gap-8 mb-6 text-sm">
                 <div className="text-center">
                    <p className="text-gray-500">Original</p>
                    <p className="text-lg font-bold text-gray-800 line-through decoration-red-500">{formatFileSize(file.size)}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-gray-500">Compressed</p>
                    <p className="text-lg font-bold text-green-700">{formatFileSize(resultSize)}</p>
                 </div>
                 <div className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-bold">
                    -{savedPct > 0 ? savedPct : 0}%
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                   onClick={handleDownload}
                   className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                 >
                    <Download size={20} /> Download PDF
                 </button>
                 <button 
                   onClick={resetTool}
                   className="bg-white border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                 >
                    <RefreshCw size={18} /> New File
                 </button>
              </div>
           </div>
        ) : (
           // Configuration State
           <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                 <div className="bg-red-100 p-3 rounded-lg text-red-600 font-bold text-xs">PDF</div>
                 <div>
                    <p className="font-bold text-gray-800 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-sm text-gray-500">Original Size: {formatFileSize(file.size)}</p>
                 </div>
                 <button onClick={() => setFile(null)} className="ml-auto text-sm text-red-500 hover:underline">Change</button>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-xl">
                 <label className="flex justify-between font-bold text-gray-700 mb-4">
                    <span>Compression Level</span>
                    <span className="text-green-600">{Math.round(quality * 100)}% Quality</span>
                 </label>
                 <input 
                   type="range" 
                   min="0.1" 
                   max="1.0" 
                   step="0.1" 
                   value={quality} 
                   onChange={(e) => setQuality(parseFloat(e.target.value))}
                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                 />
                 <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                    <span>Extreme (Smallest Size)</span>
                    <span>Recommended</span>
                    <span>Low (Best Quality)</span>
                 </div>
              </div>

              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                 {isProcessing ? <Minimize2 className="animate-spin" /> : <FileDown />}
                 {isProcessing ? "Compressing..." : "Compress PDF Now"}
              </button>
              
              <div className="text-xs text-gray-500 text-center bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                 <strong>How it works:</strong> This tool flattens your PDF by converting pages into optimized images. This is perfect for reducing the size of scanned documents, but text may become unselectable.
              </div>
           </div>
        )}
      </div>
      
      <AdBanner />

      <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Compress PDF Files for Free</h2>
        <p>
           Large PDF files can be a headache. They are slow to email, impossible to upload to certain portals, and take up valuable storage space on your phone or computer. 
           FileMaker's <strong>PDF Compressor</strong> solves this problem by intelligently optimizing the visual content within your document.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why is my PDF file so big?</h3>
        <p>
           PDFs often contain uncompressed high-resolution images or redundant font data. If you scanned a document at 600 DPI (dots per inch), a single page could be 5MB or more! 
           Our tool reduces this resolution to a web-friendly standard (like 72 or 150 DPI) without making the text unreadable.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The "Flattening" Advantage</h3>
        <p>
           Our compression method uses a technique called <strong>Flattening</strong>. It converts the complex layers of your PDF (text, vectors, images) into a single optimized image layer per page.
           This has two huge benefits:
        </p>
        <ul className="list-disc pl-6 space-y-2">
           <li><strong>Dramatic Size Reduction:</strong> We've seen files shrink by up to 90%.</li>
           <li><strong>Compatibility:</strong> Flattened PDFs look exactly the same on every device, preventing font errors or missing images.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Frequently Asked Questions (FAQ)</h3>
        
        <div className="space-y-4">
          <div>
             <h5 className="font-bold text-gray-900">Is it safe to upload confidential documents?</h5>
             <p>Yes. FileMaker uses <strong>Client-Side Processing</strong>. The compression happens inside your web browser. Your PDF file is never sent to our server, so it is physically impossible for us to read your data.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900">Will my document look blurry?</h5>
             <p>If you choose a very low quality setting (like 10-30%), images might look pixelated. We recommend keeping the quality slider around 70% for the best balance between sharpness and file size.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900">Why can't I select text after compression?</h5>
             <p>Because our tool converts the pages into optimized images to save space, the text becomes part of the image. This is ideal for archiving receipts, certificates, and scanned forms.</p>
          </div>
        </div>
      </article>

      <RelatedTools />
    </div>
  );
};

export default PdfCompress;
