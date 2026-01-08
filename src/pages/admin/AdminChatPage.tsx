import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetAdminChatMessages, useGetAdminUnreadChats, useGetVendorsChatAdmin, useMarkMsgRead, useSocketChat } from '@/hooks/user/useChat';
import { User } from '@/types/user.types';
import ChatPage from '@/components/chat/ChatPage';
import { AdminLayout } from '@/components/layouts/AdminLayout';

const AdminChatPage: React.FC = () => {
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Pick<User, 'id' | 'firstName' | 'role'> | null>(null);
    const adminId = useSelector((state: RootState) => state.admin.admin?.id);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: unReadMsgResponse } = useGetAdminUnreadChats();
    const { mutate: markMessageAsRead } = useMarkMsgRead();
    const { data: chattedVendorsResponse, isLoading } = useGetVendorsChatAdmin(debouncedSearch);
    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, liveUnreadCounts } = useSocketChat(selectedVendor?.id, adminId, 'admin');
    const { data: oldMessagesData } = useGetAdminChatMessages(selectedVendor?.id || '', !!selectedVendor);

    const vendors = chattedVendorsResponse || [];
    const unReadMsg = unReadMsgResponse?.data;
    const oldMessages = oldMessagesData || [];

    const combinedMessages = useMemo(() => {
        const map = new Map();
        [...oldMessages, ...liveMessages].forEach(msg => {
            map.set(msg._id, msg);
        });
        return Array.from(map.values()).sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }, [oldMessages, liveMessages]);

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

    const sortedVendors = useMemo(() => {
        return [...vendors].sort((a, b) => {
            const timeA = chatLastActivity.get(a.id) || 0;
            const timeB = chatLastActivity.get(b.id) || 0;
            return timeB - timeA;
        });
    }, [vendors, chatLastActivity]);

    useEffect(() => {
        if (selectedVendor?.id) {
            markMessageAsRead(selectedVendor?.id)
        }
    }, [selectedVendor]);

    const handleTyping = () => {
        if (selectedVendor) {
            sendTyping(selectedVendor.id, selectedVendor.role);
        }
    };

    const handleSend = () => {
        if (!msg.trim() || !selectedVendor) return;

        sendMessage({
            toId: selectedVendor.id,
            toRole: 'vendor',
            message: msg.trim(),
        });

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
                    users={sortedVendors || []}
                    setSelectedUser={setSelectedVendor}
                    selectedUser={selectedVendor!}
                    msg={msg}
                    setMsg={setMsg}
                    liveUnreadCounts={liveUnreadCounts}
                    unreadCounts={unReadMsg}
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
