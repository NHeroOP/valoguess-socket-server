import type {
  PendingQuestion,
  PlayerState,
  QuestionHistory,
  Room,
  RoomState,
  Settings,
} from "@/shared/consts/types.js";

export interface RoomPlayerDTO {
  id: string;
  username: string;
  ready: boolean;
}

export interface RoomSpectatorDTO {
  id: string;
  username: string;
}

export interface RoomDTO {
  id: string;
  state: RoomState;
  isHost: boolean;
  players: RoomPlayerDTO[];
  spectators: RoomSpectatorDTO[];
  settings: Settings;
  createdAt: number;
  game?: GameStateDTO;
}

export interface GameStateDTO {
  startedAt: number;
  currentTurn: string;
  turnNumber: number;

  pendingQuestion?: PendingQuestion | undefined;
  history: QuestionHistory[];

  playerStates: Record<string, PlayerStateDTO>;

  winnerId?: string | undefined;
  endedAt?: number | undefined;
}

export interface PlayerStateDTO {
  secretAgent: string | null;
  guess: string | null;
  nosRemaining: number;
  guessesRemaining: number;
}

export function roomMapper(
  room: Room,
  playerId: string,
): RoomDTO {
  const currentPlayer = room.players.find(
    (player) => player.id === playerId,
  );

  if (!currentPlayer) {
    throw new Error("Current player not found.");
  }

  const roomDto: RoomDTO = {
    id: room.id,
    state: room.state,
    isHost: room.hostId === currentPlayer.id,
    settings: room.settings,
    createdAt: room.createdAt,

    players: room.players.map((player) => ({
      id: player.id,
      username: player.username,
      ready: player.ready,
    })),

    spectators: room.spectators.map((spectator) => ({
      id: spectator.id,
      username: spectator.username,
    })),
  };

  if (room.game) {
    return gameMapper(room, roomDto, currentPlayer.id);
  }

  return roomDto;
}

function gameMapper(room: Room, roomDto: RoomDTO, currentPlayerId: string): RoomDTO {
  if (!room.game) {
    throw new Error("Game state is missing.");
  }
  
  const playerStates: Record<string, PlayerStateDTO> = {};

  for (const [playerId, state] of Object.entries(
    room.game.playerStates,
  )) {
    playerStates[playerId] = mapPlayerState(
      playerId,
      state,
      currentPlayerId,
    );
  }

  roomDto.game = {
    startedAt: room.game.startedAt,
    currentTurn: room.game.currentTurn,
    turnNumber: room.game.turnNumber,

    pendingQuestion: room.game.pendingQuestion,
    history: room.game.history,

    playerStates,

    winnerId: room.game.winnerId,
    endedAt: room.game.endedAt,
  };

  return roomDto;
}

function mapPlayerState(
  playerId: string,
  state: PlayerState,
  currentPlayerId: string,
): PlayerStateDTO {
  return {
    secretAgent:
      playerId === currentPlayerId
        ? state.secretAgent
        : null,

    guess: state.guess,
    nosRemaining: state.nosRemaining,
    guessesRemaining: state.guessesRemaining,
  };
}