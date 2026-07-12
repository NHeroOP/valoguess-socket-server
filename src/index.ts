import { createServer } from "node:http";
import { createSocketServer } from "@/setup/socket.js";

const PORT = Number(process.env.PORT ?? 5000);
const httpServer = createServer();

createSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket Server running `);
  console.log(`   Local: http://localhost:${PORT}`);
});
