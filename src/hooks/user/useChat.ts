import { useQuery } from '@tanstack/react-query';
import { TRoles } from '@/types/Auth.Types';
import { getChatMessages, getChattedVendors } from '@/services/userService';
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/utils/socket';
import { showError, showSuccess } from '@/utils/customToast';
import { getChatUsers } from '@/services/vendorService';
import { IChat, ReadReceiptPayload, SendMessagePayload, TypingPayload } from '@/types/chat.types';
import { getAdminChatVendors } from '@/services/adminService';

export const useGetChatMessages = (userId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['chat-history', userId],
        queryFn: () => getChatMessages(userId),
        enabled,
        staleTime: 60 * 1000,
    });
};

export const useGetChattedUsers = (search: string) => {
    return useQuery({
        queryKey: ['vendor-chatted-users', search],
        queryFn: () => getChatUsers(search),
        staleTime: 60 * 1000,
        enabled: typeof search === 'string',
    });
};

export const useGetChattedVendors = (search: string) => {
    return useQuery({
        queryKey: ['user-chatted-vendors', search],
        queryFn: () => getChattedVendors(search),
        staleTime: 60 * 1000,
        enabled: typeof search === 'string',
    });
};

export const useGetVendorsChatAdmin = (search?: string) => {
    return useQuery({
        queryKey: ['admin-chatted-vendors', search],
        queryFn: () => getAdminChatVendors(search),
        staleTime: 60 * 1000,
        enabled: typeof search === 'string',
    });
}

export const useSocketChat = (selectedId?: string) => {
    const [messages, setMessages] = useState<IChat[]>([]);
    const [typingStatus, setTypingStatus] = useState(false);
    const isConnected = useRef(false);

    useEffect(() => {
        if (!isConnected.current) {
            socket.on("receive_message", (data: IChat) => {
                if (
                    data.fromId === selectedId ||
                    data.toId === selectedId
                ) {
                    setMessages((prev) => [...prev, data]);
                } else {
                    showSuccess(`New message from user someone`);
                }
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

    useEffect(() => {
        messages.forEach((msg) => {
            if (!msg.isRead && msg.fromId === selectedId) {
                sendReadReceipt(msg._id, msg.fromId, msg.fromRole);
            }
        });
    }, [selectedId, messages]);

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

