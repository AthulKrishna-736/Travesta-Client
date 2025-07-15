import { useQuery } from '@tanstack/react-query';
import { TRoles } from '@/types/Auth.Types';
import { getChatMessages } from '@/services/userService';
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/utils/socket';
import { showError } from '@/utils/customToast';
import { getChatUsers } from '@/services/vendorService';
import { IChat, ReadReceiptPayload, SendMessagePayload, TypingPayload } from '@/types/chat.types';

export const useGetChatMessages = (userId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['chat-history', userId],
        queryFn: () => getChatMessages(userId),
        enabled,
        staleTime: 60 * 1000,
    });
};

export const useGetChattedUsers = () => {
    return useQuery({
        queryKey: ['vendor-chatted-users'],
        queryFn: () => getChatUsers(),
        staleTime: 60 * 1000,
    });
};


export const useSocketChat = (selectedId?: string) => {
    const [messages, setMessages] = useState<IChat[]>([]);
    const [typingStatus, setTypingStatus] = useState(false);
    const isConnected = useRef(false);

    useEffect(() => {
        if (!isConnected.current) {
            socket.on("receive_message", (data: IChat) => {
                setMessages((prev) => [...prev, data]);
            });

            socket.on("typing", (data: TypingPayload) => {
                if (selectedId === data.fromId) {
                    setTypingStatus(true);
                    setTimeout(() => setTypingStatus(false), 2000);
                }
            });

            socket.on("message_read", (data: ReadReceiptPayload & { by: { userId: string; role: TRoles } }) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === data.messageId ? { ...msg, isRead: true } : msg
                    )
                );
            });

            socket.on("connect_error", (err: any) => {
                showError("Socket connection error: " + err.message);
            });

            isConnected.current = true;
        }

        return () => {
            socket.off("receive_message");
            socket.off("typing");
            socket.off("message_read");
            socket.off("connect_error");
            isConnected.current = false;
        };
    }, [selectedId]);

    const sendMessage = (payload: SendMessagePayload) => {
        socket.emit("send_message", payload);
    };

    const sendTyping = (toId: string, toRole: TRoles) => {
        const payload: TypingPayload = {
            fromId: socket.id,
            toId,
            toRole
        };
        socket.emit("typing", payload);
    };

    const sendReadReceipt = (messageId: string, toId: string, toRole: TRoles) => {
        const payload: ReadReceiptPayload = {
            messageId,
            toId,
            toRole
        };
        socket.emit("read_message", payload);
    };

    return {
        messages,
        sendMessage,
        sendTyping,
        sendReadReceipt,
        typingStatus,
        socketConnected: socket.connected,
    };
};

