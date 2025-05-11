import { useEffect, useState } from "react";
import { useGameState } from "./useGameState";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreBoard } from "./ScoreBoard";
import { InfoPanel } from "./InfoPanel";

const GameUI = () => {
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const { score, moleculesCollected, electricityGenerated } = useGameState();
  const { toggleMute, isMuted } = useAudio();
  
  // Check for key presses for info panel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "KeyI") {
        setShowInfoPanel(prev => !prev);
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto">
        <ScoreBoard 
          score={score}
          moleculesCollected={moleculesCollected}
          electricityGenerated={electricityGenerated}
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="bg-background/80 backdrop-blur-sm" 
            onClick={() => setShowInfoPanel(prev => !prev)}
          >
            {showInfoPanel ? "Close Info" : "Science Info"}
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-background/80 backdrop-blur-sm" 
            onClick={toggleMute}
          >
            {isMuted ? "Unmute 🔇" : "Mute 🔊"}
          </Button>
        </div>
      </div>
      
      {/* Info panel */}
      {showInfoPanel && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-auto">
          <InfoPanel onClose={() => setShowInfoPanel(false)} />
        </div>
      )}
      
      {/* Controls hint */}
      <Card className="absolute bottom-4 left-4 p-3 bg-background/80 backdrop-blur-sm pointer-events-none">
        <div className="text-sm font-medium">
          <p>WASD/Arrows: Move</p>
          <p>Space: Jump</p>
          <p>E: Interact</p>
          <p>I: Science Info</p>
        </div>
      </Card>
      
      {/* Game hints */}
      <div className="absolute bottom-4 right-4 max-w-xs text-sm bg-black/70 text-white p-3 rounded-md">
        <p>Collect blue water molecules and bring them to the generator to produce electricity!</p>
      </div>
    </div>
  );
};

export default GameUI;
