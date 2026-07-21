import { getRoomById, saveRoom } from "../room/service.js";

import { AppError } from "@/shared/utils/error.js";
import { AGENTS } from "@/shared/consts/agents.js";
import type { Player, Room } from "@/shared/consts/types.js";
import { clearTurnTimer, restartTurnTimer, startTurnTimer } from "./timer.js";

/*
  Todo: Change guessRemaining to a number that can be set in the settings, and not just 1.
  in assignSecretAgents function
*/

function getRandomAgent(): string {
  const randomIndex = Math.floor(Math.random() * AGENTS.length);
  return AGENTS[randomIndex]!.id;
}


export async function startGame(roomId: string): Promise<Room> {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  if (room.state !== "waiting") {
    throw new AppError("Game cannot be started");
  }
  
  if (room.players.length < 2) {
    throw new AppError("Not enough players to start the game");
  }

  const currentTurn = room.players[Math.floor(Math.random() * 2)]!.id;

  room.state = "playing";
  room.game = {
    startedAt: Date.now(),
    currentTurn,
    turnNumber: 1,
    history: [],
    playerStates: {},
  };

  for (const player of room.players) {
    const secretAgent = getRandomAgent();
    room.game.playerStates[player.id] = {
      secretAgent,
      guess: null,
      nosRemaining: room.settings.maxNos,
      guessesRemaining: 1,
    };
  }

  startTurnTimer(room.id, room.settings.timePerRound)

  await saveRoom(room);
  return room;
}


export async function changeTurn(roomIdentifier: string | Room): Promise<Room> {

  let room =
    typeof roomIdentifier === "string"
      ? await getRoomById(roomIdentifier)
      : roomIdentifier;

  if (!room) {
    throw new AppError("Room not found");
  }

  if (room.state !== "playing") {
    throw new AppError("Game is not currently in progress");
  }

  if (!room.game) {
    throw new AppError("Game state is missing");
  }

  const currentTurn = room.game.currentTurn;
  const nextTurnPlayer = room.players.find((player) => player.id !== currentTurn);
  if (!nextTurnPlayer) {
    throw new AppError("Next turn player not found");
  }
  
  room.game.currentTurn = nextTurnPlayer.id;
  room.game.turnNumber++;
  
  restartTurnTimer(room.id, room.settings.timePerRound);

  await saveRoom(room);
  return room;
}



// export async function resetGame(roomId: string): Promise<Room> {
//   const room = await getRoomById(roomId);

//   if (!room) {
//     throw new AppError("Room not found");
//   }

//   room.state = "waiting";
//   delete room.game;

//   for (const player of room.players) {
//     player.ready = false;
//   }

//   await saveRoom(room);
//   return room;
// }

export async function getCurrentPlayer(roomId: string, socketId: string): Promise<Player> {

  const room = await getRoomById(roomId);
  
  if (!room) {
    throw new AppError("Room not found");
  }

  if (room.state !== "playing") {
    throw new AppError("Game is not currently in progress");
  }

  const currentPlayer = room.players.find(player => player.socketId === socketId);

  if (!currentPlayer) {
    throw new AppError("Player not found in the room");
  }

  return currentPlayer;
}


// export async function endGame(roomId: string, winnerId: string): Promise<Room> {
//   const room = await getRoomById(roomId);

//   if (!room) {
//     throw new AppError("Room not found");
//   }

//   if (room.state !== "playing") {
//     throw new AppError("Game is not currently in progress");
//   }

//   room.state = "finished";
//   room.game!.winnerId = winnerId;
//   room.game!.endedAt = Date.now();

//   clearTurnTimer(roomId);

//   await saveRoom(room);
//   return room;
// }


export async function checkWinCon(roomId: string): Promise<{
  winner: boolean;
  winnerId: string | null;
} | null> {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  if (room.state !== "playing") {
    throw new AppError("Game is not currently in progress");
  }

  const players = room.players;
  const playerStates = room.game!.playerStates;
  let winnerId: string | null = null;

  for (const player of players) {
    const state = playerStates[player.id]!;
    if (state.nosRemaining <= 0 || state.guessesRemaining <= 0) {
      if (state.guess === state.secretAgent) {
        winnerId = player.id;
        break;
      }
    }
  }

  return {
    winnerId,
    winner: winnerId !== null,  
  }; 
}