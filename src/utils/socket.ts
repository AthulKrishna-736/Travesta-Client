import { env } from "@/config/config";
import { io, Socket } from 'socket.io-client';

// Setup socket instance
let socket: Socket | null = null;

export const connectChatSocket = () => {
    if (socket?.connected) return socket;

    socket = io(env.SOCKET_URL, {
        path: "/api/chat",
        transports: ["websocket"],
        withCredentials: true,
        reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
        console.log("Socket Connected:", socket?.id);
    });

    socket.on("connect_error", (error) => {
        console.log("Socket Connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket Disconnected:", reason);
    });
};

export const getChatSocket = (): Socket | null => socket;

export const disconnectChatSocket = () => {
    socket?.disconnect();
    socket = null;
};