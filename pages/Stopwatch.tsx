
import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { AdBanner } from '../components/Layout';
import { RelatedTools } from '../components/RelatedTools';

const Stopwatch: React.FC = () => {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
  
  // Stopwatch State
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  // Timer State
  const [timerInput, setTimerInput] = useState(300); // 5 mins
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Refs for intervals
  const stopwatchRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Stopwatch Logic
  useEffect(() => {
    if (isRunning) {
      const start = Date.now() - time;
      stopwatchRef.current = window.setInterval(() => {
        setTime(Date.now() - start);
      }, 10);
    } else {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    }
    return () => { if (stopwatchRef.current) clearInterval(stopwatchRef.current); };
  }, [isRunning]);

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Play sound or alert here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, timeLeft]);

  // Formatters
  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${centi.toString().padStart(2, '0')}`;
  };

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-center mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-fit mx-auto">
           <button 
             onClick={() => setMode('stopwatch')} 
             className={`px-6 py-2 rounded-md font-bold transition-all ${mode === 'stopwatch' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
           >
             Stopwatch
           </button>
           <button 
             onClick={() => setMode('timer')} 
             className={`px-6 py-2 rounded-md font-bold transition-all ${mode === 'timer' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
           >
             Timer
           </button>
        </div>

        <div className="text-center">
           {mode === 'stopwatch' ? (
             <div className="space-y-8">
                <div className="text-7xl sm:text-9xl font-mono font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">
                   {formatTime(time)}
                </div>
                
                <div className="flex justify-center gap-4">
                   <button 
                     onClick={() => setIsRunning(!isRunning)} 
                     className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                   >
                      {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                   </button>
                   <button 
                     onClick={() => { setIsRunning(false); setTime(0); setLaps([]); }}
                     className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                   >
                      <RotateCcw size={28} />
                   </button>
                   <button 
                     onClick={() => setLaps([time, ...laps])}
                     disabled={!isRunning}
                     className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                   >
                      <Flag size={28} />
                   </button>
                </div>

                {laps.length > 0 && (
                   <div className="max-w-sm mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-sm">
                         <thead className="bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold sticky top-0">
                            <tr>
                               <th className="p-3">Lap</th>
                               <th className="p-3 text-right">Time</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {laps.map((lap, i) => (
                               <tr key={i}>
                                  <td className="p-3 font-medium text-gray-600 dark:text-gray-400">#{laps.length - i}</td>
                                  <td className="p-3 text-right font-mono text-gray-900 dark:text-white">{formatTime(lap)}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                )}
             </div>
           ) : (
             <div className="space-y-8">
                <div className="text-7xl sm:text-9xl font-mono font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">
                   {formatTimer(timeLeft)}
                </div>

                {!isTimerRunning && (
                   <div className="flex gap-2 justify-center">
                      {[1, 5, 10, 15, 30, 60].map(m => (
                         <button 
                           key={m}
                           onClick={() => { setTimerInput(m * 60); setTimeLeft(m * 60); }}
                           className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                         >
                            {m}m
                         </button>
                      ))}
                   </div>
                )}

                <div className="flex justify-center gap-4">
                   <button 
                     onClick={() => setIsTimerRunning(!isTimerRunning)} 
                     className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${isTimerRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
                   >
                      {isTimerRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                   </button>
                   <button 
                     onClick={() => { setIsTimerRunning(false); setTimeLeft(timerInput); }}
                     className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                   >
                      <RotateCcw size={28} />
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
      
      <AdBanner />
      <RelatedTools />
    </div>
  );
};

export default Stopwatch;
