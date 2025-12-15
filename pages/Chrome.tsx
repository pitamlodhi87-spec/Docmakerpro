
import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRightLeft, Trash2, ArrowDown } from 'lucide-react';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const Chrome: React.FC = () => {
  // Sum Tool State
  const [inputNumbers, setInputNumbers] = useState('');
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  // Unit Tool State (PX to REM)
  const [unitVal, setUnitVal] = useState<number>(16);
  const [baseSize, setBaseSize] = useState<number>(16);
  const [remVal, setRemVal] = useState<string>('1');

  useEffect(() => {
    // Calculate Sum
    const nums = inputNumbers.split(/[\n, ]+/).filter(n => n.trim() !== '').map(Number).filter(n => !isNaN(n));
    const sum = nums.reduce((a, b) => a + b, 0);
    setTotal(sum);
    setCount(nums.length);
  }, [inputNumbers]);

  useEffect(() => {
    // Calculate Unit
    if (!isNaN(unitVal) && baseSize > 0) {
        setRemVal((unitVal / baseSize).toFixed(4).replace(/\.?0+$/, ''));
    }
  }, [unitVal, baseSize]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       {/* Header */}
       <div className="text-center py-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            <span className="text-chrome-blue">C</span>
            <span className="text-chrome-red">h</span>
            <span className="text-chrome-yellow">r</span>
            <span className="text-chrome-green">o</span>
            <span className="text-chrome-blue">m</span>
            <span className="text-chrome-red">e</span> Tools
          </h1>
          <p className="text-gray-500">Essential utilities for quick calculations and conversions.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Adder Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
             <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                <div className="p-2 bg-chrome-blue/10 rounded-lg text-chrome-blue">
                   <Calculator size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">The Adder</h2>
             </div>
             
             <div className="space-y-4 flex-grow">
                <div>
                   <label className="block text-sm font-medium text-gray-600 mb-2">Enter Numbers (comma or newline separated)</label>
                   <textarea
                      value={inputNumbers}
                      onChange={(e) => setInputNumbers(e.target.value)}
                      className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chrome-blue focus:border-chrome-blue resize-none font-mono text-gray-700"
                      placeholder={`10\n20.5\n30`}
                   />
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Count</p>
                      <p className="text-lg font-bold text-gray-700">{count}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold">Total Sum</p>
                      <p className="text-3xl font-bold text-chrome-blue">{total.toLocaleString()}</p>
                   </div>
                </div>
             </div>
             
             <button 
               onClick={() => setInputNumbers('')}
               className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-red-500 flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-red-100 rounded-lg"
             >
                <Trash2 size={16} /> Clear Input
             </button>
          </div>

          {/* Unit Converter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
             <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                <div className="p-2 bg-chrome-green/10 rounded-lg text-chrome-green">
                   <ArrowRightLeft size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Unit Converter (PX to REM)</h2>
             </div>

             <div className="space-y-6 flex-grow">
                <div>
                   <label className="block text-sm font-medium text-gray-600 mb-2">Root Font Size (px)</label>
                   <input 
                      type="number" 
                      value={baseSize}
                      onChange={(e) => setBaseSize(parseFloat(e.target.value))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chrome-green focus:border-chrome-green"
                   />
                </div>

                <div className="relative bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pixels (px)</label>
                      <input 
                         type="number" 
                         value={unitVal}
                         onChange={(e) => setUnitVal(parseFloat(e.target.value))}
                         className="w-full p-3 bg-white border border-gray-200 rounded-xl text-lg font-bold text-gray-800 focus:ring-2 focus:ring-chrome-green focus:border-chrome-green"
                      />
                   </div>
                   
                   <div className="flex justify-center -my-2 relative z-10">
                      <div className="bg-white p-2 rounded-full shadow-sm border border-gray-200">
                         <ArrowDown size={16} className="text-gray-400" />
                      </div>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">REM</label>
                      <input 
                         type="text" 
                         readOnly
                         value={remVal}
                         className="w-full p-3 bg-white border border-gray-200 rounded-xl text-lg font-bold text-chrome-green"
                      />
                   </div>
                </div>
                
                <p className="text-sm text-gray-500 text-center">
                   Useful for responsive web design calculations.
                </p>
             </div>
          </div>
       </div>

       <AdBanner />
       
       <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Chrome Tools</h2>
          <p>
             This utility page provides quick access to common mathematical and unit conversion tasks. 
             Whether you are a developer calculating layout sizes or an accountant summing up a quick list of expenses, 
             the <strong>Chrome Tools</strong> suite is designed for speed and simplicity.
          </p>
          <h3>The Adder</h3>
          <p>
             Simply paste a list of numbers (from Excel, a text file, or just typed manually) into the text area. 
             The tool automatically ignores text and sums up all the valid numbers it finds.
          </p>
          <h3>Unit Converter</h3>
          <p>
             Convert Pixels to REM units instantly. This is essential for modern web development to ensure accessibility 
             and responsive typography. The default root size is 16px, but you can adjust it to match your framework.
          </p>
       </article>

       <RelatedTools />
    </div>
  );
};

export default Chrome;
