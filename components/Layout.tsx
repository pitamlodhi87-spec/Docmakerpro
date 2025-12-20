
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Info, Mail, ChevronDown, FileText, Globe, User, Moon, Sun, MessageCircle, Send } from 'lucide-react';

// Tool links definition used in Header and Footer
const toolLinks = [
  { name: 'Merge PDF', path: '/pdf-merge' },
  { name: 'Compress PDF', path: '/pdf-compress' },
  { name: 'Organize PDF', path: '/pdf-organize' },
  { name: 'PDF to Image', path: '/pdf-to-image' },
  { name: 'Universal Converter', path: '/universal-converter' },
  { name: 'Size Increaser', path: '/size-increaser' },
  { name: 'Image Resizer', path: '/resizer' },
  { name: 'Image Cropper', path: '/cropper' },
  { name: 'Background Remover', path: '/remove-bg' },
  { name: 'IMG to PNG', path: '/img-to-png' },
  { name: 'IMG to JPG', path: '/img-to-jpg' },
  { name: 'SVG to PNG', path: '/svg-to-img' },
  { name: 'WebP to JPG', path: '/webp-to-img' },
  { name: 'IMG to WebP', path: '/img-to-webp' },
  { name: 'IMG to PDF', path: '/img-to-pdf' },
  { name: 'Compressor', path: '/compressor' },
  { name: 'Rotator', path: '/rotator' },
  { name: 'Meme Gen', path: '/meme-gen' },
  { name: 'Age Calculator', path: '/age-calculator' },
  { name: 'Chrome Tools', path: '/chrome' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('role');

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Check initial theme preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chrome-blue to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                 F
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-800 dark:text-white">FileMaker</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
             <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-chrome-blue dark:hover:text-white transition-colors">Home</Link>
             
             {/* PDF Tools Dropdown */}
             <div className="relative group">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-chrome-blue dark:hover:text-white focus:outline-none transition-colors">
                  PDF Tools <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50 transform group-hover:translate-y-0 translate-y-2">
                   <Link to="/pdf-merge" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-chrome-blue">Merge PDF</Link>
                   <Link to="/pdf-compress" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-chrome-blue">Compress PDF</Link>
                   <Link to="/pdf-organize" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-chrome-blue">Organize PDF</Link>
                   <Link to="/pdf-to-image" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-chrome-blue">PDF to JPG</Link>
                   <Link to="/img-to-pdf" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-chrome-blue">Image to PDF</Link>
                </div>
             </div>

             {/* All Tools Dropdown */}
             <div className="relative group">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-chrome-blue dark:hover:text-white focus:outline-none transition-colors">
                  All Tools <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50 transform group-hover:translate-y-0 translate-y-2 max-h-[80vh] overflow-y-auto">
                   {toolLinks.map(tool => (
                     <Link key={tool.path} to={tool.path} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-chrome-blue">
                       {tool.name}
                     </Link>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Side: Theme Toggle & Auth */}
          <div className="hidden md:flex items-center gap-3 ml-4">
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
               aria-label="Toggle Theme"
             >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
             </button>

             {userName ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                        <User size={16} /> {userName}
                    </span>
                    {role === 'ADMIN' && (
                        <Link to="/admin" className="text-sm font-bold text-chrome-blue">Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
                </div>
             ) : (
                <>
                    <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-chrome-blue transition-colors">Login</Link>
                    <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-chrome-blue hover:bg-blue-600 rounded-lg shadow-sm transition-colors">Sign Up</Link>
                </>
             )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            <button 
               onClick={toggleTheme}
               className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
            >
               {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-chrome-blue hover:bg-blue-50 dark:hover:bg-gray-800 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 absolute w-full left-0 shadow-lg transition-all duration-300 ease-in-out z-40 overflow-hidden ${
          isOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 overflow-y-auto max-h-[85vh]">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)} 
            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Home
          </Link>
          <div className="px-3 pt-4 pb-2 font-bold text-xs text-gray-400 uppercase tracking-wider">
            PDF Tools
          </div>
          <div className="grid grid-cols-2 gap-1 mb-4">
            <Link to="/pdf-merge" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Merge PDF</Link>
            <Link to="/pdf-compress" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Compress PDF</Link>
            <Link to="/pdf-organize" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Organize PDF</Link>
            <Link to="/pdf-to-image" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">PDF to Image</Link>
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
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-chrome-blue'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 mt-2">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Join Community</p>
             <div className="grid grid-cols-2 gap-2">
                <a href="https://whatsapp.com/channel/0029VbCBS0T1SWt60kriuL0f" target="_blank" rel="noreferrer" className="flex items-center justify-center px-3 py-2 text-sm font-bold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    <MessageCircle size={16} className="mr-2" /> WhatsApp
                </a>
                <a href="https://t.me/filemakerfreel" target="_blank" rel="noreferrer" className="flex items-center justify-center px-3 py-2 text-sm font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    <Send size={16} className="mr-2" /> Telegram
                </a>
             </div>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
             {userName ? (
                <>
                    <div className="px-3 py-2 font-bold text-gray-800 dark:text-white">Hi, {userName}</div>
                    {role === 'ADMIN' && <Link to="/admin" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg">Admin Dashboard</Link>}
                    <button onClick={handleLogout} className="block w-full text-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">Logout</button>
                </>
             ) : (
                <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Login</Link>
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleNavChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value;
    if (path) {
      navigate(path);
      e.target.value = "";
    }
  };

  // Constellation Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    // Nodes
    const nodes: {x: number, y: number, vx: number, vy: number}[] = [];
    const nodeCount = 40;
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(66, 133, 244, 0.5)'; // Blue nodes
        ctx.strokeStyle = 'rgba(66, 133, 244, 0.15)'; // Faint blue lines

        nodes.forEach((node, i) => {
            // Update pos
            node.x += node.vx;
            node.y += node.vy;

            // Bounce
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            // Draw Node
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < nodes.length; j++) {
                const node2 = nodes[j];
                const dx = node.x - node2.x;
                const dy = node.y - node2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    };

    const animFrame = requestAnimationFrame(animate);

    const handleResize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animFrame);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <footer className="relative bg-[#050510] text-white mt-auto border-t border-gray-800 overflow-hidden dark:border-gray-900">
      {/* Animated Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About</h3>
            <p className="text-gray-400 text-sm mb-6">
              FileMaker provides free, secure, client-side tools for all your file needs. No uploads, no waiting.
            </p>
            <div className="flex flex-col gap-2">
                <a href="https://whatsapp.com/channel/0029VbCBS0T1SWt60kriuL0f" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-green-900/30 transition-colors">
                        <MessageCircle size={16} />
                    </div>
                    <span className="text-sm">Join WhatsApp Channel</span>
                </a>
                <a href="https://t.me/filemakerfreel" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-blue-900/30 transition-colors">
                        <Send size={16} />
                    </div>
                    <span className="text-sm">Join Telegram Group</span>
                </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-chrome-blue transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-chrome-blue transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-chrome-blue transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-chrome-blue transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-chrome-blue transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Popular Tools</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/img-to-pdf" className="hover:text-chrome-blue transition-colors">Image to PDF</Link></li>
              <li><Link to="/compressor" className="hover:text-chrome-blue transition-colors">Image Compressor</Link></li>
              <li><Link to="/remove-bg" className="hover:text-chrome-blue transition-colors">Background Remover</Link></li>
              <li><Link to="/cropper" className="hover:text-chrome-blue transition-colors">Image Cropper</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="text-lg font-semibold mb-4 text-white">Navigate</h3>
             <select 
               onChange={handleNavChange}
               className="w-full bg-gray-800/80 backdrop-blur text-gray-300 border border-gray-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-chrome-blue focus:border-chrome-blue"
             >
               <option value="">Select a Tool...</option>
               {toolLinks.map(t => (
                 <option key={t.path} value={t.path}>{t.name}</option>
               ))}
             </select>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FileMaker. All rights reserved.</p>
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
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
    <div className="w-full my-8 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center">
       <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Advertisement</p>
       <div className="min-h-[90px] flex items-center justify-center text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded border border-dashed border-gray-300 dark:border-gray-700">
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
