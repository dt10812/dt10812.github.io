import { create } from "zustand";
import * as THREE from "three";

interface GameState {
  // Game stats
  score: number;
  moleculesCollected: number;
  electricityGenerated: number;
  
  // Player state
  playerPosition: THREE.Vector3 | null;
  interactPressed: boolean;
  
  // Actions
  updateScore: (points: number) => void;
  addMolecule: (count: number) => void;
  addElectricity: (amount: number) => void;
  setPlayerPosition: (position: THREE.Vector3) => void;
  setInteractPressed: (pressed: boolean) => void;
}

export const useGameState = create<GameState>((set) => ({
  // Initial game stats
  score: 0,
  moleculesCollected: 0,
  electricityGenerated: 0,
  
  // Initial player state
  playerPosition: null,
  interactPressed: false,
  
  // Actions
  updateScore: (points) => set((state) => ({ score: state.score + points })),
  
  addMolecule: (count) => set((state) => ({ 
    moleculesCollected: state.moleculesCollected + count 
  })),
  
  addElectricity: (amount) => set((state) => ({ 
    electricityGenerated: state.electricityGenerated + amount 
  })),
  
  setPlayerPosition: (position) => set({ playerPosition: position }),
  
  setInteractPressed: (pressed) => set({ interactPressed: pressed }),
}));

// Listen for the 'E' key to set interact
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE') {
    useGameState.getState().setInteractPressed(true);
    console.log("Interact key pressed");
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'KeyE') {
    useGameState.getState().setInteractPressed(false);
  }
});
