"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { allCards } from "@/lib/card-data";
import type { Card, GamePhase, Player, Stat } from "@/lib/types";
import { intelligentAiOpponent } from "@/ai/flows/intelligent-ai-opponent";
import { useToast } from "@/hooks/use-toast";
import { shuffle } from "@/lib/utils";
import GameCard from "@/components/game/GameCard";
import PlayerInfo from "@/components/game/PlayerInfo";
import GameMessage from "@/components/game/GameMessage";
import GameOverScreen from "./GameOverScreen";
import TurnSelectionScreen from "./TurnSelectionScreen";
import { AVAILABLE_STATS } from "@/lib/types";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function GameBoard() {
  const router = useRouter();
  const { toast } = useToast();
  const [player, setPlayer] = useState<Player | null>(null);
  const [ai, setAi] = useState<Player | null>(null);
  const [phase, setPhase] = useState<GamePhase>("initial");
  const [gameMessage, setGameMessage] = useState<string>("Shuffling cards...");
  const [lastChosenStat, setLastChosenStat] = useState<Stat | null>(null);
  const [roundWinner, setRoundWinner] = useState<'player' | 'ai' | 'draw' | null>(null);
  const [turn, setTurn] = useState<'player' | 'ai' | null>(null);

  const [playerName, setPlayerName] = useState<string>("Player");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const name = typeof window !== "undefined" ? localStorage.getItem("playerName") : "Player";
    const adminStatus = typeof window !== "undefined" ? localStorage.getItem('isAdmin') === 'true' : false;

    if (!name) {
      router.push('/login');
    } else {
      setPlayerName(name);
      setIsAdmin(adminStatus);
      initializeGame(name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const initializeGame = useCallback((name: string) => {
    setPhase('initial');
    setGameMessage("Shuffling cards...");
    setRoundWinner(null);
    setLastChosenStat(null);
    setTurn(null);
    const shuffled = shuffle([...allCards]);
    const half = Math.ceil(shuffled.length / 2);
    const playerDeck = shuffled.slice(0, half);
    const aiDeck = shuffled.slice(half);

    setPlayer({ id: "player", name: name, deck: playerDeck });
    setAi({ id: "ai", name: "Intelligent AI", deck: aiDeck });

    setTimeout(() => {
      setPhase("turn_selection");
      setGameMessage("Who will start the game?");
    }, 1000);
  }, []);

  const handleTurnSelection = (starter: 'player' | 'ai') => {
    setTurn(starter);
    if (starter === 'player') {
        setPhase('player_turn');
        setGameMessage('Your turn. Select a stat to challenge.');
    } else {
        setPhase('ai_thinking');
        setGameMessage("AI's turn.");
    }
  };

  const processRoundResult = (winner: 'player' | 'ai' | 'draw', playerCard: Card, aiCard: Card) => {
    setPhase("round_over");

    let newPlayerDeck: Card[], newAiDeck: Card[];
    const currentPlayerDeck = player!.deck;
    const currentAiDeck = ai!.deck;
    let nextTurn: 'player' | 'ai';

    if (winner === 'player') {
      setGameMessage("You win this round!");
      newPlayerDeck = [...currentPlayerDeck.slice(1), playerCard, aiCard];
      newAiDeck = currentAiDeck.slice(1);
      nextTurn = 'player';
    } else if (winner === 'ai') {
      setGameMessage("AI wins this round!");
      newPlayerDeck = currentPlayerDeck.slice(1);
      newAiDeck = [...currentAiDeck.slice(1), aiCard, playerCard];
      nextTurn = 'ai';
    } else {
      setGameMessage("It's a draw! Cards are returned to the back of the decks.");
      newPlayerDeck = [...currentPlayerDeck.slice(1), playerCard];
      newAiDeck = [...currentAiDeck.slice(1), aiCard];
      // On draw, the turn flips
      nextTurn = turn === 'player' ? 'ai' : 'player';
    }
    
    setTurn(nextTurn);
    setPlayer(p => ({...p!, deck: newPlayerDeck}));
    setAi(a => ({...a!, deck: newAiDeck}));

    setTimeout(() => {
      setLastChosenStat(null);
      setRoundWinner(null);

      if (newAiDeck.length === 0) {
        setPhase("game_over");
        setGameMessage(`${player!.name} has won the game!`);
        return;
      }
      if (newPlayerDeck.length === 0) {
        setPhase("game_over");
        setGameMessage(`${ai!.name} has won the game!`);
        return;
      }
      
      const nextPhase = nextTurn === 'player' ? 'player_turn' : 'ai_thinking';
      setPhase(nextPhase);
      setGameMessage(nextPhase === 'player_turn' ? "Your turn. Select a stat." : "AI's turn.");

    }, 2500);
  }

  const handleComparison = async (stat: Stat, playerCard: Card, aiCard: Card) => {
      setLastChosenStat(stat);
      setPhase("comparing");
      setGameMessage(`Comparing ${stat}...`);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const playerValue = playerCard[stat];
      const aiValue = aiCard[stat];
      let winner: 'player' | 'ai' | 'draw' = 'draw';

      if (playerValue > aiValue) {
        winner = 'player';
      } else if (aiValue > playerValue) {
        winner = 'ai';
      }
      
      setRoundWinner(winner);
      
      setTimeout(() => processRoundResult(winner, playerCard, aiCard), 500);
  }

  const handleStatSelection = async (stat: Stat) => {
    if (phase !== "player_turn" || !player || !ai || player.deck.length === 0 || ai.deck.length === 0) return;
    const playerCard = player.deck[0];
    const aiCard = ai.deck[0];
    await handleComparison(stat, playerCard, aiCard);
  };
  
  const handleAiTurn = useCallback(async () => {
    if (!player || !ai || player.deck.length === 0 || ai.deck.length === 0) return;

    setPhase("ai_thinking");
    setGameMessage("AI is choosing a stat...");

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const playerCard = player.deck[0];
    const aiCard = ai.deck[0];
    let chosenStat: Stat;

    try {
        const result = await intelligentAiOpponent({
            aiCard: aiCard,
            playerCard: playerCard,
            availableStats: AVAILABLE_STATS,
        });
        
        chosenStat = AVAILABLE_STATS.includes(result.chosenStat as Stat) 
            ? result.chosenStat as Stat 
            : AVAILABLE_STATS[Math.floor(Math.random() * AVAILABLE_STATS.length)];
        
        setGameMessage(`AI chose ${chosenStat}.`);

    } catch (error) {
        console.error("AI turn error:", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "AI failed to move. A random stat will be chosen.",
        });
        chosenStat = AVAILABLE_STATS[Math.floor(Math.random() * AVAILABLE_STATS.length)];
        setGameMessage(`AI chose ${chosenStat} (randomly).`);
    }
    await handleComparison(chosenStat, playerCard, aiCard);
  }, [player, ai, toast]);
  

  useEffect(() => {
    if (phase === 'ai_thinking' && turn === 'ai') {
      handleAiTurn();
    }
  }, [phase, turn, handleAiTurn]);

  if (!player || !ai) {
    return <div className="text-center"><GameMessage message="Loading Game..." /></div>;
  }
  
  if (phase === 'turn_selection') {
    return <TurnSelectionScreen onSelectTurn={handleTurnSelection} playerName={player.name} aiName={ai.name} />;
  }

  if (phase === 'game_over') {
    const winner = ai.deck.length === 0 ? player : player.deck.length === 0 ? ai : null;
    return <GameOverScreen winner={winner} onPlayAgain={() => initializeGame(playerName)} />;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between p-4 space-y-4 perspective-1000">
       {isAdmin && (
        <div className="absolute top-4 right-4 z-10">
          <Link href="/admin/database-view" passHref>
            <Button variant="ghost" size="icon" title="View Database">
              <Settings className="h-6 w-6 text-primary" />
            </Button>
          </Link>
        </div>
      )}
      <PlayerInfo name={ai.name} cardCount={ai.deck.length} isOpponent />

      <div className="flex-grow w-full flex items-center justify-center space-x-4 md:space-x-8">
        <div className="relative w-1/2 max-w-[280px] aspect-[5/7]">
           {ai.deck.length > 1 && Array.from({ length: Math.min(ai.deck.length -1, 4) }).map((_, i) => (
             <div
                key={i}
                className="absolute w-full h-full rounded-2xl bg-card border-2 border-border shadow-lg"
                style={{ transform: `translate(${-i * 2}px, ${-i * 2}px)` }}
            />
           ))}
            {ai.deck.length > 0 && 
              <GameCard 
                card={ai.deck[0]}
                isFaceDown={phase !== 'comparing' && phase !== 'round_over'}
                isComparing={phase === 'comparing' || phase === 'round_over'}
                lastChosenStat={lastChosenStat}
                roundWinner={roundWinner}
                opponentCard={player.deck[0]}
              />
            }
        </div>
        
        <div className="relative w-1/2 max-w-[280px] aspect-[5/7]">
           {player.deck.length > 1 && Array.from({ length: Math.min(player.deck.length - 1, 4) }).map((_, i) => (
             <div
                key={i}
                className="absolute w-full h-full rounded-2xl bg-card border-2 border-border shadow-lg"
                style={{ transform: `translate(${-i * 2}px, ${-i * 2}px)` }}
            />
           ))}
            {player.deck.length > 0 && 
            <GameCard 
                card={player.deck[0]} 
                isPlayerCard 
                onStatSelect={handleStatSelection} 
                isTurn={phase === 'player_turn'}
                isComparing={phase === 'comparing' || phase === 'round_over'}
                lastChosenStat={lastChosenStat}
                roundWinner={roundWinner}
                opponentCard={ai.deck[0]}
            />}
        </div>
      </div>
      
      <GameMessage message={gameMessage} />

      <PlayerInfo name={player.name} cardCount={player.deck.length} />
    </div>
  );
}
