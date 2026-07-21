export interface Settings {
  maxNos: number;
  maxRounds: number;
  timePerRound: number;
}

export const DefaultSettings: Settings = {
  maxNos: 5,
  maxRounds: -1,
  timePerRound: 60,
}

export interface Player {
  id: string;
  username: string;
  socketId: string;
  reconnectToken: string | null;
}

export interface Spectator {
  id: string;
  username: string;
  socketId: string;
}

export type RoomState = "waiting" | "playing" | "finished";

export interface Room {
  id: string;
  state: RoomState;
  hostId: string;
  players: Player[];
  spectators: Spectator[];
  settings: Settings;
  game?: GameState;
  createdAt: number;
}

export interface GameState {
  startedAt: number;
  currentTurn: string;
  turnNumber: number;
  pendingQuestion?: PendingQuestion;
  history: QuestionHistory[];
  playerStates: Record<Player["id"], PlayerState>;
  winnerId?: string;
  endedAt?: number;
}

export interface PlayerState {
  secretAgent: string;
  guess: string | null;
  isGuessCorrect?: boolean;
  nosRemaining: number;
  guessesRemaining: number;
}

export interface PendingQuestion {
  askedBy: string;
  targetPlayer: string;
  questionId: string;
}

export interface QuestionHistory {
  askedBy: string;
  targetPlayer: string;
  questionId: string;
  answer: "yes" | "no";
  timestamp: number;
}