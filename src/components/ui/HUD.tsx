import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const HUD: React.FC = () => {
  const score = useGameStore((state) => state.score);

  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10 font-mono">
      <div className="flex flex-col">
        <span className="text-[#00f3ff] text-xs font-bold tracking-[0.2em] uppercase opacity-70">
          Score
        </span>
        <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
          {score.toString().padStart(6, '0')}
        </span>
      </div>
      
      {/* Decorative HUD elements */}
      <div className="flex flex-col items-end opacity-50">
        <div className="w-16 h-1 bg-[#00f3ff] mb-1 shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
        <div className="w-8 h-1 bg-[#00f3ff] shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
      </div>
    </div>
  );
};
