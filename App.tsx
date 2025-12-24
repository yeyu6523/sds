
import React, { useState, useMemo } from 'react';
import ParticleSystem from './components/ParticleSystem';
import { AppState } from './types';
import { generateChristmasBlessing } from './services/geminiService';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [state, setState] = useState<AppState>('input');
  const [blessing, setBlessing] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const text = await generateChristmasBlessing(name);
    setBlessing(text);
    setLoading(false);
    setState('transition');
    
    setTimeout(() => {
        setState('display');
    }, 2800);
  };

  // Split blessing text for side-display if needed, or just elegant blocks
  const blessingParts = useMemo(() => {
    if (!blessing) return { left: '', right: '' };
    const mid = Math.floor(blessing.length / 2);
    const splitIndex = blessing.indexOf('，', mid - 10) !== -1 
      ? blessing.indexOf('，', mid - 10) + 1 
      : blessing.indexOf('。', mid - 10) !== -1 
        ? blessing.indexOf('。', mid - 10) + 1 
        : mid;
    
    return {
      left: blessing.substring(0, splitIndex),
      right: blessing.substring(splitIndex)
    };
  }, [blessing]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden selection:bg-pink-500/30">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-[-1] pointer-events-none" />
      
      <ParticleSystem state={state} userName={name} />

      {/* Input Step */}
      {state === 'input' && (
        <div className="z-10 bg-black/40 backdrop-blur-3xl p-12 md:p-16 rounded-[3rem] border border-white/5 shadow-2xl transition-all animate-in fade-in zoom-in duration-1000 max-w-lg w-full mx-4 text-center">
          <div className="mb-12">
            <h1 className="text-7xl font-chinese font-bold mb-6 bg-gradient-to-r from-pink-400 via-yellow-200 to-white bg-clip-text text-transparent drop-shadow-lg">
              圣诞快乐
            </h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.4em] font-light italic">Technological Christmas Magic</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="键入您的姓名以解构惊喜..."
                className="w-full bg-white/5 border-b-2 border-white/10 rounded-none px-4 py-6 text-3xl text-white outline-none focus:border-pink-500/50 transition-all placeholder:text-white/10 text-center font-chinese"
                autoFocus
              />
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-pink-500 group-focus-within:w-full transition-all duration-700" />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group py-6 rounded-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <span className="relative z-10 text-white font-chinese text-2xl flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  编译惊喜中...
                </span>
              ) : (
                <span className="relative z-10 text-white font-chinese text-2xl tracking-widest group-hover:scale-110 transition-transform inline-block">
                  执行代码 · 开启奇迹
                </span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Transition Stage */}
      {state === 'transition' && (
        <div className="z-20 text-center">
            <h2 className="text-4xl font-chinese text-white/80 animate-pulse tracking-[0.5em]">
              正在为您构建数字森林...
            </h2>
            <div className="mt-4 flex justify-center gap-2">
               {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}
            </div>
        </div>
      )}

      {/* Final Display Step - Repositioned to the sides */}
      {state === 'display' && (
        <div className="z-10 fixed inset-0 flex items-center justify-between px-8 md:px-20 pointer-events-none">
          
          {/* Left Side Message Part */}
          <div className="max-w-[320px] md:max-w-[400px] bg-black/30 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-xl pointer-events-auto transform animate-in slide-in-from-left-40 duration-1000">
            <div className="text-left space-y-6">
                <div className="inline-block border-l-4 border-pink-500 pl-4 mb-4">
                  <h3 className="text-2xl font-chinese font-bold text-pink-400">
                    Hello, {name}
                  </h3>
                </div>
                <div className="text-xl md:text-2xl text-white/90 leading-relaxed font-chinese tracking-widest whitespace-pre-wrap">
                    {blessingParts.left}
                </div>
            </div>
          </div>

          {/* Right Side Message Part */}
          <div className="max-w-[320px] md:max-w-[400px] bg-black/30 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-xl pointer-events-auto transform animate-in slide-in-from-right-40 duration-1000 flex flex-col items-end">
            <div className="text-right space-y-6 w-full">
                <div className="text-xl md:text-2xl text-white/90 leading-relaxed font-chinese tracking-widest whitespace-pre-wrap mb-8">
                    {blessingParts.right}
                </div>
                <div className="border-r-4 border-yellow-400 pr-4 mt-8 inline-block">
                   <p className="text-xl text-yellow-500 font-chinese font-bold tracking-widest">
                     Merry Christmas
                   </p>
                </div>
            </div>
            
            <div className="mt-10 flex w-full justify-end">
                <button 
                    onClick={() => window.location.reload()}
                    className="group flex items-center gap-3 text-white/20 hover:text-white/50 transition-all text-xs font-chinese"
                >
                    重启魔法循环
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-180 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Labels */}
      <div className="fixed top-8 left-8 text-white/10 font-mono text-[10px] tracking-widest hidden md:block select-none z-0">
        01001101 01100101 01110010 01110010 01111001<br/>
        01011000 01101101 01100001 01110011
      </div>
      
      <div className="fixed top-8 right-8 text-white/20 font-chinese text-sm tracking-widest select-none z-0 px-4 py-2 border border-white/5 rounded-full backdrop-blur-md">
        专属于程序员的浪漫
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/5 text-[12vw] font-chinese font-black tracking-tighter select-none pointer-events-none whitespace-nowrap z-0">
        MERRY CHRISTMAS
      </div>
    </div>
  );
};

export default App;
