import { generateUniqueRoomCode } from "./utils.js";

import { redis } from "@/setup/redis.js";
import { AppError } from "@/shared/utils/error.js";
import { DefaultSettings } from "@/shared/consts/types.js";
import type { Room, Player, Settings } from "@/shared/consts/types.js";
import type { playerInput } from "./schema.js";

const ROOM_PREFIX = "room:";
const ROOM_TTL = 60 * 10; // 10 minutes

const roomKey = (roomId: string) => `${ROOM_PREFIX}${roomId}`;

export async function roomExists(roomId: string) {
  return (await redis.exists(roomKey(roomId))) === 1;
}

export async function getRoomById(roomId: string) {
  const room = await redis.get(roomKey(roomId));

  if (!room) return null;

  return JSON.parse(room) as Room;
}

export async function saveRoom(room: Room) {
  await redis.setex(roomKey(room.id), ROOM_TTL, JSON.stringify(room));
}

export async function deleteRoom(roomId: string) {
  await redis.del(roomKey(roomId));
}

export async function createRoom(socketId: string, player: playerInput) {
  const roomId = await generateUniqueRoomCode();
  const reconnectToken = crypto.randomUUID();

  const host: Player = {
    id: player.id,
    username: player.username,
    reconnectToken,
    socketId: socketId,
  };

  const room: Room = {
    id: roomId,
    state: "waiting",
    hostId: host.id,
    players: [host],
    spectators: [],
    settings: DefaultSettings,
    createdAt: Date.now(),
  };

  await saveRoom(room);

  return { room, reconnectToken };
}

export async function addPlayerToRoom(roomId: string, player: Player) {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  if (room.players.length >= 2) {
    throw new AppError("Room is full");
  }

  const newPlayer = {
      ...player,
      reconnectToken: crypto.randomUUID()
    }

  room.players.push(newPlayer);

  await saveRoom(room);

  return { room, reconnectToken: newPlayer.reconnectToken };
}

export async function updateRoomSettings(
  roomId: string,
  socketId: string,
  settings: Settings,
) {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new AppError("Room not found");
  }

  const currentPlayer = room.players.find((p) => p.socketId === socketId);
  if (room.hostId !== currentPlayer?.id) {
    throw new AppError("Only the host can update room settings");
  }

  room.settings = settings;

  await saveRoom(room);

  return room;
}

export async function kickPlayerFromRoom(
  roomId: string,
  kickedPlayerId: string,
  socketId: string,
) {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  const currentPlayer = room.players.find((p) => p.socketId === socketId);
  if (room.hostId !== currentPlayer?.id) {
    throw new AppError("Only the host can kick players");
  }

  const kickedPlayer = room.players.find((p) => p.id === kickedPlayerId);
  if (!kickedPlayer) {
    throw new AppError("Player to kick not found in room");
  }

  room.players = room.players.filter((player) => player.id !== kickedPlayerId);

  await saveRoom(room);

  return {room , kickedPlayer};
}

export async function leaveRoom(roomId: string, socketId: string) {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  const player = room.players.find((p) => p.socketId === socketId);
  if (!player) {
    throw new AppError("Player not found in room");
  }

  room.players = room.players.filter((p) => p.id !== player.id);

  if (room.players.length === 0) {
    await deleteRoom(room.id);
    return null;
  }

  if (!room.players.find((p) => p.id === room.hostId)) {
    room.hostId = room.players[0]!.id;
  }

  await saveRoom(room);

  return room;
}

export async function reconnectPlayerToRoom(
  roomId: string,
  reconnectToken: string,
  socketId: string,
) {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  const player = room.players.find((p) => p.reconnectToken === reconnectToken);

  if (!player) {
    throw new AppError("Player not found in room");
  }

  player.socketId = socketId;

  await saveRoom(room);

  return room;
}
