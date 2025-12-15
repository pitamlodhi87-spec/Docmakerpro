
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ImageIcon, FileImage, Scaling, BrainCircuit, FileText, Minimize2, 
  RotateCw, Smile, Mail, Calculator, FileType, Code, ArrowRightLeft, Maximize,
  Merge, GripHorizontal, FileOutput, Chrome
} from 'lucide-react';
import { Tool } from '../types';

// Category 1: PDF Tools (New Section)
const pdfTools: Tool[] = [
  {
    id: 'pdf-merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document.',
    icon: Merge,
    path: '/pdf-merge',
    color: 'text-red-600',
  },
  {
    id: 'pdf-organize',
    name: 'Organize PDF',
    description: 'Split, Rotate, Delete and Reorder PDF pages.',
    icon: GripHorizontal,
    path: '/pdf-organize',
    color: 'text-indigo-600',
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size by flattening and optimizing.',
    icon: Minimize2,
    path: '/pdf-compress',
    color: 'text-green-600',
  },
  {
    id: 'pdf-to-img',
    name: 'PDF to JPG',
    description: 'Convert PDF pages to high-quality images.',
    icon: FileOutput,
    path: '/pdf-to-image',
    color: 'text-orange-600',
  },
  {
    id: 'img-to-pdf',
    name: 'Image to PDF',
    description: 'Convert multiple images into a single professional PDF.',
    icon: FileText,
    path: '/img-to-pdf',
    color: 'text-red-500',
  },
];

// Category 2: Image Converter Tools
const converterTools: Tool[] = [
  {
    id: 'universal-converter',
    name: 'Universal Image Converter',
    description: 'Convert any file to JPG, PNG, WebP, etc. Set exact file size output (KB/MB).',
    icon: ArrowRightLeft,
    path: '/universal-converter',
    color: 'text-blue-600',
  },
  {
    id: 'img-to-png',
    name: 'Image to PNG',
    description: 'Convert JPG and WebP files to transparent PNG format.',
    icon: ImageIcon,
    path: '/img-to-png',
    color: 'text-green-600',
  },
  {
    id: 'img-to-jpg',
    name: 'Image to JPG',
    description: 'Convert PNG files to optimized JPG images for faster loading.',
    icon: FileImage,
    path: '/img-to-jpg',
    color: 'text-orange-500',
  },
  {
    id: 'img-to-jpeg',
    name: 'Image to JPEG',
    description: 'Convert any image format to standard JPEG format.',
    icon: FileImage,
    path: '/img-to-jpeg',
    color: 'text-orange-600',
  },
  {
    id: 'img-to-webp',
    name: 'Image to WebP',
    description: 'Convert images to modern WebP format for superior web performance.',
    icon: FileType,
    path: '/img-to-webp',
    color: 'text-blue-500',
  },
  {
    id: 'img-to-gif',
    name: 'Image to GIF',
    description: 'Convert static images to GIF format instantly.',
    icon: FileImage,
    path: '/img-to-gif',
    color: 'text-purple-500',
  },
  {
    id: 'img-to-bmp',
    name: 'Image to BMP',
    description: 'Convert images to Bitmap (BMP) raster graphic files.',
    icon: ImageIcon,
    path: '/img-to-bmp',
    color: 'text-indigo-500',
  },
  {
    id: 'img-to-svg',
    name: 'Image to SVG',
    description: 'Embed raster images into Scalable Vector Graphics (SVG).',
    icon: Code,
    path: '/img-to-svg',
    color: 'text-pink-600',
  },
];

// Category 3: Editor & Optimization
const editorTools: Tool[] = [
  {
    id: 'resizer',
    name: 'Image Resizer',
    description: 'Resize images to exact dimensions for web, print, or social media.',
    icon: Scaling,
    path: '/resizer',
    color: 'text-chrome-blue',
  },
  {
    id: 'compressor',
    name: 'Image Compressor',
    description: 'Reduce image file size by up to 80% without losing visible quality.',
    icon: Minimize2,
    path: '/compressor',
    color: 'text-red-500',
  },
  {
    id: 'size-increaser',
    name: 'Size Increaser',
    description: 'Increase file size (KB/MB) for portal requirements without quality loss.',
    icon: Maximize,
    path: '/size-increaser',
    color: 'text-purple-600',
  },
  {
    id: 'rotator',
    name: 'Rotate Image',
    description: 'Rotate and flip images instantly. Correct orientation issues.',
    icon: RotateCw,
    path: '/rotator',
    color: 'text-indigo-500',
  },
  {
    id: 'email',
    name: 'Email Resizer',
    description: 'Optimized resizing for email signatures and newsletter headers.',
    icon: Mail,
    path: '/email-resizer',
    color: 'text-teal-500',
  },
];

// Category 4: Creative & Other
const utilityTools: Tool[] = [
  {
    id: 'meme',
    name: 'Meme Generator',
    description: 'Add classic top and bottom text to images to create viral memes.',
    icon: Smile,
    path: '/meme-gen',
    color: 'text-pink-500',
  },
  {
    id: 'age',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, weeks, and minutes.',
    icon: Calculator,
    path: '/age-calculator',
    color: 'text-purple-500',
  },
  {
    id: 'chrome',
    name: 'Chrome Tools',
    description: 'Essential utilities: The Adder and PX to REM converter.',
    icon: Chrome,
    path: '/chrome',
    color: 'text-blue-500',
  },
  {
    id: 'ai-tool',
    name: 'AI Image Analysis',
    description: 'Generate alt text and descriptions using Gemini AI.',
    icon: BrainCircuit,
    path: '/ai-tool',
    color: 'text-purple-600',
  },
];

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => (
  <Link
    to={tool.path}
    className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:border-chrome-blue/30 hover:shadow-xl transition-all duration-300 flex flex-col items-start active:scale-[0.98]"
  >
    <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm ${tool.color} mb-4 transition-all`}>
      <tool.icon size={28} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-chrome-blue transition-colors">
      {tool.name}
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed">
      {tool.description}
    </p>
  </Link>
);

const Home: React.FC = () => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          FileMaker<span className="text-chrome-blue">On</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-light px-2">
          The ultimate suite of free online tools. Edit PDFs, convert images, resize, and compress instantly.
        </p>
      </div>

      {/* 1. PDF Tools (New Priority) */}
      <section className="bg-red-50/50 rounded-3xl p-6 sm:p-8 border border-red-100">
        <div className="flex items-center gap-3 mb-6">
           <div className="h-8 w-1 bg-red-600 rounded-full"></div>
           <h2 className="text-2xl font-bold text-gray-900">PDF Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 2. Image Converter Tools */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="h-8 w-1 bg-chrome-blue rounded-full"></div>
           <h2 className="text-2xl font-bold text-gray-900">Image Converter Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {converterTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 3. Editor & Optimization Tools */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="h-8 w-1 bg-green-500 rounded-full"></div>
           <h2 className="text-2xl font-bold text-gray-900">Editor & Optimization Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {editorTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 4. Creative & Utility Tools */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
           <h2 className="text-2xl font-bold text-gray-900">Creative & Utilities</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {utilityTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Trust Badge */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 border border-blue-100">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900">Safe & Secure Processing</h3>
          <p className="text-gray-700">
            FileMakerOn uses advanced browser technologies to process your files directly on your device. 
            Unlike other sites, we don't upload your documents to any server, ensuring 100% privacy and lightning-fast speeds.
          </p>
        </div>
        <div className="flex-shrink-0 bg-white p-6 rounded-2xl shadow-md transform rotate-3 transition-transform hover:rotate-0">
           <span className="text-5xl">🔒</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
