// utils/roomCode.ts

import { redis } from "@/setup/redis.js";

const ROOM_CODE_CHARACTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 6;

function generateRoomCode(): string {
  let code = "";

  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(
      Math.random() * ROOM_CODE_CHARACTERS.length,
    );

    code += ROOM_CODE_CHARACTERS[randomIndex];
  }

  return code;
}

export async function generateUniqueRoomCode(): Promise<string> {
  while (true) {
    const roomCode = generateRoomCode();

    const exists = await redis.exists(`room:${roomCode}`);

    if (!exists) {
      return roomCode;
    }
  }
}