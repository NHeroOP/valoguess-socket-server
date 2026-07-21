import type { Server, Socket } from "socket.io";

import {
  answerQuestionSchema,
  askQuestionSchema,
  makeGuessSchema,
} from "./schema.js";
import { answerQuestion, askQuestion, makeGuess } from "./service.js";

import { roomMapper } from "@/shared/utils/mapper.js";
import { asyncHandler } from "@/shared/utils/asyncHandler.js";
import { ClientEvents, ServerEvents } from "@/shared/consts/events.js";


export function questionListener(io: Server, socket: Socket) {
  socket.on(
    ClientEvents.QUESTION_ASK,
    asyncHandler(socket, async (payload) => {
      const { roomId, questionId } = askQuestionSchema.parse(payload);
      const room = await askQuestion( roomId, socket.id, questionId );

      io.to(socket.id)
        .emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    }),
  );

  socket.on(
    ClientEvents.QUESTION_ANSWER,
    asyncHandler(socket, async (payload) => {
      const { roomId, answer } = answerQuestionSchema.parse(payload);
      const room = await answerQuestion( roomId, socket.id, answer );

      io.to(socket.id)
        .emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    }),
  );

  socket.on(
    ClientEvents.GUESS_SUBMIT,
    asyncHandler(socket, async (payload) => {
      const { roomId, guess } = makeGuessSchema.parse(payload);
      const room = await makeGuess( roomId, socket.id, guess );

      io.to(socket.id)
        .emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    }),
  );
}
