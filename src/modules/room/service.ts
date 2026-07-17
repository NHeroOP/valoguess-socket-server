import { randomUUID } from "node:crypto";

import type { createRoomPayload } from "./schema.js";

import { redis } from "@/setup/redis.js";
import { AppError } from "@/shared/utils/error.js";
import { DefaultSettings } from "@/shared/consts/types.js";
import type { Room, Player, Settings } from "@/shared/consts/types.js";
import { generateUniqueRoomCode } from "./utils.js";

const ROOM_PREFIX = "room:";
const ROOM_TTL = 60 * 30; // 30 minutes

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

export async function createRoom(socketId: string, payload: createRoomPayload) {
  const { player, settings = DefaultSettings } = payload;
  const roomId = await generateUniqueRoomCode();

  const host: Player = {
    id: player.id,
    username: player.username,
    socketId: socketId,
    ready: false,
  };

  const room: Room = {
    id: roomId,
    state: "waiting",
    hostId: host.id,
    players: [host],
    spectators: [],
    settings,
    createdAt: Date.now(),
  };

  await saveRoom(room);

  return room;
}

export async function addPlayerToRoom(roomId: string, player: Player) {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  if (room.players.length >= 2) {
    throw new AppError("Room is full");
  }

  room.players.push(player);

  await saveRoom(room);

  return room;
}

export async function removePlayerFromRoom(roomId: string, socketId: string) {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  room.players = room.players.filter((player) => player.socketId !== socketId);

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

export async function updateRoomSettings(roomId: string, settings: Settings) {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  room.settings = settings;

  await saveRoom(room);

  return room;
}

export async function reconnectPlayerToRoom(roomId: string, playerId: string, socketId: string) {
  const room = await getRoomById(roomId);

  if (!room) {
    throw new AppError("Room not found");
  }

  const player = room.players.find((p) => p.id === playerId);

  if (!player) {
    throw new AppError("Player not found in room");
  }

  player.socketId = socketId;

  await saveRoom(room);

  return room;
}
