import type { Server, Socket } from "socket.io";

import { roomMapper } from "@/shared/utils/mapper.js";
import { asyncHandler } from "@/shared/utils/asyncHandler.js";
import { ClientEvents, ServerEvents } from "@/shared/consts/events.js";

import {
  joinRoomSchema,
  playerSchema,
  updateRoomSchema,
} from "./schema.js";

import {
  createRoom,
  addPlayerToRoom,
  updateRoomSettings,
  leaveRoom,
  kickPlayerFromRoom,
  reconnectPlayerToRoom,
} from "./service.js";


export function roomListener(io: Server, socket: Socket) {
  socket.on(
    ClientEvents.ROOM_CREATE,
    asyncHandler(socket, async (payload) => {
      const player = playerSchema.parse(payload);

      const room = await createRoom(socket.id, player);

      await socket.join(room.id);
      io.to(room.id).emit(ServerEvents.ROOM_SYNC, roomMapper(room, socket.id));
    }),
  );

  socket.on(
    ClientEvents.ROOM_JOIN,
    asyncHandler(socket, async (payload) => {
      const { roomId, player } = joinRoomSchema.parse(payload);

      const room = await addPlayerToRoom(roomId, {
        ...player,
        socketId: socket.id,
      });

      await socket.join(room.id);

      for (const player of room.players) {
        io.to(player.socketId).emit(
          ServerEvents.ROOM_SYNC,
          roomMapper(room, socket.id),
        );
      }
    }),
  );

  socket.on(
    ClientEvents.ROOM_LEAVE,
    asyncHandler(socket, async (roomId) => {
      const room = await leaveRoom(roomId, socket.id);

      await socket.leave(roomId);
      if (!room) return;

      for (const player of room.players) {
        io.to(player.socketId).emit(
          ServerEvents.ROOM_SYNC,
          roomMapper(room, socket.id),
        );
      }
    }),
  );

  socket.on(
    ClientEvents.ROOM_UPDATE,
    asyncHandler(socket, async (payload) => {
      const { roomId, settings } = updateRoomSchema.parse(payload);

      const room = await updateRoomSettings(roomId, socket.id, settings);

      for (const player of room.players) {
        io.to(player.socketId).emit(
          ServerEvents.ROOM_SYNC,
          roomMapper(room, socket.id),
        );
      }
    }),
  );

  socket.on(
    ClientEvents.ROOM_KICK,
    asyncHandler(socket, async ({ roomId, kickedPlayerId }) => {
      const room = await kickPlayerFromRoom(roomId, kickedPlayerId, socket.id);

      for (const player of room.players) {
        io.to(player.socketId).emit(
          ServerEvents.ROOM_SYNC,
          roomMapper(room, socket.id),
        );
      }
    })
  )

  socket.on(
    ClientEvents.ROOM_RECONNECT,
    asyncHandler(socket, async ({ roomId, reconnectToken }) => {
      const room = await reconnectPlayerToRoom(roomId, reconnectToken, socket.id);
      console.log("Reconnected");
      await socket.join(room.id);
    }),
  );
}
