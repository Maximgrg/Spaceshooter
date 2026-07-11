import { create } from 'zustand';

type GameState = 'MENU' | 'PLAYING' | 'GAMEOVER';

interface GameStore {
  gameState: GameState;
  score: number;
  highScore: number;
  soundEnabled: boolean;
  setGameState: (state: GameState) => void;
  setScore: (score: number) => void;
  setHighScore: (score: number) => void;
  toggleSound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'MENU',
  score: 0,
  highScore: parseInt(localStorage.getItem('spaceShooterHighScore') || '0', 10),
  soundEnabled: true,
  setGameState: (state) => set({ gameState: state }),
  setScore: (score) => set({ score }),
  setHighScore: (score) => {
    localStorage.setItem('spaceShooterHighScore', score.toString());
    set({ highScore: score });
  },
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  resetGame: () => set({ score: 0, gameState: 'PLAYING' }),
}));
