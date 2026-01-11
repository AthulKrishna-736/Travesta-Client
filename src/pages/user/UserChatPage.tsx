import React, { useEffect, useMemo, useState } from 'react';
import { useGetUserChatAccess, useGetUserChatMessages, useGetUserChatVendors, useGetUserUnreadChats, useMarkMsgRead, useSocketChat } from '@/hooks/user/useChat';
import ChatPage from '@/components/chat/ChatPage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import UserLayout from '@/components/layouts/UserLayout';
import { ChatItem } from '@/types/chat.types';

const UserChatPage: React.FC = () => {
    const [msg, setMsg] = useState<string>('');
    const [selectedVendor, setSelectedVendor] = useState<ChatItem | null>(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);
    const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

    const userId = useSelector((state: RootState) => state?.user?.user?.id);
    const userRole = useSelector((state: RootState) => state.user.user?.role);
    const isAuthenticated = Boolean(useSelector((state: RootState) => state?.user?.user?.id))

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { isLoading: chatAccessLoading, error: chatAccessError } = useGetUserChatAccess();
    const { data: chattedVendorsResponse, isLoading } = useGetUserChatVendors(debouncedSearch);
    const { data: oldMessagesData } = useGetUserChatMessages(selectedVendor?.id || '', !!selectedVendor);
    const { data: unReadMsgResponse } = useGetUserUnreadChats(isAuthenticated);
    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, liveUnreadCounts, bookingError, clearLiveUnread } = useSocketChat(isAuthenticated, userRole!, userId!, selectedVendor?.id,);
    const { mutate: markMessageAsRead } = useMarkMsgRead()

    const vendors = chattedVendorsResponse || [];
    const unreadMsg = unReadMsgResponse?.data;
    const oldMessages = oldMessagesData || [];

    const handleSelectUser = (user: ChatItem) => {
        setSelectedVendor(user);
        clearLiveUnread(user.id);
        markMessageAsRead(user.id);
    };

    const combinedMessages = useMemo(() => {
        const map = new Map();
        [...oldMessages, ...liveMessages].forEach(msg => {
            map.set(msg._id, msg);
        });
        return Array.from(map.values()).sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }, [oldMessages, liveMessages]);

    const mergedUnreadMap = useMemo(() => {
        const map: Record<string, number> = {};

        unreadMsg?.forEach(({ id, count }) => {
            if (id !== selectedVendor?.id) {
                map[id] = count;
            }
        });

        Object.entries(liveUnreadCounts || {}).forEach(([id, count]) => {
            if (id !== selectedVendor?.id) {
                map[id] = (map[id] || 0) + count;
            }
        });

        return map;
    }, [unreadMsg, liveUnreadCounts, selectedVendor?.id]);

    useEffect(() => {
        setUnreadMap(mergedUnreadMap);
    }, [mergedUnreadMap]);

    const chatLastActivity = useMemo(() => {
        const map = new Map<string, number>();

        [...oldMessages, ...liveMessages].forEach(msg => {
            const otherId =
                msg.fromId === userId ? msg.toId : msg.fromId;

            const time = new Date(msg.timestamp).getTime();
            const existing = map.get(otherId) || 0;

            if (time > existing) {
                map.set(otherId, time);
            }
        });

        return map;
    }, [oldMessages, liveMessages, userId]);

    const sortedChats = useMemo(() => {
        return [...vendors].sort((a, b) => {
            const timeA = chatLastActivity.get(a.id) || 0;
            const timeB = chatLastActivity.get(b.id) || 0;
            return timeB - timeA;
        });
    }, [vendors, chatLastActivity]);

    const handleTyping = () => {
        if (selectedVendor) {
            sendTyping(selectedVendor.id, 'vendor');
        }
    };

    const handleSend = () => {
        if (!msg.trim() || !selectedVendor) return;

        sendMessage({ toId: selectedVendor.id, toRole: 'vendor', message: msg.trim() });
        setMsg('');
    };

    return (
        <UserLayout>
            <>
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    {chatAccessLoading ?
                        (
                            <div>
                                Loading....
                            </div>
                        ) : chatAccessError ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <div className="p-50 bg-red-100 border border-red-300 rounded-md shadow-md text-center">
                                    <h2 className="text-xl font-semibold text-red-700">Chat Unavailable {chatAccessError.response.data.message}</h2>
                                    <p className="mt-2 text-gray-700">{bookingError}</p>
                                </div>
                            </div>
                        ) : (
                            <ChatPage
                                isLoading={isLoading}
                                users={sortedChats}
                                selectedUser={selectedVendor!}
                                handleSelectUser={handleSelectUser}
                                msg={msg}
                                setMsg={setMsg}
                                unreadCounts={unreadMap}
                                handleSend={handleSend}
                                handleTyping={handleTyping}
                                typingStatus={typingStatus}
                                currentUserId={userId!}
                                combinedMessages={combinedMessages}
                                searchText={searchText}
                                setSearchText={setSearchText}
                            />
                        )}
                </div>
            </>
        </UserLayout>
    );
};

export default UserChatPage;
