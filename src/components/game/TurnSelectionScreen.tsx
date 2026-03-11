"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Bot } from "lucide-react";

type TurnSelectionScreenProps = {
  onSelectTurn: (starter: 'player' | 'ai') => void;
  playerName: string;
  aiName: string;
};

export default function TurnSelectionScreen({ onSelectTurn, playerName, aiName }: TurnSelectionScreenProps) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-500">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-headline mt-4">
            Choose Who Starts
          </CardTitle>
          <CardDescription className="text-lg">
            Select which player will take the first turn.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button className="w-full" size="lg" onClick={() => onSelectTurn('player')}>
            <User className="mr-2" />
            {playerName} Starts
          </Button>
          <Button variant="secondary" className="w-full" size="lg" onClick={() => onSelectTurn('ai')}>
             <Bot className="mr-2" />
            {aiName} Starts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
