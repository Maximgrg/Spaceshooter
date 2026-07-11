import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Play, Volume2, VolumeX, Trophy } from 'lucide-react';

export const Menu: React.FC = () => {
  const setGameState = useGameStore((state) => state.setGameState);
  const highScore = useGameStore((state) => state.highScore);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 z-10 font-mono">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#00f3ff] to-[#ff0055] drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] mb-4 uppercase" style={{ fontFamily: '"Orbitron", sans-serif' }}>
          Nebula Strike
        </h1>
        <p className="text-[#00f3ff] text-sm md:text-base tracking-[0.2em] opacity-80 uppercase">
          Defend The Sector
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-xs">
        <button
          onClick={() => setGameState('PLAYING')}
          className="group relative flex items-center justify-center gap-3 w-full py-4 px-8 bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] text-xl font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#00f3ff]/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] active:scale-95"
        >
          <Play size={24} className="group-hover:animate-pulse" />
          <span>Start Game</span>
          
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff0055] transition-all group-hover:w-full group-hover:h-full group-hover:opacity-0" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff0055] transition-all group-hover:w-full group-hover:h-full group-hover:opacity-0" />
        </button>

        <div className="flex items-center justify-between px-6 py-4 bg-[#050510]/80 border border-[#ff0055]/30 rounded-lg">
          <div className="flex items-center gap-2 text-[#ff0055]">
            <Trophy size={20} />
            <span className="text-sm font-semibold tracking-wider">HIGH SCORE</span>
          </div>
          <span className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
            {highScore}
          </span>
        </div>

        <button
          onClick={toggleSound}
          className="flex items-center justify-center gap-2 py-3 px-6 text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest mt-4"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
};
