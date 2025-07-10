import { TRoles } from '@/types/Auth.Types';
import { useEffect, useRef, useState } from "react";
import { showError } from "@/utils/customToast";
import { Socket } from 'socket.io-client';
import { env } from '@/config/config';
import io from 'socket.io-client';


export interface SocketMessage {
    fromId: string;
    fromRole: TRoles;
    toId: string;
    toRole: TRoles;
    message: string;
    timestamp: string;
    _id?: string;
    isRead?: boolean;
}

export interface SendMessagePayload {
    toId: string;
    toRole: TRoles;
    message: string;
}

export interface TypingPayload {
    fromId: string;
    toId: string;
    toRole: TRoles;
}

export interface ReadReceiptPayload {
    messageId: string;
    toId: string;
    toRole: TRoles;
}

export const socket: typeof Socket = io(env.SOCKET_URL, {
    transports: ['websocket'],
    path: '/api/chat',
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

