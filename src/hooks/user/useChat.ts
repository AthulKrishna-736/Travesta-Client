import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TRoles } from '../../types/authentication.types';
import { getUserChatMessages, getChattedVendors, getUserUnreadChats, getUserChatAccess, MarkMsgRead } from '@/services/userService';
import { showError } from '@/utils/customToast';
import { getChattedCustomers, getVendorChatMessages, getVendorUnreadChats } from '@/services/vendorService';
import { IChat, SendMessagePayload } from '@/types/chat.types';
import { getAdminChatMessages, getAdminChatVendors, getAdminUnreadMsg } from '@/services/adminService';
import { ICustomError, TApiSuccessResponse } from '@/types/custom.types';
import { connectChatSocket, disconnectChatSocket, getChatSocket } from '@/utils/socket';

//user
export const useGetUserChatMessages = (userId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['chat-history', userId],
        queryFn: () => getUserChatMessages(userId),
        staleTime: 5 * 60 * 1000,
        enabled,
        refetchOnWindowFocus: false,
        retry: false,
    });
};

export const useGetUserUnreadChats = (enabled: boolean) => {
    return useQuery({
        queryKey: ['unread-chats'],
        queryFn: getUserUnreadChats,
        staleTime: 60 * 1000,
        enabled,
        refetchOnWindowFocus: true,
        retry: false,
    });
}

export const useMarkMsgRead = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (receiverId: string) => MarkMsgRead(receiverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unread-chats'] })
        },
        onError: (error: ICustomError) => {
            console.log(error.message || 'Something went wrong');
        }
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
        staleTime: 5 * 60 * 1000,
        enabled: typeof search === 'string',
        refetchOnWindowFocus: false,
        retry: false,
    });
};

//vendor
export const useGetVendorChatCustomers = (search: string) => {
    return useQuery({
        queryKey: ['chat-users', search],
        queryFn: () => getChattedCustomers(search),
        staleTime: 5 * 60 * 1000,
        enabled: typeof search === 'string',
        refetchOnWindowFocus: false,
        retry: false,
    });
};

export const useGetVendorChatMessages = (userId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['chat-history', userId],
        queryFn: () => getVendorChatMessages(userId),
        staleTime: 5 * 60 * 1000,
        enabled,
        refetchOnWindowFocus: false,
        retry: false,
    });
}

export const useGetVendorUnreadChats = (enabled: boolean) => {
    return useQuery({
        queryKey: ['unread-chats'],
        queryFn: getVendorUnreadChats,
        staleTime: 60 * 1000,
        enabled,
        refetchOnWindowFocus: true,
        retry: false,
    });
}

//admin
export const useGetVendorsChatAdmin = (search?: string) => {
    return useQuery({
        queryKey: ['admin-chatted-vendors', search],
        queryFn: () => getAdminChatVendors(search),
        staleTime: 5 * 60 * 1000,
        enabled: typeof search === 'string',
        refetchOnWindowFocus: false,
        retry: false,
    });
}

export const useGetAdminChatMessages = (vendorId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ['chat-history'],
        queryFn: () => getAdminChatMessages(vendorId),
        staleTime: 5 * 60 * 1000,
        enabled,
        refetchOnWindowFocus: false,
        retry: false,
    });
}

export const useGetAdminUnreadChats = (enabled: boolean) => {
    return useQuery({
        queryKey: ['unread-chats'],
        queryFn: getAdminUnreadMsg,
        staleTime: 60 * 1000,
        enabled,
        refetchOnWindowFocus: true,
        retry: false,
    });
}

//socket setup
export const useSocketChat = (isAuthenticated: boolean, userRole: TRoles, userId: string, selectedId?: string) => {
    const [messages, setMessages] = useState<IChat[]>([]);
    const [liveUnreadCounts, setLiveUnreadCounts] = useState<Record<string, number>>({});
    const [typingStatus, setTypingStatus] = useState(false);
    const [bookingError, setBookingError] = useState<string>('');
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const selectedIdRef = useRef<string | undefined>(selectedId);
    const userIdRef = useRef<string>(userId);

    useEffect(() => {
        if (!isAuthenticated || getChatSocket()) return;

        connectChatSocket();

        return () => {
            disconnectChatSocket();
        };
    }, [isAuthenticated]);

    useEffect(() => {
        selectedIdRef.current = selectedId;
    }, [selectedId]);

    useEffect(() => {
        userIdRef.current = userId;
    }, [userId]);

    useEffect(() => {
        const socket = getChatSocket();
        if (!socket) return;

        const handleReceiveMessage = (data: IChat) => {
            const currentUserId = userIdRef.current;
            const currentSelectedId = selectedIdRef.current;

            const otherUserId =
                data.fromId === currentUserId ? data.toId : data.fromId;

            if (otherUserId === currentSelectedId) {
                setMessages(prev => [...prev, data]);
            } else {
                setLiveUnreadCounts(prev => ({
                    ...prev,
                    [otherUserId]: (prev[otherUserId] || 0) + 1,
                }));
            }
        };

        const handleTypingMessage = (data: { fromId: string }) => {
            if (data.fromId !== selectedIdRef.current) return;

            setTypingStatus(true);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);

            typingTimeout.current = setTimeout(() => {
                setTypingStatus(false);
            }, 500);
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

        socket.on("receive_message", handleReceiveMessage);
        socket.on("typing", handleTypingMessage);
        socket.on("message_read", handleReadMessage);
        socket.on("booking_error", handleBookingError);

        socket.on("connect_error", (err) => {
            showError("Socket error: " + err.message);
        });

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("typing", handleTypingMessage);
            socket.off("message_read", handleReadMessage);
            socket.off("booking_error", handleBookingError);
        };
    }, []);

    const sendMessage = (payload: SendMessagePayload) => {
        const socket = getChatSocket();
        if (!socket) return;

        const tempMessage = {
            _id: `temp-${Date.now()}`,
            fromId: userId,
            toId: payload.toId,
            fromRole: userRole,
            toRole: payload.toRole,
            message: payload.message,
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        setMessages((prev) => [...prev, tempMessage])

        socket.emit("send_message", payload);
    };

    const sendTyping = (toId: string, toRole: TRoles) => {
        const socket = getChatSocket();
        if (!socket) return;
        socket.emit("typing", { toId, toRole });
    };

    const clearLiveUnread = (userId: string) => {
        setLiveUnreadCounts(prev => {
            const copy = { ...prev };
            delete copy[userId];
            return copy;
        });
    };

    return {
        messages,
        sendMessage,
        sendTyping,
        typingStatus,
        liveUnreadCounts,
        clearLiveUnread,
        bookingError,
        socketConnected: Boolean(getChatSocket()?.connected),
    };
};

