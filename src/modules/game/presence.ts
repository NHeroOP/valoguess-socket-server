import { deleteRoom, getActiveRooms } from "@/modules/room/service.js";
import { getRoomById, saveRoom } from "@/modules/room/service.js";
import { finishGame } from "@/modules/game/service.js";
import type { Player } from "@/shared/consts/types.js";

const CHECK_INTERVAL = 5_000;
const HEARTBEAT_TIMEOUT = 30_000;

let presenceInterval: NodeJS.Timeout | null = null;

export function startPresenceChecker() {
  if (presenceInterval) {
    return;
  }

  presenceInterval = setInterval(async () => {
    try {
      await checkPresence();
    } catch (error) {
      console.error("[Presence] Check failed:", error);
    }
  }, CHECK_INTERVAL);

  console.log("[Presence] Checker started");
}

export function stopPresenceChecker() {
  if (!presenceInterval) {
    return;
  }

  clearInterval(presenceInterval);
  presenceInterval = null;

  console.log("[Presence] Checker stopped");
}

async function checkPresence() {
  const rooms = await getActiveRooms();

  const now = Date.now();

  for (const room of rooms) {
    if (room.state !== "playing") {
      continue;
    }

    const inactivePlayers = room.players.filter(
      (player: Player) =>
        now - player.lastHeartbeatAt > HEARTBEAT_TIMEOUT,
    );

    if (inactivePlayers.length === 0) {
      continue;
    }

    // Both players are inactive
    if (inactivePlayers.length === room.players.length) {
      await deleteRoom(room.id);
      continue;
    }

    // One player is inactive
    if (inactivePlayers.length === 1) {
      const inactivePlayer = inactivePlayers[0]!;

      const opponent = room.players.find(
        (player: Player) => player.id !== inactivePlayer.id,
      );

      if (!opponent) {
        await deleteRoom(room.id);
        continue;
      }

      await finishGame(room, opponent.id);
    }
  }
}