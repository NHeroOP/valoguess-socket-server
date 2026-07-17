import type { Socket } from "socket.io";
import { ServerEvents } from "@/shared/consts/events.js";
import { AppError } from "./error.js";

export function asyncHandler<T extends any[]>(
  socket: Socket,
  handler: (...args: T) => Promise<void>,
) {
  return async (...args: T) => {
    try {
      await handler(...args);
    } catch (err) {
      if (err instanceof AppError) {
        socket.emit(ServerEvents.ERROR, {
          message: err.message,
        });

        return;
      }

      console.error(err);
      socket.emit(ServerEvents.ERROR, {
        message: "Internal server error",
      });
    }
  };
}
