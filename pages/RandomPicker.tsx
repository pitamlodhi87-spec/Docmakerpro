
import React, { useState } from 'react';
import { Dices, Trophy, RotateCcw } from 'lucide-react';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const RandomPicker: React.FC = () => {
  const [names, setNames] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handlePick = () => {
    const list = names.split('\n').filter(n => n.trim() !== '');
    if (list.length < 2) {
      alert('Please enter at least 2 names to pick from.');
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    // Animation effect
    let count = 0;
    const interval = setInterval(() => {
      setWinner(list[Math.floor(Math.random() * list.length)]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsSpinning(false);
        // Final pick
        const finalWinner = list[Math.floor(Math.random() * list.length)];
        setWinner(finalWinner);
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dices size={32} />
           </div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Random Name Picker</h1>
           <p className="text-gray-500 dark:text-gray-400">Perfect for giveaways, raffles, and making decisions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <label className="block font-bold text-gray-700 dark:text-gray-300">Enter Names (One per line)</label>
              <textarea 
                value={names}
                onChange={(e) => setNames(e.target.value)}
                placeholder={`Alice\nBob\nCharlie\nDiana`}
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
              />
              <div className="text-right text-sm text-gray-500">
                 Count: {names.split('\n').filter(n => n.trim() !== '').length}
              </div>
           </div>

           <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
              {winner ? (
                 <div className={`text-center animate-fade-in ${isSpinning ? 'opacity-50' : 'opacity-100'}`}>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
                       {isSpinning ? 'Spinning...' : 'The Winner Is'}
                    </p>
                    <div className="text-4xl md:text-5xl font-extrabold text-purple-600 dark:text-purple-400 mb-6">
                       {winner}
                    </div>
                    {!isSpinning && (
                       <Trophy size={64} className="text-yellow-400 mx-auto animate-bounce" />
                    )}
                 </div>
              ) : (
                 <div className="text-center text-gray-400">
                    <Trophy size={64} className="mx-auto mb-4 opacity-20" />
                    <p>Enter names and click Pick Random</p>
                 </div>
              )}

              <div className="mt-8 w-full space-y-3">
                 <button 
                   onClick={handlePick}
                   disabled={isSpinning}
                   className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                 >
                    {isSpinning ? 'Picking...' : 'Pick Random Winner'}
                 </button>
                 {winner && !isSpinning && (
                    <button 
                      onClick={() => setWinner(null)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                    >
                       <RotateCcw size={16} /> Reset
                    </button>
                 )}
              </div>
           </div>
        </div>
      </div>
      
      <AdBanner />
      <RelatedTools />
    </div>
  );
};

export default RandomPicker;
