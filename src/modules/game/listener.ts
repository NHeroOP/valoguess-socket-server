import type { Server, Socket } from "socket.io";

import { emitError } from "@/shared/utils/emitError.js";
import { asyncHandler } from "@/shared/utils/asyncHandler.js";
import { ClientEvents, ServerEvents } from "@/shared/consts/events.js";

import {

} from "./schema.js";

import { startGame } from "./service.js";
import { roomMapper } from "@/shared/utils/mapper.js";

export function gameListener(io: Server, socket: Socket) {
  socket.on(ClientEvents.GAME_START,
    asyncHandler(socket, async ({ roomId, playerId }) => {

      const room = await startGame(roomId);
      io.to(socket.id).emit(ServerEvents.ROOM_SYNC, roomMapper(room, playerId));
    })
  )

}
