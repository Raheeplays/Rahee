import { Layers, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

type PlayerInfoProps = {
  name: string;
  cardCount: number;
  isOpponent?: boolean;
};

export default function PlayerInfo({ name, cardCount, isOpponent = false }: PlayerInfoProps) {
  return (
    <div className={cn("w-full max-w-md mx-auto p-2 rounded-lg bg-card/50 backdrop-blur-sm border", isOpponent ? "mb-auto" : "mt-auto")}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-semibold">
           {isOpponent ? <Bot className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-primary" />}
          <span>{name}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Layers className="w-4 h-4" />
          <span>{cardCount} Cards</span>
        </div>
      </div>
    </div>
  );
}
