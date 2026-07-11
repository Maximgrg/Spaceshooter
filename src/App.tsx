import React from 'react';
import { GameCanvas } from './components/GameCanvas';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white selection:bg-[#ff0055]">
      <GameCanvas />
    </div>
  );
}

export default App;
