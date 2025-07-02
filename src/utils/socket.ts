import { TRoles } from '@/types/Auth.Types';
import { useEffect, useRef, useState } from "react";
import { showError } from "@/utils/customToast";
import { Socket } from 'socket.io-client';
import { env } from '@/config/config';


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

export const socket: typeof Socket = io(env.SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    path: '/path/chat',
    reconnectionAttempts: 5,
    
});


socket.connect()


export const useSocketChat = () => {
    const [messages, setMessages] = useState<SocketMessage[]>([]);
    const isConnected = useRef(false);

    // Listen for incoming messages
    useEffect(() => {
        if (!isConnected.current) {
            socket.on("receive_message", (data: SocketMessage) => {
                setMessages((prev) => [...prev, data]);
            });

            socket.on("connect_error", (err: any) => {
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


    useEffect(() => {
        const onConnect = () => {
            console.log("✅ Socket connected:", socket.id);
        };

        socket.on("connect", onConnect);
        socket.on("receive_message", (data: SocketMessage) => {
            console.log("📥 New message received:", data);
            setMessages((prev) => [...prev, data]);
        });

        socket.on("connect_error", (err: any) => {
            showError("❌ Socket connection error: " + err.message);
            console.error("Socket error:", err);
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("receive_message");
            socket.off("connect_error");
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

