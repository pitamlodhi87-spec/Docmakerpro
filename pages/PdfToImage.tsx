
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Package } from 'lucide-react';
import { getAllPdfPagesAsImages } from '../services/pdfUtils';
import { PdfPageData } from '../types';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

// Declare JSZip from global scope (loaded via index.html)
declare const JSZip: any;

const PdfToImage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setIsProcessing(true);
      try {
        // Render at higher scale for better quality
        const extractedPages = await getAllPdfPagesAsImages(f, 2.0);
        setPages(extractedPages);
      } catch (err) {
        console.error(err);
        alert('Error converting PDF. The file may be password protected.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `page-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAsZip = async () => {
    if (!JSZip || pages.length === 0) return;
    setIsZipping(true);
    try {
        const zip = new JSZip();
        const folder = zip.folder("pdf-images");

        pages.forEach((page, i) => {
            // Remove data:image/jpeg;base64, prefix
            const base64Data = page.thumbnail.split(',')[1];
            folder.file(`page-${i+1}.jpg`, base64Data, {base64: true});
        });

        const content = await zip.generateAsync({type: "blob"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "all-pages-filemakeron.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error(e);
        alert("Failed to create ZIP file.");
    } finally {
        setIsZipping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
         <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Convert PDF to JPG Images</h1>
            <p className="text-gray-500">Extract every page of your PDF and save them as high-quality images.</p>
         </div>

         {!file ? (
            <div 
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-12 cursor-pointer hover:bg-orange-100 transition-colors text-center"
            >
              <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
              <ImageIcon className="mx-auto text-orange-500 mb-4" size={48} />
              <span className="font-bold text-gray-700 block text-lg">Upload PDF to Convert</span>
            </div>
         ) : (
            <div>
               {isProcessing ? (
                  <div className="text-center py-12">
                     <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                     <p className="text-gray-600 font-medium">Rendering High-Quality Images...</p>
                     <p className="text-xs text-gray-400 mt-2">This may take a moment for large files</p>
                  </div>
               ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-gray-700">{pages.length} Pages Extracted</h3>
                       <button 
                         onClick={downloadAllAsZip}
                         disabled={isZipping}
                         className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                       >
                          {isZipping ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> : <Package size={16} />}
                          Download All (ZIP)
                       </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {pages.map((page, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="mb-3 bg-white border border-gray-200 rounded overflow-hidden shadow-sm aspect-[3/4] flex items-center justify-center">
                                <img src={page.thumbnail} alt={`Page ${idx+1}`} className="max-w-full max-h-full object-contain" />
                            </div>
                            <button 
                                onClick={() => downloadImage(page.thumbnail, idx)}
                                className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={16} /> Save Page {idx + 1}
                            </button>
                            </div>
                        ))}
                    </div>
                  </>
               )}
               <div className="mt-8 text-center">
                  <button onClick={() => { setFile(null); setPages([]); }} className="text-gray-500 hover:text-gray-800 underline">Convert Another PDF</button>
               </div>
            </div>
         )}
      </div>
      
      <AdBanner />

      <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Extract Images from PDF Documents</h2>
        <p>
           Sometimes you need to use a single page of a PDF in a presentation, post it on social media, or edit it in Photoshop. 
           Since you can't easily upload a PDF to Instagram or edit it in Paint, converting it to an image file (JPG) is the perfect solution. 
           FileMakerOn's <strong>PDF to JPG</strong> tool extracts every page of your document and converts it into a standalone image.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">High Quality Conversion</h3>
        <p>
           Many online converters produce blurry, low-resolution images. Our tool uses advanced rendering engines to ensure that the output JPGs are 
           sharp, clear, and high-resolution, making them suitable for printing or professional presentations.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How it Works</h3>
        <ol className="list-decimal pl-6 space-y-2">
           <li>Upload your PDF file.</li>
           <li>Our engine renders each page as a high-definition canvas.</li>
           <li>You see a preview of all pages.</li>
           <li>Click "Save Page" on any individual page, or use the <strong>Download All (ZIP)</strong> button to get them all at once.</li>
        </ol>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Frequently Asked Questions (FAQ)</h3>
        
        <div className="space-y-4">
          <div>
             <h5 className="font-bold text-gray-900">What format are the images?</h5>
             <p>The extracted pages are saved as <strong>JPEG (JPG)</strong> files. This format is compatible with virtually every device, website, and software application in the world.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900">Can I convert all pages at once?</h5>
             <p>Yes! Use the black "Download All (ZIP)" button at the top of the results to download a single ZIP file containing every page as an image.</p>
          </div>
        </div>
      </article>

      <RelatedTools />
    </div>
  );
};

export default PdfToImage;
