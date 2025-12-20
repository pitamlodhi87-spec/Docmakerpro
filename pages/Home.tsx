
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ImageIcon, FileImage, Scaling, FileText, Minimize2, 
  RotateCw, Smile, Mail, Calculator, FileType, Code, ArrowRightLeft, Maximize,
  Merge, GripHorizontal, FileOutput, Chrome, Crop, Eraser, QrCode, Link as LinkIcon, Lock, Timer, Dices, Palette
} from 'lucide-react';
import { Tool } from '../types';

// Category 1: Image Converter Tools (Comprehensive List)
const converterTools: Tool[] = [
  {
    id: 'universal-converter',
    name: 'Universal Converter',
    description: 'Convert any file to JPG, PNG, WebP, etc.',
    icon: ArrowRightLeft,
    path: '/universal-converter',
    color: 'text-blue-600',
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    description: 'Convert PNG to standard JPG format.',
    icon: FileImage,
    path: '/img-to-jpg',
    color: 'text-orange-500',
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    description: 'Convert JPG to transparent PNG format.',
    icon: ImageIcon,
    path: '/img-to-png',
    color: 'text-green-600',
  },
  {
    id: 'jpeg-to-png',
    name: 'JPEG to PNG',
    description: 'Convert JPEG files to PNG instantly.',
    icon: ImageIcon,
    path: '/jpeg-to-png',
    color: 'text-emerald-600',
  },
  {
    id: 'img-to-jpeg',
    name: 'Image to JPEG',
    description: 'Convert any image format to standard JPEG.',
    icon: FileImage,
    path: '/img-to-jpeg',
    color: 'text-orange-600',
  },
  {
    id: 'img-to-webp',
    name: 'Image to WebP',
    description: 'Convert images to next-gen WebP format.',
    icon: FileType,
    path: '/img-to-webp',
    color: 'text-blue-500',
  },
  {
    id: 'webp-to-img',
    name: 'WebP to JPG/PNG',
    description: 'Convert WebP to widely supported formats.',
    icon: FileType,
    path: '/webp-to-img',
    color: 'text-purple-500',
  },
  {
    id: 'svg-to-png',
    name: 'SVG to PNG/JPG',
    description: 'Rasterize vector SVG files to images.',
    icon: Code,
    path: '/svg-to-img',
    color: 'text-pink-600',
  },
  {
    id: 'img-to-svg',
    name: 'Image to SVG',
    description: 'Convert raster images to Scalable Vectors.',
    icon: Code,
    path: '/img-to-svg',
    color: 'text-red-500',
  },
  {
    id: 'img-to-gif',
    name: 'Image to GIF',
    description: 'Convert static images to GIF format.',
    icon: FileImage,
    path: '/img-to-gif',
    color: 'text-indigo-500',
  },
  {
    id: 'img-to-bmp',
    name: 'Image to BMP',
    description: 'Convert images to Bitmap (BMP) format.',
    icon: ImageIcon,
    path: '/img-to-bmp',
    color: 'text-teal-600',
  },
];

// Category 2: Editor & Optimization (Moved Top)
const editorTools: Tool[] = [
  {
    id: 'remove-bg',
    name: 'Background Remover',
    description: 'Remove background colors using magic wand tool.',
    icon: Eraser,
    path: '/remove-bg',
    color: 'text-pink-500',
  },
  {
    id: 'cropper',
    name: 'Image Cropper',
    description: 'Crop images to specific aspect ratios or custom sizes.',
    icon: Crop,
    path: '/cropper',
    color: 'text-orange-500',
  },
  {
    id: 'resizer',
    name: 'Image Resizer',
    description: 'Resize images to exact dimensions (Width/Height).',
    icon: Scaling,
    path: '/resizer',
    color: 'text-chrome-blue',
  },
  {
    id: 'compressor',
    name: 'Image Compressor',
    description: 'Reduce image file size by up to 80%.',
    icon: Minimize2,
    path: '/compressor',
    color: 'text-red-500',
  },
  {
    id: 'rotator',
    name: 'Rotate Image',
    description: 'Rotate and flip images instantly.',
    icon: RotateCw,
    path: '/rotator',
    color: 'text-indigo-500',
  },
  {
    id: 'size-increaser',
    name: 'Size Increaser',
    description: 'Increase file size (KB/MB) for portal requirements.',
    icon: Maximize,
    path: '/size-increaser',
    color: 'text-purple-600',
  },
];

// Category 3: PDF Tools (Moved Down)
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

// Category 4: Creative & Other
const utilityTools: Tool[] = [
  {
    id: 'qr',
    name: 'QR Code Generator',
    description: 'Create custom QR codes for URLs and text.',
    icon: QrCode,
    path: '/qr-generator',
    color: 'text-gray-800',
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'Create secure, random passwords instantly.',
    icon: Lock,
    path: '/password-generator',
    color: 'text-emerald-600',
  },
  {
    id: 'link',
    name: 'Short Link Generator',
    description: 'Shorten long URLs for easy sharing.',
    icon: LinkIcon,
    path: '/link-shortener',
    color: 'text-blue-500',
  },
  {
    id: 'meme',
    name: 'Meme Generator',
    description: 'Add classic top and bottom text to images.',
    icon: Smile,
    path: '/meme-gen',
    color: 'text-pink-500',
  },
  {
    id: 'email',
    name: 'Email Resizer',
    description: 'Optimized resizing for email signatures.',
    icon: Mail,
    path: '/email-resizer',
    color: 'text-teal-500',
  },
  {
    id: 'age',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, weeks.',
    icon: Calculator,
    path: '/age-calculator',
    color: 'text-purple-500',
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch & Timer',
    description: 'Online countdown timer and stopwatch.',
    icon: Timer,
    path: '/stopwatch',
    color: 'text-orange-500',
  },
  {
    id: 'picker',
    name: 'Random Name Picker',
    description: 'Spin the wheel for giveaways and contests.',
    icon: Dices,
    path: '/random-picker',
    color: 'text-indigo-500',
  },
  {
    id: 'color',
    name: 'Color Picker',
    description: 'Get HEX, RGB, and HSL color codes.',
    icon: Palette,
    path: '/color-picker',
    color: 'text-cyan-500',
  },
  {
    id: 'chrome',
    name: 'Chrome Tools',
    description: 'Essential utilities: The Adder and Converter.',
    icon: Chrome,
    path: '/chrome',
    color: 'text-blue-600',
  },
];

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => (
  <Link
    to={tool.path}
    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-chrome-blue/30 hover:shadow-xl transition-all duration-300 flex flex-col items-start active:scale-[0.98] hover:-translate-y-1 hover:scale-[1.02]"
  >
    <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-sm ${tool.color} mb-4 transition-all`}>
      <tool.icon size={28} />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-chrome-blue transition-colors">
      {tool.name}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
      {tool.description}
    </p>
  </Link>
);

const Home: React.FC = () => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Styles for Galaxy Animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes meteor {
          0% { transform: translateX(300px) translateY(-300px) rotate(-45deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(-500px) translateY(500px) rotate(-45deg); opacity: 0; }
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle infinite ease-in-out;
        }
        .meteor {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, #ffffff, transparent);
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.4);
          transform: rotate(-45deg);
          animation: meteor 7s infinite linear;
          top: -50px;
          right: -50px;
        }
        .nebula-glow {
           background: radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.4), rgba(219, 39, 119, 0.2), transparent 70%);
        }
      `}</style>

      {/* Hero Header with Colorful Galaxy Animation */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-[#0a0a1a] text-white shadow-2xl min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
        {/* Galaxy Background Layers */}
        <div className="absolute inset-0 z-0">
           {/* Colorful Nebula Gradient Base */}
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-80"></div>
           
           {/* Vibrant Orbs */}
           <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[100px]"></div>
           <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[80px]"></div>

           {/* Stars */}
           {[...Array(60)].map((_, i) => (
             <div 
               key={i}
               className="star"
               style={{
                 top: `${Math.random() * 100}%`,
                 left: `${Math.random() * 100}%`,
                 width: `${Math.random() * 3}px`,
                 height: `${Math.random() * 3}px`,
                 opacity: Math.random(),
                 animationDuration: `${2 + Math.random() * 3}s`,
                 animationDelay: `${Math.random() * 2}s`
               }}
             ></div>
           ))}

           {/* Moon */}
           <div 
             className="absolute top-10 right-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full shadow-[0_0_60px_rgba(255,255,255,0.4)] bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400"
             style={{ animation: 'float 8s ease-in-out infinite' }}
           >
              <div className="absolute top-4 left-6 w-4 h-4 bg-gray-400/30 rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-6 h-6 bg-gray-400/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-400/20 rounded-full"></div>
           </div>

           {/* Meteorites */}
           <div className="meteor" style={{ top: '15%', right: '5%', animationDelay: '0s' }}></div>
           <div className="meteor" style={{ top: '35%', right: '25%', animationDelay: '4s' }}></div>
           <div className="meteor" style={{ top: '5%', right: '45%', animationDelay: '7s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 py-12 px-6 sm:px-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl animate-fade-in-up">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-white">F</span>
             </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
            FileMaker
          </h1>
          
          <p className="text-lg sm:text-2xl text-blue-100 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            The ultimate suite of free online tools. <br className="hidden sm:block"/>
            <span className="font-medium text-white">Edit PDFs, convert images, resize, and compress instantly.</span>
          </p>
        </div>
      </div>

      {/* 1. Image Converter Tools (Comprehensive) */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="h-8 w-1 bg-chrome-blue rounded-full"></div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Image Converter Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {converterTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 2. Editor & Optimization Tools (Moved to Top) */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="h-8 w-1 bg-green-500 rounded-full"></div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editor & Optimization Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {editorTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 3. PDF Tools (Moved Down) */}
      <section className="bg-red-50/50 dark:bg-red-900/10 rounded-3xl p-6 sm:p-8 border border-red-100 dark:border-red-900/20">
        <div className="flex items-center gap-3 mb-6">
           <div className="h-8 w-1 bg-red-600 rounded-full"></div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 4. Creative & Utility Tools */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Creative & Utilities</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {utilityTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Trust Badge */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 sm:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 border border-blue-100 dark:border-blue-900/30">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Safe & Secure Processing</h3>
          <p className="text-gray-700 dark:text-gray-300">
            FileMaker uses advanced browser technologies to process your files directly on your device. 
            Unlike other sites, we don't upload your documents to any server, ensuring 100% privacy and lightning-fast speeds.
          </p>
        </div>
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transform rotate-3 transition-transform hover:rotate-0">
           <span className="text-5xl">🔒</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
