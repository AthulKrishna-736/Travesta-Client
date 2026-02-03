import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetAdminChatMessages, useGetAdminUnreadChats, useGetVendorsChatAdmin, useMarkMsgRead, useSocketChat } from '@/hooks/user/useChat';
import ChatPage from '@/components/chat/ChatPage';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { ChatItem } from '@/types/chat.types';

const AdminChatPage: React.FC = () => {
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<ChatItem | null>(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);
    const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

    const adminId = useSelector((state: RootState) => state.user.user?.id);
    const adminRole = useSelector((state: RootState) => state.user.user?.role);
    const isAuthenticated = Boolean(useSelector((state: RootState) => state.user.user?.id));

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: chattedVendorsResponse, isLoading } = useGetVendorsChatAdmin(debouncedSearch);
    const { data: oldMessagesData } = useGetAdminChatMessages(selectedVendor?.id || '', !!selectedVendor);
    const { data: unReadMsgResponse } = useGetAdminUnreadChats(isAuthenticated);
    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, liveUnreadCounts, clearLiveUnread } = useSocketChat(isAuthenticated, adminRole!, adminId!, selectedVendor?.id,);
    const { mutate: markMessageAsRead } = useMarkMsgRead();

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
                msg.fromId === adminId ? msg.toId : msg.fromId;

            const time = new Date(msg.timestamp).getTime();
            const existing = map.get(otherId) || 0;

            if (time > existing) {
                map.set(otherId, time);
            }
        });

        return map;
    }, [oldMessages, liveMessages, adminId]);

    const sortedChats = useMemo(() => {
        return [...vendors].sort((a, b) => {
            const timeA = chatLastActivity.get(a.id) || 0;
            const timeB = chatLastActivity.get(b.id) || 0;
            return timeB - timeA;
        });
    }, [vendors, chatLastActivity]);

    const handleTyping = () => {
        if (selectedVendor) {
            sendTyping(selectedVendor.id, selectedVendor.role);
        }
    };

    const handleSend = () => {
        if (!msg.trim() || !selectedVendor) return;

        sendMessage({ toId: selectedVendor.id, toRole: 'vendor', message: msg.trim() });
        setMsg('');
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
                </div>

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
                    currentUserId={adminId as string}
                    combinedMessages={combinedMessages}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminChatPage;
