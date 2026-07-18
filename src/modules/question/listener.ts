import type { Server, Socket } from "socket.io";

import { asyncHandler } from "@/shared/utils/asyncHandler.js";
import { ClientEvents, ServerEvents } from "@/shared/consts/events.js";

import {
  answerQuestionSchema,
  askQuestionSchema,
  makeGuessSchema,
} from "./schema.js";

import { answerQuestion, askQuestion, makeGuess } from "./service.js";
import { roomMapper } from "@/shared/utils/mapper.js";

export function questionListener(io: Server, socket: Socket) {
  socket.on(
    ClientEvents.QUESTION_ASK,
    asyncHandler(socket, async (payload) => {
      const { roomId, playerId, questionId } = askQuestionSchema.parse(payload);
      const room = await askQuestion({ roomId, playerId, questionId });

      io.to(socket.id)
        .emit(ServerEvents.ROOM_SYNC, roomMapper(room, playerId));
    }),
  );

  socket.on(
    ClientEvents.QUESTION_ANSWER,
    asyncHandler(socket, async (payload) => {
      const { roomId, playerId, answer } = answerQuestionSchema.parse(payload);
      const room = await answerQuestion({ roomId, playerId, answer });

      io.to(socket.id)
        .emit(ServerEvents.ROOM_SYNC, roomMapper(room, playerId));
    }),
  );

  socket.on(
    ClientEvents.GUESS_SUBMIT,
    asyncHandler(socket, async (payload) => {
      const { roomId, playerId, guess } = makeGuessSchema.parse(payload);
      const room = await makeGuess({ roomId, playerId, guess });

      io.to(socket.id)
        .emit(ServerEvents.ROOM_SYNC, roomMapper(room, playerId));
    }),
  );
}
