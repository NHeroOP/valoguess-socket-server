import { clearTurnTimer } from "../game/timer.js";
import { changeTurn } from "../game/service.js";
import { getRoomById, saveRoom } from "../room/service.js";

import { AppError } from "@/shared/utils/error.js";
import type { Room } from "@/shared/consts/types.js";

export async function askQuestion(
  roomId: string,
  socketId: string,
  questionId: string
): Promise<Room> {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.state !== "playing") {
    throw new AppError("Game not started", 400);
  }

  if (!room.game) {
    throw new AppError("Game not started", 400);
  }
  
  const currPlayer = room.players.find((player) => player.socketId === socketId);
  if (!currPlayer) {
    throw new AppError("Player not found", 404);
  }

  const questionAlreadyAsked = room.game.history.some(
    (history) =>
      history.questionId === questionId && history.askedBy === currPlayer.id,
  );

  if (questionAlreadyAsked) {
    throw new AppError("Question already asked", 400);
  }

  if (room.game.pendingQuestion) {
    throw new AppError("There is already a pending question", 400);
  }

  room.game.pendingQuestion = {
    askedBy: currPlayer.id,
    targetPlayer: room.players.find((player) => player.id !== currPlayer.id)!.id,
    questionId,
  };


  await saveRoom(room);
  return room;
}

export async function answerQuestion(
  roomId: string,
  socketId: string,
  answer: "yes" | "no"
): Promise<Room> {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.state !== "playing") {
    throw new AppError("Game not started", 400);
  }

  if (!room.game) {
    throw new AppError("Game not started", 400);
  }

  if (!room.game.pendingQuestion) {
    throw new AppError("No pending question", 400);
  }

  const currPlayer = room.players.find((player) => player.socketId === socketId);
  if (!currPlayer) {
    throw new AppError("Player not found", 404);
  }

  if (room.game.pendingQuestion.targetPlayer !== currPlayer.id) {
    throw new AppError("You are not the target player", 400);
  }

  room.game.history.push({
    askedBy: room.game.pendingQuestion.askedBy,
    targetPlayer: room.game.pendingQuestion.targetPlayer,
    questionId: room.game.pendingQuestion.questionId,
    answer,
    timestamp: Date.now(),
  });

  delete room.game.pendingQuestion;
  await saveRoom(room);

  return changeTurn(roomId);
}

function finishGame(
  room: Room,
  winnerId?: string
) {

  if (winnerId) {
    room.game!.winnerId = winnerId;
  } else {
    delete room.game!.winnerId;
  }
  room.state = "finished";
  room.game!.endedAt = Date.now();

  clearTurnTimer(room.id);
}

export async function makeGuess(
  roomId: string,
  socketId: string,
  guess: string
): Promise<Room> {
  
  const room = await getRoomById(roomId);
  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.state !== "playing" || !room.game) {
    throw new AppError("Game not started", 400);
  }

  const currPlayer = room.players.find((player) => player.socketId === socketId);
  if (!currPlayer) {
    throw new AppError("Player not found", 404);
  }
  const playerId = currPlayer.id;

  if (room.game.currentTurn !== playerId) {
    throw new AppError("It's not your turn", 400);
  }
  
  const playerState = room.game.playerStates[playerId];

  if (!playerState) {
    throw new AppError("Player state not found", 400);
  }

  if (playerState.guessesRemaining <= 0) {
    throw new AppError("No guesses remaining", 400);
  }

  if (playerState.guess) {
    throw new AppError("You have already made a guess", 400);
  }

  playerState.guessesRemaining--;
  playerState.guess = guess;

  const opponentPlayer = room.players.find((player) => player.id !== playerId);
  if (!opponentPlayer) {
    throw new AppError("Opponent not found", 400);
  }

  const opponentState = room.game.playerStates[opponentPlayer.id];

  if (!opponentState) {
    throw new AppError("Opponent Player state not found", 400);
  }

  const isGuessCorrect = guess === opponentState.secretAgent;
  const hasOpponentGuessed = opponentState.guess !== null ;
  const isOpponentGuessCorrect = opponentState.isGuessCorrect;
  const playerGuessesExhausted = playerState.guessesRemaining <= 0;
  const opponentGuessesExhausted = opponentState.guessesRemaining <= 0;


  if (hasOpponentGuessed) {
    if (isOpponentGuessCorrect) { 

      if (isGuessCorrect) { 
        finishGame(room)        
      } else {
        if (playerGuessesExhausted) {
          finishGame(room, opponentPlayer.id);
        } else {
          playerState.isGuessCorrect = false;
          return await changeTurn(room);
        }
      }


    } else {
      if (opponentGuessesExhausted) {
        finishGame(room, playerId);
      } else {
        playerState.isGuessCorrect = isGuessCorrect;
        return await changeTurn(room);
      }
    }

  } 
  else {
    playerState.isGuessCorrect = isGuessCorrect;
    return await changeTurn(room);
  }

  await saveRoom(room);
  return room;
}
