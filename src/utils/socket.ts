import { Socket } from "socket.io-client";
import { env } from "@/config/config";
import io from "socket.io-client";

// Setup socket instance
export const socket: typeof Socket = io(env.SOCKET_URL, {
    transports: ["websocket", "polling"],
    path: "/api/chat",
    reconnectionAttempts: 5,
});

socket.connect();

