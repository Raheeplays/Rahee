import type { CardStats } from "@/ai/flows/intelligent-ai-opponent";

export type Stat = 'No' | 'Speed' | 'Skill' | 'Power' | 'XP';

export const AVAILABLE_STATS: Stat[] = ['No', 'Speed', 'Skill', 'Power', 'XP'];

export type Card = CardStats & {
  id: number;
  image: string;
  imageHint: string;
  description: string;
};

export type Player = {
  id: 'player' | 'ai';
  name: string;
  deck: Card[];
};

export type GamePhase = 
  | 'initial'
  | 'turn_selection'
  | 'player_turn'
  | 'ai_thinking'
  | 'comparing'
  | 'round_over'
  | 'game_over';
