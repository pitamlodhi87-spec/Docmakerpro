
import React, { useState, useRef } from 'react';
import { Upload, FilePlus, Merge, Trash2, ArrowDown, CheckCircle, Download } from 'lucide-react';
import { mergePdfs } from '../services/pdfUtils';
import { formatFileSize as formatBytes } from '../services/imageUtils';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const PdfMerge: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
      setDownloadUrl(null);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
    setDownloadUrl(null);
  };

  const moveFile = (from: number, to: number) => {
    const newFiles = [...files];
    const [moved] = newFiles.splice(from, 1);
    newFiles.splice(to, 0, moved);
    setFiles(newFiles);
    setDownloadUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedBytes = await mergePdfs(files);
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert('Failed to merge PDFs. Ensure files are not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "merged-filemaker.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setDownloadUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Merge PDF Files Online</h1>
        <p className="text-gray-500 mb-8">Combine multiple PDFs into one unified document securely.</p>
        
        {/* Success State */}
        {downloadUrl ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 animate-fade-in">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">PDF Merged Successfully!</h2>
             <p className="text-gray-600 mb-6">Your files have been combined into a single document.</p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                   <Download size={20} /> Download PDF
                </button>
                <button 
                  onClick={resetTool}
                  className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                   Merge New Files
                </button>
             </div>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div 
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl p-10 cursor-pointer hover:bg-red-100 transition-colors mb-8"
            >
              <input ref={inputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={handleFileChange} />
              <FilePlus className="mx-auto text-red-500 mb-4" size={48} />
              <span className="font-bold text-gray-700 block text-lg">Upload PDF Files</span>
              <span className="text-sm text-gray-500">or Drag & Drop here</span>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-4 text-left">
                <h3 className="font-bold text-gray-700">Files to Merge ({files.length})</h3>
                <div className="space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="bg-red-100 text-red-600 px-3 py-1 rounded font-bold text-sm">
                                {idx + 1}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => idx < files.length - 1 && moveFile(idx, idx + 1)}
                              className="p-2 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30"
                              disabled={idx === files.length - 1}
                              title="Move Down"
                            >
                                <ArrowDown size={16} />
                            </button>
                            <button 
                              onClick={() => removeFile(idx)}
                              className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded transition-colors"
                              title="Remove File"
                            >
                                <Trash2 size={18} />
                            </button>
                          </div>
                      </div>
                    ))}
                </div>
                
                <button
                  onClick={handleMerge}
                  disabled={isProcessing || files.length < 2}
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? <Merge className="animate-spin" /> : <Merge />}
                    {isProcessing ? "Merging..." : "Merge PDF Files"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AdBanner />
      
      <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Easiest Way to Combine PDF Files</h2>
        <p>
           Merging PDF files is one of the most common document tasks. Whether you are a student combining assignment chapters, 
           a lawyer organizing case files, or a business professional merging monthly reports, FileMaker's <strong>PDF Merger</strong> makes it simple.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Merge PDFs?</h3>
        <ul className="list-disc pl-6 space-y-2">
           <li><strong>Organization:</strong> Keep related documents together in one file instead of emailing 10 separate attachments.</li>
           <li><strong>Printing:</strong> Print a single document once instead of opening and printing multiple files.</li>
           <li><strong>Presentation:</strong> Create a seamless reading experience for your recipients.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Use This Tool</h3>
        <ol className="list-decimal pl-6 space-y-2">
           <li>Click <strong>Upload PDF Files</strong> and select the documents you want to combine. You can select multiple files at once.</li>
           <li>Use the arrows to <strong>Reorder</strong> the files. The file at the top will appear first in the final PDF.</li>
           <li>Click <strong>Merge PDF Files</strong> to instantly create and download your new document.</li>
        </ol>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Frequently Asked Questions (FAQ)</h3>
        
        <div className="space-y-4">
          <div>
             <h5 className="font-bold text-gray-900">Is there a limit to how many files I can merge?</h5>
             <p>FileMaker allows you to merge as many files as your computer's memory can handle. For most users, merging 20-30 files at once works perfectly.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900">Does it work on Mac and Windows?</h5>
             <p>Yes! Since our tool runs in the web browser, it works on Windows, macOS, Linux, and even on mobile devices like Android and iPhone.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900">Are my files private?</h5>
             <p>Absolutely. We use local browser processing. Your documents are not uploaded to any cloud server, ensuring 100% privacy for your sensitive data.</p>
          </div>
        </div>
      </article>

      <RelatedTools />
    </div>
  );
};

export default PdfMerge;
