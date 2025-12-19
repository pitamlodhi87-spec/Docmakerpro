import React, { useState, useRef } from 'react';
import { Upload, RotateCw, Trash2, GripHorizontal, Save, CheckCircle, Download, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { getAllPdfPagesAsImages, organizePdf } from '../services/pdfUtils';
import { PdfPageData } from '../types';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const PdfOrganize: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Result State
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setIsProcessing(true);
      setDownloadUrl(null);
      try {
        const extractedPages = await getAllPdfPagesAsImages(f);
        setPages(extractedPages);
      } catch (err) {
        console.error(err);
        alert('Could not load PDF pages. It might be encrypted or corrupted.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const rotatePage = (index: number) => {
    const newPages = [...pages];
    newPages[index].rotation = (newPages[index].rotation + 90) % 360;
    setPages(newPages);
  };

  const deletePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
  };

  const movePage = (from: number, direction: 'left' | 'right') => {
    const to = direction === 'left' ? from - 1 : from + 1;
    if (to < 0 || to >= pages.length) return;
    
    const newPages = [...pages];
    [newPages[from], newPages[to]] = [newPages[to], newPages[from]];
    setPages(newPages);
  };

  const savePdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await organizePdf(file, pages);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert('Failed to save PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPages([]);
    setDownloadUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
           <div>
              <h1 className="text-3xl font-bold text-gray-900">Organize PDF Pages</h1>
              <p className="text-gray-500">Rotate, Delete, Reorder, or Split pages visually.</p>
           </div>
           {pages.length > 0 && !downloadUrl && (
             <button
               onClick={savePdf}
               disabled={isProcessing}
               className="bg-chrome-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
             >
                {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                {isProcessing ? 'Processing...' : 'Save & Process'}
             </button>
           )}
        </div>

        {downloadUrl ? (
           // Success State
           <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center animate-fade-in max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">PDF Ready!</h2>
              <p className="text-gray-600 mb-8 text-lg">Your reorganized document has been successfully generated.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <a 
                   href={downloadUrl} 
                   download={`organized-${file?.name || 'document'}.pdf`}
                   className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg"
                 >
                    <Download size={24} /> Download PDF
                 </a>
                 <button 
                   onClick={resetTool}
                   className="bg-white border border-gray-300 text-gray-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                 >
                    <RefreshCw size={20} /> Organize Another
                 </button>
              </div>
           </div>
        ) : !file ? (
           // Upload State
           <div 
             onClick={() => inputRef.current?.click()}
             className="border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-16 cursor-pointer hover:bg-indigo-100 transition-colors text-center"
           >
             <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
             <GripHorizontal className="mx-auto text-indigo-500 mb-4" size={48} />
             <span className="font-bold text-gray-700 block text-lg">Upload PDF to Organize</span>
           </div>
        ) : (
           // Editing State
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((page, idx) => (
                <div key={idx} className="bg-gray-50 p-2 rounded-xl border border-gray-200 group relative hover:shadow-md transition-shadow">
                   <div className="relative aspect-[3/4] bg-white rounded border border-gray-200 mb-2 overflow-hidden flex items-center justify-center">
                      <img 
                         src={page.thumbnail} 
                         alt={`Page ${idx+1}`} 
                         className="object-contain max-w-full max-h-full transition-transform duration-300"
                         style={{ transform: `rotate(${page.rotation}deg)` }}
                      />
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                         {idx + 1}
                      </div>
                   </div>
                   
                   <div className="flex justify-center gap-2">
                      <button onClick={() => rotatePage(idx)} className="p-1.5 bg-white border border-gray-200 rounded hover:text-chrome-blue transition-colors" title="Rotate 90°">
                         <RotateCw size={14} />
                      </button>
                      <button onClick={() => deletePage(idx)} className="p-1.5 bg-white border border-gray-200 rounded hover:text-red-500 transition-colors" title="Delete Page">
                         <Trash2 size={14} />
                      </button>
                   </div>
                   <div className="flex justify-center gap-2 mt-2">
                      <button 
                        onClick={() => movePage(idx, 'left')} 
                        disabled={idx === 0}
                        className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
                        title="Move Left"
                      >
                         <ArrowLeft size={14} />
                      </button>
                      <button 
                        onClick={() => movePage(idx, 'right')} 
                        disabled={idx === pages.length - 1}
                        className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-default transition-colors"
                        title="Move Right"
                      >
                         <ArrowRight size={14} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        )}
      </div>
      
      <AdBanner />

      <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Free Online PDF Organizer and Editor</h2>
        <p>
           Have you ever scanned a document upside down? Or needed to extract just a few pages from a large contract? 
           FileMaker's <strong>PDF Organizer</strong> gives you complete control over your PDF files without expensive software like Adobe Acrobat Pro.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Features</h3>
        <ul className="list-disc pl-6 space-y-2">
           <li><strong>Rotate Pages:</strong> Fix orientation issues by rotating individual pages 90, 180, or 270 degrees.</li>
           <li><strong>Delete Pages:</strong> Remove unnecessary or blank pages to clean up your document.</li>
           <li><strong>Reorder Pages:</strong> Simply click arrows to move pages to the correct position.</li>
           <li><strong>Secure Processing:</strong> All edits happen in your browser. No files are uploaded to any server.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Use</h3>
        <ol className="list-decimal pl-6 space-y-2">
           <li>Upload your PDF file.</li>
           <li>You will see thumbnail previews of all pages.</li>
           <li>Use the tool icons below each page to Rotate, Delete, or Move.</li>
           <li>When you are happy with the layout, click <strong>Save & Process</strong> to download your new PDF.</li>
        </ol>
      </article>

      <RelatedTools />
    </div>
  );
};

export default PdfOrganize;
