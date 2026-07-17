import type { Socket } from "socket.io";

import { ServerEvents } from "@/shared/consts/events.js";

export function emitError(socket: Socket, message: string) {
  socket.emit(ServerEvents.ERROR, {
    message,
  });
}
