import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";
import type { Player } from "@/lib/types";
import { useRouter } from "next/navigation";

type GameOverScreenProps = {
  winner: Player | null;
  onPlayAgain: () => void;
};

export default function GameOverScreen({ winner, onPlayAgain }: GameOverScreenProps) {
  const router = useRouter();

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-500">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Crown className="w-16 h-16 mx-auto text-yellow-400" />
          <CardTitle className="text-4xl font-headline mt-4">
            {winner?.id === 'player' ? "You Won!" : "Game Over"}
          </CardTitle>
          <CardDescription className="text-lg">
            {winner ? `${winner.name} is the champion!` : "The game has ended."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button className="w-full" onClick={onPlayAgain}>Play Again</Button>
          <Button variant="secondary" className="w-full" onClick={() => router.push('/main-menu')}>
            Back to Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
