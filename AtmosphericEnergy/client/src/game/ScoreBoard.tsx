import { Card } from "@/components/ui/card";

interface ScoreBoardProps {
  score: number;
  moleculesCollected: number;
  electricityGenerated: number;
}

export const ScoreBoard = ({ score, moleculesCollected, electricityGenerated }: ScoreBoardProps) => {
  return (
    <Card className="bg-background/80 backdrop-blur-sm p-3 min-w-[200px]">
      <div className="grid grid-cols-2 gap-2">
        <div className="text-sm text-muted-foreground">Score:</div>
        <div className="text-sm font-bold text-right">{score}</div>
        
        <div className="text-sm text-muted-foreground">Water Molecules:</div>
        <div className="text-sm font-bold text-right">{moleculesCollected}</div>
        
        <div className="text-sm text-muted-foreground">Electricity:</div>
        <div className="text-sm font-bold text-right">{electricityGenerated} kWh</div>
      </div>
    </Card>
  );
};
