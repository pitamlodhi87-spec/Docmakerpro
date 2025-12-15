
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Info, Mail, ChevronDown, FileText, Globe, User } from 'lucide-react';

// Tool links definition used in Header and Footer
const toolLinks = [
  { name: 'Merge PDF', path: '/pdf-merge' },
  { name: 'Compress PDF', path: '/pdf-compress' },
  { name: 'Organize PDF', path: '/pdf-organize' },
  { name: 'PDF to Image', path: '/pdf-to-image' },
  { name: 'Universal Converter', path: '/universal-converter' },
  { name: 'Size Increaser', path: '/size-increaser' },
  { name: 'IMG to PNG', path: '/img-to-png' },
  { name: 'IMG to JPG', path: '/img-to-jpg' },
  { name: 'IMG to JPEG', path: '/img-to-jpeg' },
  { name: 'IMG to WebP', path: '/img-to-webp' },
  { name: 'IMG to PDF', path: '/img-to-pdf' },
  { name: 'IMG to GIF', path: '/img-to-gif' },
  { name: 'IMG to BMP', path: '/img-to-bmp' },
  { name: 'IMG to SVG', path: '/img-to-svg' },
  { name: 'Resizer', path: '/resizer' },
  { name: 'Compressor', path: '/compressor' },
  { name: 'Rotator', path: '/rotator' },
  { name: 'Meme Gen', path: '/meme-gen' },
  { name: 'Email Resizer', path: '/email-resizer' },
  { name: 'Age Calculator', path: '/age-calculator' },
  { name: 'AI Analyze', path: '/ai-tool' },
  { name: 'Chrome Tools', path: '/chrome' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('role');

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chrome-blue to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                 F
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-800">FileMaker<span className="text-chrome-blue">On</span></span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
             <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-chrome-blue transition-colors">Home</Link>
             
             {/* PDF Tools Dropdown */}
             <div className="relative group">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-chrome-blue focus:outline-none transition-colors">
                  PDF Tools <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50 transform group-hover:translate-y-0 translate-y-2">
                   <Link to="/pdf-merge" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-chrome-blue">Merge PDF</Link>
                   <Link to="/pdf-compress" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-chrome-blue">Compress PDF</Link>
                   <Link to="/pdf-organize" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-chrome-blue">Organize PDF</Link>
                   <Link to="/pdf-to-image" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-chrome-blue">PDF to JPG</Link>
                   <Link to="/img-to-pdf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-chrome-blue">Image to PDF</Link>
                </div>
             </div>

             {/* All Tools Dropdown */}
             <div className="relative group">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-chrome-blue focus:outline-none transition-colors">
                  All Tools <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50 transform group-hover:translate-y-0 translate-y-2 max-h-[80vh] overflow-y-auto">
                   {toolLinks.map(tool => (
                     <Link key={tool.path} to={tool.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-chrome-blue">
                       {tool.name}
                     </Link>
                   ))}
                </div>
             </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 ml-4">
             {userName ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                        <User size={16} /> {userName}
                    </span>
                    {role === 'ADMIN' && (
                        <Link to="/admin" className="text-sm font-bold text-chrome-blue">Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
                </div>
             ) : (
                <>
                    <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-chrome-blue transition-colors">Login</Link>
                    <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-chrome-blue hover:bg-blue-600 rounded-lg shadow-sm transition-colors">Sign Up</Link>
                </>
             )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-chrome-blue hover:bg-blue-50 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg transition-all duration-300 ease-in-out z-40 overflow-hidden ${
          isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 overflow-y-auto max-h-[80vh]">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)} 
            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-900 hover:bg-gray-50"
          >
            Home
          </Link>
          <div className="px-3 pt-4 pb-2 font-bold text-xs text-gray-400 uppercase tracking-wider">
            PDF Tools
          </div>
          <div className="grid grid-cols-2 gap-1 mb-4">
            <Link to="/pdf-merge" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Merge PDF</Link>
            <Link to="/pdf-compress" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Compress PDF</Link>
            <Link to="/pdf-organize" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Organize PDF</Link>
            <Link to="/pdf-to-image" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">PDF to Image</Link>
          </div>

          <div className="px-3 pt-2 pb-2 font-bold text-xs text-gray-400 uppercase tracking-wider">
            Image Tools
          </div>
          <div className="grid grid-cols-2 gap-1">
            {toolLinks.filter(t => !t.name.includes('PDF')).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-chrome-blue'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="p-3 border-t border-gray-100 mt-2 space-y-2">
             {userName ? (
                <>
                    <div className="px-3 py-2 font-bold text-gray-800">Hi, {userName}</div>
                    {role === 'ADMIN' && <Link to="/admin" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg">Admin Dashboard</Link>}
                    <button onClick={handleLogout} className="block w-full text-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg">Logout</button>
                </>
             ) : (
                <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">Login</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-chrome-blue hover:bg-blue-600 rounded-lg shadow-sm transition-colors">Sign Up</Link>
                </>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value;
    if (path) {
      navigate(path);
      // Reset select
      e.target.value = "";
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About</h3>
            <p className="text-gray-400 text-sm mb-4">
              FileMakerOn provides free, secure, client-side tools for all your file needs. No uploads, no waiting.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-chrome-blue">Home</Link></li>
              <li><Link to="/about" className="hover:text-chrome-blue">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-chrome-blue">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-chrome-blue">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-chrome-blue">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Popular Tools</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/img-to-pdf" className="hover:text-chrome-blue">Image to PDF</Link></li>
              <li><Link to="/compressor" className="hover:text-chrome-blue">Image Compressor</Link></li>
              <li><Link to="/pdf-merge" className="hover:text-chrome-blue">Merge PDF</Link></li>
              <li><Link to="/chrome" className="hover:text-chrome-blue">Chrome Tools</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="text-lg font-semibold mb-4 text-white">Navigate</h3>
             <select 
               onChange={handleNavChange}
               className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-chrome-blue focus:border-chrome-blue"
             >
               <option value="">Select a Tool...</option>
               {toolLinks.map(t => (
                 <option key={t.path} value={t.path}>{t.name}</option>
               ))}
             </select>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FileMakerOn. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
             <span className="flex items-center gap-1"><Shield size={14}/> Secure</span>
             <span className="flex items-center gap-1"><Globe size={14}/> Global</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const AdBanner: React.FC = () => {
  return (
    <div className="w-full my-8 bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
       <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Advertisement</p>
       <div className="min-h-[90px] flex items-center justify-center text-gray-400 bg-white/50 rounded border border-dashed border-gray-300">
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client="ca-pub-0000000000000000"
               data-ad-slot="0000000000"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
       </div>
    </div>
  );
};
