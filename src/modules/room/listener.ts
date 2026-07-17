import { randomUUID } from "node:crypto";
import type { Server, Socket } from "socket.io";

import { emitError } from "@/shared/utils/emitError.js";
import { asyncHandler } from "@/shared/utils/asyncHandler.js";
import { ClientEvents, ServerEvents } from "@/shared/consts/events.js";

import {
  createRoomSchema,
  joinRoomSchema,
  updateRoomSchema,
} from "./schema.js";

import {
  createRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  updateRoomSettings,
  saveRoom,
} from "./service.js";
import { roomMapper } from "@/shared/utils/mapper.js";

export function roomListener(io: Server, socket: Socket) {
  socket.on(
    ClientEvents.ROOM_CREATE,
    asyncHandler(socket, async (payload) => {
      const parsed = createRoomSchema.safeParse(payload);

      if (!parsed.success) {
        emitError(socket, "Invalid payload");
        return;
      }

      const room = await createRoom(socket.id, parsed.data);

      io.to(room.id).emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    }),
  );

  socket.on(
    ClientEvents.ROOM_JOIN,
    asyncHandler(socket, async (payload) => {
      const parsed = joinRoomSchema.safeParse(payload);
      if (!parsed.success) {
        emitError(socket, "Invalid payload");
        return;
      }

      const { player, roomId } = parsed.data

      const room = await addPlayerToRoom(roomId, {
        id: player.id,
        username: player.username,
        socketId: socket.id,
        ready: false,
      });

      await socket.join(room.id);
      io.to(room.id).emit(ServerEvents.ROOM_SYNC, roomMapper(room, player.id));
    }),
  );

  socket.on(
    ClientEvents.ROOM_LEAVE,
    asyncHandler(socket, async (roomId: string) => {
      const room = await removePlayerFromRoom(roomId, socket.id);

      await socket.leave(roomId);
      if (!room) return;
      io.to(room.id).emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    }),
  );

  socket.on(
    ClientEvents.ROOM_UPDATE,
    asyncHandler(socket, async (payload) => {
      const parsed = updateRoomSchema.safeParse(payload);
      if (!parsed.success) {
        emitError(socket, "Invalid payload");
        return;
      }

      const room = await updateRoomSettings(
        parsed.data.roomId,
        parsed.data.settings,
      );

      io.to(room.id).emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    }),
  );

  socket.on(
    ClientEvents.ROOM_RECONNECT,
    asyncHandler(socket, async () => {
      
    })
  )
}
