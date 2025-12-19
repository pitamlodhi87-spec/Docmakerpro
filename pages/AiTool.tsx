
import React, { useState, useRef } from 'react';
import { BrainCircuit, Upload, Copy, Check } from 'lucide-react';
import { readFileAsDataURL } from '../services/imageUtils';
import { describeImage } from '../services/geminiService';
import { RelatedTools } from '../components/RelatedTools';
import { AdBanner } from '../components/Layout';

const AiTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setResult('');
      try {
        const dataUrl = await readFileAsDataURL(file);
        setImage(dataUrl);
        
        // Call Gemini API
        const description = await describeImage(dataUrl);
        setResult(description);
      } catch (err) {
        setResult("Error processing image. Please ensure your API Key is configured.");
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="text-center mb-10">
         <div className="inline-block p-3 rounded-full bg-purple-100 text-purple-600 mb-4">
           <BrainCircuit size={40} />
         </div>
         <h1 className="text-3xl font-bold text-gray-900">AI Image Describer</h1>
         <p className="text-gray-500 mt-2">Generate SEO-friendly alt text and descriptions using Gemini 2.5 Flash.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         {/* Input */}
         <div className="space-y-4">
           <div 
             onClick={() => fileRef.current?.click()}
             className="border-2 border-dashed border-gray-300 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all overflow-hidden relative"
           >
             {image ? (
               <img src={image} alt="Uploaded" className="w-full h-full object-contain" />
             ) : (
               <>
                 <Upload className="text-gray-400 mb-4" size={40} />
                 <p className="text-gray-600 font-medium">Click to upload image</p>
               </>
             )}
             <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
           </div>
         </div>

         {/* Output */}
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col h-80">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-800">AI Analysis Result</h3>
             {result && (
               <button onClick={copyToClipboard} className="text-sm flex items-center gap-1 text-purple-600 hover:text-purple-700">
                 {copied ? <Check size={16} /> : <Copy size={16} />}
                 {copied ? 'Copied' : 'Copy'}
               </button>
             )}
           </div>
           
           <div className="flex-grow overflow-auto bg-gray-50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed">
             {loading ? (
               <div className="flex items-center justify-center h-full gap-2 text-purple-600">
                 <BrainCircuit className="animate-pulse" />
                 <span>Analyzing image...</span>
               </div>
             ) : result ? (
               result
             ) : (
               <span className="text-gray-400">Upload an image to see the description here.</span>
             )}
           </div>
         </div>
       </div>
       
       {/* Mid-Content Ad */}
       <AdBanner />

       {/* SEO Article & FAQ */}
       <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600 mt-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Using AI to Generate Image Descriptions and Alt Text</h2>
        
        <p>
          Accessibility and SEO go hand-in-hand. Search engines cannot "see" images in the same way humans do; they rely on text descriptions to understand what an image is about. 
          FileMaker's <strong>AI Image Describer</strong> uses Google's advanced Gemini 2.5 AI model to analyze your photos and generate accurate, descriptive text automatically.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Alt Text and Why Does it Matter?</h3>
        <p>
          <strong>Alt Text</strong> (Alternative Text) is a short description of an image embedded in HTML code. It serves two main purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
           <li><strong>Accessibility:</strong> Screen readers read this text aloud to visually impaired users, helping them understand the content of your website.</li>
           <li><strong>SEO:</strong> Google uses Alt Text to index images. A well-written description can help your images appear in Google Images search results, driving more traffic to your site.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Use Generated Descriptions</h3>
        <p>
          Once our AI generates a description for your image, you can:
        </p>
        <ul className="list-disc pl-6 space-y-2">
           <li>Copy it into the "Alt Text" field in WordPress, Shopify, or your website builder.</li>
           <li>Use it as a caption for social media posts on Instagram or LinkedIn.</li>
           <li>Use it to create metadata for stock photography sites.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Frequently Asked Questions (FAQ)</h3>
        
        <div className="space-y-4">
          <div>
             <h5 className="font-bold text-gray-900">How accurate is the AI?</h5>
             <p>The Gemini 2.5 model is state-of-the-art and creates highly accurate descriptions for most standard images, identifying objects, colors, and even context. However, it may sometimes miss specific names of people or obscure locations.</p>
          </div>
          <div>
             <h5 className="font-bold text-gray-900">Is this free?</h5>
             <p>Yes, you can analyze images for free using our tool.</p>
          </div>
        </div>
      </article>

       <RelatedTools />
    </div>
  );
};

export default AiTool;
