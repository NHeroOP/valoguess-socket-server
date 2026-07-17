import { Server } from "node:http";

import { Socket, Server as SocketServer } from "socket.io";

import { registerHandlers } from "./register.js";

export function createSocketServer(server: Server) {
  const io = new SocketServer(server, {
    cors: {
      origin: ["http://localhost:3000", "https://your-domain.com"],
      credentials: true,
    },
  });

  io.on("connect", (socket: Socket) => {
    console.log(`${socket.id} connected`);

    registerHandlers(io, socket);
  });

  io.on("disconnect", (socket: Socket) => {
    console.log(`${socket.id} disconnected`);
  });

  return io;
}
