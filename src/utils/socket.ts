import { TRoles } from '@/types/Auth.Types';
import { io, Socket } from 'socket.io-client';

export interface SocketMessage {
    from: {
        id: string;
        role: TRoles;
    };
    message: string;
    timestamp: string;
}

export interface SendMessagePayload {
    toId: string;
    toRole: TRoles;
    message: string;
}


const token = localStorage.getItem('token');

export const socket: Socket = io(import.meta.env.VITE_API_URL!, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
});


import { useEffect, useRef, useState } from "react";
import { showError } from "@/utils/customToast";

export const useSocketChat = () => {
    const [messages, setMessages] = useState<SocketMessage[]>([]);
    const isConnected = useRef(false);

    // Listen for incoming messages
    useEffect(() => {
        if (!isConnected.current) {
            socket.on("receive_message", (data: SocketMessage) => {
                setMessages((prev) => [...prev, data]);
            });

            socket.on("connect_error", (err) => {
                showError("Socket connection error: " + err.message);
            });

            isConnected.current = true;
        }

        return () => {
            socket.off("receive_message");
            socket.off("connect_error");
            isConnected.current = false;
        };
    }, []);

    // Send a message
    const sendMessage = (payload: SendMessagePayload) => {
        socket.emit("send_message", payload);
    };

    return {
        messages,
        sendMessage,
        socketConnected: socket.connected,
    };
};

