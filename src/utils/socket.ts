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

    return socket;
};

export const getChatSocket = (): Socket | null => socket;

export const disconnectChatSocket = () => {
    socket?.disconnect();
    socket = null;
};