import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameEngine } from '../game/engine';
import { Menu } from './ui/Menu';
import { HUD } from './ui/HUD';
import { GameOver } from './ui/GameOver';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const gameState = useGameStore((state) => state.gameState);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize engine
    engineRef.current = new GameEngine(canvasRef.current);
    
    // Initial draw for background (stars)
    engineRef.current.loop(performance.now());
    
    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resize();
        engineRef.current.initStars();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;

    if (gameState === 'PLAYING') {
      engineRef.current.start();
    } else if (gameState === 'GAMEOVER') {
      // Game over logic handled inside engine's checkCollisions, but we ensure it stops
      engineRef.current.stop();
    }
  }, [gameState]);

  // Touch and Mouse handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING' || !engineRef.current) return;
    
    // e.clientX/Y are relative to viewport, which matches our bounding rect
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    engineRef.current.setTargetPosition(x, y);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050510]">
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
      />
      
      {gameState === 'MENU' && <Menu />}
      {gameState === 'PLAYING' && <HUD />}
      {gameState === 'GAMEOVER' && <GameOver />}
    </div>
  );
};
