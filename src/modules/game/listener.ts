import type { Server, Socket } from "socket.io";

import { emitError } from "@/shared/utils/emitError.js";
import { asyncHandler } from "@/shared/utils/asyncHandler.js";
import { ClientEvents, ServerEvents } from "@/shared/consts/events.js";

import {

} from "./schema.js";

import { changeTurn, startGame } from "./service.js";
import { roomMapper } from "../room/mapper.js";

export function gameListener(io: Server, socket: Socket) {
  socket.on(ClientEvents.GAME_START,
    asyncHandler(socket, async (roomId: string) => {

      const room = await startGame(roomId);
      io.to(socket.id).emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    })
  )

  socket.on(ClientEvents.TURN_END,
    asyncHandler(socket, async (roomId: string) => {
      const room = await changeTurn(roomId);

      if (!room) {
        emitError(socket, "Room not found");
        return;
      }

      io.to(socket.id).emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    })
  )
}
