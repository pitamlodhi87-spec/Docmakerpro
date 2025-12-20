
import React, { useState } from 'react';
import { Link as LinkIcon, Copy, Check, ArrowRight } from 'lucide-react';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const LinkShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const shortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch('https://spoo.me/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({ url: url })
      });

      const data = await response.json();
      if (data.short_url) {
        setShortUrl(data.short_url);
      } else {
        setError('Failed to shorten URL. Please check the link.');
      }
    } catch (err) {
      setError('Service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
           <LinkIcon size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Short Link Generator</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Shorten long, messy URLs into clean, shareable links instantly.</p>

        <form onSubmit={shortenUrl} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
           <input 
             type="url" 
             required
             placeholder="Paste long URL here..." 
             value={url}
             onChange={(e) => setUrl(e.target.value)}
             className="flex-grow p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white outline-none"
           />
           <button 
             type="submit" 
             disabled={loading}
             className="bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
           >
             {loading ? 'Shortening...' : 'Shorten'} <ArrowRight size={20} />
           </button>
        </form>

        {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

        {shortUrl && (
           <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="text-left overflow-hidden">
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Your Short Link</p>
                 <a href={shortUrl} target="_blank" rel="noreferrer" className="text-xl font-bold text-green-700 dark:text-green-400 hover:underline truncate block">
                    {shortUrl}
                 </a>
              </div>
              <button 
                onClick={copyToClipboard}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 flex-shrink-0"
              >
                 {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                 {copied ? 'Copied!' : 'Copy'}
              </button>
           </div>
        )}
      </div>
      
      <AdBanner />
      <RelatedTools />
    </div>
  );
};

export default LinkShortener;
