
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ImageIcon, FileImage, Scaling, BrainCircuit, FileText, 
  Minimize2, RotateCw, Smile, Mail, Calculator, FileType, Maximize
} from 'lucide-react';

const relatedTools = [
  { name: 'JPG to PNG', path: '/img-to-png', icon: ImageIcon, color: 'text-green-600' },
  { name: 'PNG to JPG', path: '/img-to-jpg', icon: FileImage, color: 'text-blue-600' },
  { name: 'Size Increase', path: '/size-increaser', icon: Maximize, color: 'text-purple-600' },
  { name: 'Image to PDF', path: '/img-to-pdf', icon: FileText, color: 'text-red-500' },
  { name: 'Compressor', path: '/compressor', icon: Minimize2, color: 'text-purple-600' },
  { name: 'Resizer', path: '/resizer', icon: Scaling, color: 'text-indigo-600' },
  { name: 'Meme Maker', path: '/meme-gen', icon: Smile, color: 'text-pink-600' },
  { name: 'Age Calc', path: '/age-calculator', icon: Calculator, color: 'text-teal-600' },
  { name: 'AI Analyze', path: '/ai-tool', icon: BrainCircuit, color: 'text-violet-600' },
];

export const RelatedTools: React.FC = () => {
  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Explore More Tools</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {relatedTools.map((tool) => (
          <Link 
            key={tool.path} 
            to={tool.path}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <tool.icon size={24} className={`mb-2 ${tool.color} group-hover:scale-110 transition-transform`} />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
