import React, { useEffect, useMemo, useState } from 'react';
import { useGetVendorChatCustomers, useGetVendorChatMessages, useGetVendorUnreadChats, useMarkMsgRead, useSocketChat } from '@/hooks/user/useChat';
import ChatPage from '@/components/chat/ChatPage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import VendorLayout from '@/components/layouts/VendorLayout';
import { ChatItem } from '@/types/chat.types';

const VendorChatPage: React.FC = () => {
    const [msg, setMsg] = useState('');
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);
    const [selectedUser, setSelectedUser] = useState<ChatItem | null>(null);
    const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

    const vendorId = useSelector((state: RootState) => state.vendor.vendor?.id);
    const vendorRole = useSelector((state: RootState) => state.vendor.vendor?.role);
    const isAuthenticated = Boolean(useSelector((state: RootState) => state.vendor.vendor?.id));

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: chattedUsersResponse, isLoading } = useGetVendorChatCustomers(debouncedSearch);
    const { data: oldMessagesData } = useGetVendorChatMessages(selectedUser?.id || '', !!selectedUser);
    const { data: unReadMsgResponse } = useGetVendorUnreadChats(isAuthenticated);
    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, liveUnreadCounts, clearLiveUnread } = useSocketChat(isAuthenticated, vendorRole!, vendorId!, selectedUser?.id)
    const { mutate: markMessageAsRead } = useMarkMsgRead();

    const users = chattedUsersResponse || []
    const unreadMsg = unReadMsgResponse?.data;
    const oldMessages = oldMessagesData || [];

    const handleSelectUser = (user: ChatItem) => {
        setSelectedUser(user);
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
            if (id !== selectedUser?.id) {
                map[id] = count;
            }
        });

        Object.entries(liveUnreadCounts || {}).forEach(([id, count]) => {
            if (id !== selectedUser?.id) {
                map[id] = (map[id] || 0) + count;
            }
        });

        return map;
    }, [unreadMsg, liveUnreadCounts, selectedUser?.id]);

    useEffect(() => {
        setUnreadMap(mergedUnreadMap);
    }, [mergedUnreadMap]);

    const chatLastActivity = useMemo(() => {
        const map = new Map<string, number>();

        [...oldMessages, ...liveMessages].forEach(msg => {
            const otherId = msg.fromId === vendorId ? msg.toId : msg.fromId;

            const time = new Date(msg.timestamp).getTime();
            const existing = map.get(otherId) || 0;

            if (time > existing) {
                map.set(otherId, time);
            }
        });

        return map;
    }, [oldMessages, liveMessages, vendorId]);

    const sortedChats = useMemo(() => {
        return [...users].sort((a, b) => {
            const timeA = chatLastActivity.get(a.id) || 0;
            const timeB = chatLastActivity.get(b.id) || 0;
            return timeB - timeA;
        });
    }, [users, chatLastActivity]);

    const handleTyping = () => {
        if (selectedUser) {
            sendTyping(selectedUser.id, selectedUser.role);
        }
    };

    const handleSend = () => {
        if (!msg.trim() || !selectedUser) return;

        sendMessage({ toId: selectedUser.id, toRole: selectedUser.role, message: msg.trim() });
        setMsg('');
    };

    return (
        <VendorLayout>
            <>
                <ChatPage
                    isLoading={isLoading}
                    users={sortedChats}
                    selectedUser={selectedUser!}
                    handleSelectUser={handleSelectUser}
                    msg={msg}
                    setMsg={setMsg}
                    unreadCounts={unreadMap}
                    handleSend={handleSend}
                    handleTyping={handleTyping}
                    typingStatus={typingStatus}
                    currentUserId={vendorId as string}
                    combinedMessages={combinedMessages}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </>
        </VendorLayout>
    );
};

export default VendorChatPage;
