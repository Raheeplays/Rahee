import Image from "next/image";
import { Diamond } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Card, Stat } from "@/lib/types";

type GameCardProps = {
  card: Card;
  isFaceDown?: boolean;
  isPlayerCard?: boolean;
  onStatSelect?: (stat: Stat) => void;
  isTurn?: boolean;
  isComparing?: boolean;
  lastChosenStat?: Stat | null;
  roundWinner?: 'player' | 'ai' | 'draw' | null;
  opponentCard?: Card;
};

const STATS_ORDER: Stat[] = ['No', 'Speed', 'Skill', 'Power', 'XP'];

export default function GameCard({ card, isFaceDown = false, isPlayerCard = false, onStatSelect, isTurn = false, isComparing = false, lastChosenStat, roundWinner, opponentCard }: GameCardProps) {
  const isFlipped = !isFaceDown;

  const StatItem = ({ stat }: { stat: Stat }) => {
    const value = card[stat];
    const opponentValue = opponentCard?.[stat];
    const isSelected = lastChosenStat === stat;
    const isWinner = (isPlayerCard && roundWinner === 'player') || (!isPlayerCard && roundWinner === 'ai');
    const isLoser = (isPlayerCard && roundWinner === 'ai') || (!isPlayerCard && roundWinner === 'player');
  
    const wrapperClasses = cn(
      "flex flex-col items-center transition-all duration-300",
      isTurn && isPlayerCard && "cursor-pointer hover:opacity-80",
      isSelected && "ring-2",
      isSelected && isComparing && roundWinner === 'draw' && "ring-yellow-500",
      isSelected && isComparing && isWinner && "ring-green-500 scale-110",
      isSelected && isComparing && isLoser && "ring-red-500 opacity-70",
      isSelected && !isComparing && "ring-sky-500"
    );

    const Wrapper = isPlayerCard && isTurn ? 'button' : 'div';

    return (
      <Wrapper
        onClick={() => isTurn && onStatSelect?.(stat)}
        disabled={isPlayerCard ? !isTurn : undefined}
        className={cn("text-center focus:outline-none group select-none w-full rounded-md overflow-hidden", wrapperClasses)}
      >
        <div className="w-full bg-sky-500/90 text-white text-[10px] font-bold tracking-wider uppercase p-1">{stat}</div>
        <div className="w-full bg-black text-white p-1">
            <span className="font-bold text-sm">{value}</span>
            {isComparing && isSelected && opponentValue !== undefined && isPlayerCard && (
              <span className={cn("text-xs font-bold opacity-0 transition-opacity duration-500 delay-300 block",
                (isComparing || isSelected) && "opacity-100",
                isWinner ? "text-green-500" : isLoser ? "text-red-400" : "text-yellow-400"
              )}>
                {value > opponentValue ? `+${value - opponentValue}` : value - opponentValue}
              </span>
            )}
        </div>
      </Wrapper>
    );
  };

  const symbolText = card.symbol.replace(/[0-9]/g, '').trim();
  const numberText = card.symbol.replace(/[^0-9]/g, '');

  return (
    <div className="w-full h-full card-flip-container absolute">
      <div className={cn("card-flipper w-full h-full", isFlipped && "flipped")}>
        {/* Card Back */}
        <div className="card-back w-full h-full">
            <div className="w-full h-full rounded-2xl bg-card border-2 border-primary/50 flex items-center justify-center p-4 flex-col gap-2 shadow-2xl shadow-primary/20">
                <Diamond className="w-16 h-16 text-primary animate-pulse" />
                <h3 className="font-headline text-2xl font-bold tracking-tighter text-primary">Rahee Cards</h3>
            </div>
        </div>

        {/* Card Front */}
        <div className="card-front w-full h-full">
            <div className="w-full h-full rounded-2xl bg-slate-200 border-2 border-gray-300 overflow-hidden flex flex-col shadow-lg text-black">
                <div className="absolute inset-0">
                    <Image
                        src={card.image}
                        alt={`Background image of ${card.name}`}
                        fill
                        className="opacity-20 blur-sm object-cover"
                        data-ai-hint={card.imageHint}
                    />
                     <div className="absolute inset-0 bg-slate-200/60"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="text-center bg-sky-500/90 py-1 shadow-md">
                        <h2 className="font-headline text-lg font-bold text-white tracking-wider">RAHEE CARDS</h2>
                    </div>

                    <div className="absolute left-1.5 top-1.5 bg-white text-black w-10 h-12 rounded-md flex flex-col items-center justify-center font-bold shadow-md border-2 border-gray-400">
                         {symbolText.length === 1 ? (
                            <>
                                <span className="text-2xl">{symbolText}</span>
                                {numberText && <span className="text-lg leading-none">{numberText}</span>}
                            </>
                        ) : (
                            <span className="text-[10px] leading-tight text-center px-1 font-semibold">{symbolText}</span>
                        )}
                    </div>

                    <div className="flex-grow flex flex-col items-center justify-start p-2 pt-4">
                        <div className="relative w-40 h-40">
                            <div className="absolute -inset-1.5 rounded-full bg-white shadow-inner"></div>
                            <Image
                                src={card.image}
                                alt={`Image of ${card.name}`}
                                width={200}
                                height={200}
                                className="object-cover rounded-full relative shadow-lg border-4 border-white aspect-square"
                                data-ai-hint={card.imageHint}
                            />
                        </div>
                        
                        <h3 className="font-headline text-2xl font-bold text-center mt-2 text-black tracking-wide">{card.name.toUpperCase()}</h3>

                        <div className="w-full bg-black/50 mt-2 rounded-lg p-0.5">
                            <div className="grid grid-cols-5 gap-0.5">
                                {STATS_ORDER.map((stat) => (
                                    <StatItem key={stat} stat={stat} />
                                ))}
                            </div>
                        </div>

                        <p className="text-[10px] text-center text-gray-800 mt-2 px-2 leading-tight flex-grow">
                            {card.description}
                        </p>
                    </div>

                    <div className="text-center text-[9px] p-1 text-gray-600 font-semibold">
                        ALL RIGHTS RESERVED © RAHEE CARDS
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
