import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TRoles } from '@/types/auth.types';
import { getChatMessages, getChattedVendors, getUnreadChats } from '@/services/userService';
import { useEffect, useRef, useState } from 'react';
import { socket } from '@/utils/socket';
import { showError } from '@/utils/customToast';
import { getChatUsers } from '@/services/vendorService';
import { IChat, SendMessagePayload, TypingPayload } from '@/types/chat.types';
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

export const useGetUnreadMsg = () => {
    return useQuery({
        queryKey: ['unread-chats'],
        queryFn: getUnreadChats,
        staleTime: 60 * 1000,
    })
}

export const useSocketChat = (selectedId?: string, userId?: string, userRole?: TRoles) => {
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState<IChat[]>([]);
    const [liveUnreadCounts, setLiveUnreadCounts] = useState<Record<string, number>>({});
    const [typingStatus, setTypingStatus] = useState(false);
    const isConnected = useRef(false);

    useEffect(() => {
        if (!isConnected.current) {
            socket.on("receive_message", (data: IChat) => {
                if (data.fromId === selectedId || data.toId === selectedId) {
                    setMessages((prev) => [...prev, data]);
                } else {
                    console.info('read message data', data)
                    setLiveUnreadCounts((prev) => ({
                        ...prev,
                        [data.fromId]: (prev[data.fromId] || 0) + 1
                    }));
                }
            });

            socket.on("typing", (data: TypingPayload) => {
                if (selectedId === data.fromId) {
                    setTypingStatus(true);
                    setTimeout(() => setTypingStatus(false), 2000);
                }
            });

            socket.on("message_read", (data: { withUserId: string }) => {
                setLiveUnreadCounts(prev => {
                    const copy = { ...prev };
                    delete copy[data.withUserId];
                    return copy;
                });

                queryClient.invalidateQueries({ queryKey: ['unread-chats'] });
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
        console.log('clearing useEffect running or not check quick here just that here')
        if (selectedId) {
            setLiveUnreadCounts(prev => {
                const copy = { ...prev };
                delete copy[selectedId];
                return copy;
            });

            if (!userId || !userRole) {
                console.warn('no id found here quick fix')
                return
            }

            sendReadReceipt(selectedId, userId, userRole);
        }
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

    const sendReadReceipt = (senderId: string, receiverId: string, toRole: TRoles) => {
        socket.emit("read_message", { senderId, receiverId, toRole });
    };

    return {
        messages,
        sendMessage,
        sendTyping,
        sendReadReceipt,
        typingStatus,
        socketConnected: socket.connected,
        liveUnreadCounts,
    };
};

