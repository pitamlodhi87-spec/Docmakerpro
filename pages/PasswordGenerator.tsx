
import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, Copy, Check } from 'lucide-react';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const chars = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let charSet = '';
    if (options.upper) charSet += chars.upper;
    if (options.lower) charSet += chars.lower;
    if (options.numbers) charSet += chars.numbers;
    if (options.symbols) charSet += chars.symbols;

    if (!charSet) return;

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += charSet[Math.floor(Math.random() * charSet.length)];
    }
    setPassword(generated);
    setCopied(false);
  };

  useEffect(() => {
    generate();
  }, [length, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (options.upper && options.lower) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    
    if (score < 3) return { label: 'Weak', color: 'bg-red-500' };
    if (score < 5) return { label: 'Medium', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
           </div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Safe Password Generator</h1>
           <p className="text-gray-500 dark:text-gray-400">Create cryptographically strong passwords locally in your browser.</p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl mb-8 flex items-center justify-between gap-4 border border-gray-200 dark:border-gray-700">
           <div className="text-2xl sm:text-3xl font-mono font-bold text-gray-800 dark:text-white break-all tracking-wider">
              {password}
           </div>
           <div className="flex gap-2">
              <button onClick={generate} className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:text-emerald-600 transition-colors shadow-sm">
                 <RefreshCw size={20} />
              </button>
              <button onClick={copyToClipboard} className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                 {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
           </div>
        </div>

        <div className="space-y-6">
           <div>
              <div className="flex justify-between mb-2">
                 <label className="font-bold text-gray-700 dark:text-gray-300">Password Length: {length}</label>
                 <span className={`text-xs text-white px-2 py-1 rounded font-bold ${strength.color}`}>{strength.label}</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="50" 
                value={length} 
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'upper', label: 'Uppercase (A-Z)' },
                { id: 'lower', label: 'Lowercase (a-z)' },
                { id: 'numbers', label: 'Numbers (0-9)' },
                { id: 'symbols', label: 'Symbols (!@#$)' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                   <input 
                     type="checkbox" 
                     checked={options[opt.id as keyof typeof options]}
                     onChange={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof options] }))}
                     className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                   />
                   <span className="font-medium text-gray-700 dark:text-gray-200">{opt.label}</span>
                </label>
              ))}
           </div>
        </div>
      </div>
      
      <AdBanner />
      <RelatedTools />
    </div>
  );
};

export default PasswordGenerator;
