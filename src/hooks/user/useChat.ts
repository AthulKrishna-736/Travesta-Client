import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { socket } from '@/utils/socket';
import { TRoles } from '../../types/authentication.types';
import { getUserChatMessages, getChattedVendors, getUserUnreadChats, getUserChatAccess, MarkMsgRead } from '@/services/userService';
import { showError } from '@/utils/customToast';
import { getChattedCustomers, getVendorChatMessages, getVendorUnreadChats } from '@/services/vendorService';
import { IChat, SendMessagePayload, TypingPayload } from '@/types/chat.types';
import { getAdminChatMessages, getAdminChatVendors, getAdminUnreadMsg } from '@/services/adminService';
import { ICustomError, TApiSuccessResponse } from '@/types/custom.types';

//user
export const useGetUserChatMessages = (userId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['chat-history', userId],
        queryFn: () => getUserChatMessages(userId),
        enabled,
        staleTime: 60 * 1000,
    });
};

export const useGetUserUnreadChats = () => {
    return useQuery({
        queryKey: ['unread-chats'],
        queryFn: getUserUnreadChats,
        staleTime: 60 * 1000,
    });
}

export const useMarkMsgRead = () => {
    return useMutation({
        mutationFn: (receiverId: string) => MarkMsgRead(receiverId),
    })
}

export const useGetUserChatAccess = () => {
    return useQuery<TApiSuccessResponse, ICustomError>({
        queryKey: ['chat-access'],
        queryFn: getUserChatAccess,
        staleTime: 60 * 1000,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: false,
    });
}

export const useGetUserChatVendors = (search: string) => {
    return useQuery({
        queryKey: ['chat-vendors', search],
        queryFn: () => getChattedVendors(search),
        staleTime: 60 * 1000,
        enabled: typeof search === 'string',
    });
};

//vendor
export const useGetVendorChatCustomers = (search: string) => {
    return useQuery({
        queryKey: ['chat-users', search],
        queryFn: () => getChattedCustomers(search),
        staleTime: 60 * 1000,
        enabled: typeof search === 'string',
    });
};

export const useGetVendorChatMessages = (userId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['chat-history', userId],
        queryFn: () => getVendorChatMessages(userId),
        enabled,
        staleTime: 60 * 1000,
    });
}

export const useGetVendorUnreadChats = () => {
    return useQuery({
        queryKey: ['unread-chats'],
        queryFn: getVendorUnreadChats,
        staleTime: 60 * 1000,
    });
}

//admin
export const useGetVendorsChatAdmin = (search?: string) => {
    return useQuery({
        queryKey: ['admin-chatted-vendors', search],
        queryFn: () => getAdminChatVendors(search),
        staleTime: 60 * 1000,
        enabled: typeof search === 'string',
    });
}

export const useGetAdminChatMessages = (vendorId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['admin-chat-history'],
        queryFn: () => getAdminChatMessages(vendorId),
        enabled,
        staleTime: 60 * 1000,
    });
}

export const useGetAdminUnreadChats = () => {
    return useQuery({
        queryKey: ['admin-unread-chats'],
        queryFn: getAdminUnreadMsg,
        staleTime: 60 * 1000,
    });
}

//socket setup
export const useSocketChat = (selectedId?: string, userId?: string, userRole?: TRoles) => {
    const [messages, setMessages] = useState<IChat[]>([]);
    const [liveUnreadCounts, setLiveUnreadCounts] = useState<Record<string, number>>({});
    const [typingStatus, setTypingStatus] = useState(false);
    const [bookingError, setBookingError] = useState<string>('');
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleReceiveMessage = (data: IChat) => {
        const otherUserId = data.fromId === userId ? data.toId : data.fromId;

        if (otherUserId === selectedId) {
            setMessages(prev => [...prev, data]);
        } else {
            setLiveUnreadCounts(prev => ({
                ...prev,
                [otherUserId]: (prev[otherUserId] || 0) + 1
            }));
        }
    };

    const handleTypingMessage = (data: { fromId: string }) => {
        if (data.fromId !== selectedId) return;

        setTypingStatus(true);

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            setTypingStatus(false);
        }, 1200);
    };

    const handleReadMessage = (data: { withUserId: string }) => {
        setLiveUnreadCounts(prev => {
            const copy = { ...prev };
            delete copy[data.withUserId];
            return copy;
        });
    };


    const handleBookingError = (message: string) => {
        setBookingError(message);
        socket.disconnect();
    };

    useEffect(() => {
        socket.on("receive_message", handleReceiveMessage);
        socket.on("typing", handleTypingMessage);
        socket.on("message_read", handleReadMessage);
        socket.on("booking_error", handleBookingError);

        socket.on("connect_error", (err: any) => {
            showError("Socket error: " + err.message);
        });

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("typing", handleTypingMessage);
            socket.off("message_read", handleReadMessage);
            socket.off("booking_error", handleBookingError);
            socket.off("connect_error");
        };
    }, [selectedId, userId]);

    useEffect(() => {
        if (!selectedId || !userId || !userRole) return;
        if (!socket.connected) return;

        setLiveUnreadCounts(prev => {
            const copy = { ...prev };
            delete copy[selectedId];
            return copy;
        });

        socket.emit("read_message", {
            senderId: selectedId,
            receiverId: userId,
            toRole: userRole,
        });
    }, [selectedId, socket.connected]);

    const sendMessage = (payload: SendMessagePayload) => {
        socket.emit("send_message", payload);
    };

    const sendTyping = (toId: string, toRole: TRoles) => {
        socket.emit("typing", { toId, toRole });
    };

    return {
        messages,
        sendMessage,
        sendTyping,
        typingStatus,
        liveUnreadCounts,
        bookingError,
        socketConnected: socket.connected,
    };
};

