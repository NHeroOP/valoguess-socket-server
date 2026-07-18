import type { Server as SocketServer, Socket } from "socket.io";
import { roomListener } from "@/modules/room/listener.js";
import { gameListener } from "@/modules/game/listener.js";
import { questionListener } from "@/modules/question/listener.js";

export function registerHandlers(io: SocketServer, socket: Socket) {
  roomListener(io, socket);
  gameListener(io, socket);
  questionListener(io, socket);
}
 