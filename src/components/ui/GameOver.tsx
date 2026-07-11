import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { RotateCcw, Home } from 'lucide-react';

export const GameOver: React.FC = () => {
  const score = useGameStore((state) => state.score);
  const highScore = useGameStore((state) => state.highScore);
  const resetGame = useGameStore((state) => state.resetGame);
  const setGameState = useGameStore((state) => state.setGameState);

  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-md p-4 z-20 font-mono animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-[#ff0055] drop-shadow-[0_0_20px_rgba(255,0,85,0.8)] mb-2 uppercase" style={{ fontFamily: '"Orbitron", sans-serif' }}>
          Mission Failed
        </h2>
        {isNewHighScore && (
          <div className="inline-block mt-4 px-4 py-1 border border-[#00f3ff] text-[#00f3ff] text-sm font-bold tracking-widest uppercase animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            New High Score!
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 mb-12">
        <span className="text-gray-400 text-sm tracking-[0.2em] uppercase">Final Score</span>
        <span className="text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {score.toString().padStart(6, '0')}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={resetGame}
          className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-[#ff0055]/20 border-2 border-[#ff0055] text-white font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#ff0055] hover:shadow-[0_0_20px_rgba(255,0,85,0.6)] active:scale-95"
        >
          <RotateCcw size={20} />
          <span>Restart</span>
        </button>
        
        <button
          onClick={() => setGameState('MENU')}
          className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-transparent border-2 border-gray-600 text-gray-300 font-bold uppercase tracking-wider transition-all duration-300 hover:border-white hover:text-white hover:bg-white/10 active:scale-95"
        >
          <Home size={20} />
          <span>Menu</span>
        </button>
      </div>
    </div>
  );
};
