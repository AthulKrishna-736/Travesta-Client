import { useEffect, useState } from 'react';
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
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState<IChat[]>([]);
    const [liveUnreadCounts, setLiveUnreadCounts] = useState<Record<string, number>>({});
    const [typingStatus, setTypingStatus] = useState(false);
    const [bookingError, setBookingError] = useState<string>('');

    const handleReceiveMessage = (data: IChat) => {
        if (data.fromId === selectedId || data.toId === selectedId) {
            setMessages((prev) => [...prev, data]);
        } else {
            console.info('Received Msg: ', data);
            setLiveUnreadCounts((prev) => ({
                ...prev,
                [data.fromId]: (prev[data.fromId] || 0) + 1
            }))
        }
    }

    const handleTypingMessage = (data: TypingPayload) => {
        if (selectedId === data.fromId) {
            setTypingStatus(true);
            setTimeout(() => setTypingStatus(false), 1500);
        }
    }

    const handleReadMessage = (data: { withUserId: string }) => {
        setLiveUnreadCounts(prev => {
            const copy = { ...prev };
            delete copy[data.withUserId];
            return copy;
        })
    }

    const handleBookingError = (message: string) => {
        setBookingError(message);
        socket.disconnect();
    }

    //mount time checks
    useEffect(() => {
        socket.on("booking_error", handleBookingError);
        socket.on("connect_error", (err: any) => {
            showError("Socket connection error: " + err.message);
        });

        return () => {
            socket.off("booking_error", handleBookingError);
            socket.off("connect_error");
        };
    }, []);

    //on chat acc selected
    useEffect(() => {
        socket.on("receive_message", handleReceiveMessage);
        socket.on("typing", handleTypingMessage);
        socket.on("message_read", handleReadMessage);

        queryClient.invalidateQueries({ queryKey: ['unread-chats'] });

        return () => {
            socket.off("receive_message");
            socket.off("typing");
            socket.off("message_read");
        };
    }, [selectedId]);

    useEffect(() => {
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
        bookingError,
    };
};

