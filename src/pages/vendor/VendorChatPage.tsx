import React, { useEffect, useMemo, useState } from 'react';
import { useGetVendorChatCustomers, useGetVendorChatMessages, useGetVendorUnreadChats, useMarkMsgRead, useSocketChat } from '@/hooks/user/useChat';
import ChatPage from '@/components/chat/ChatPage';
import { User } from '@/types/user.types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import VendorLayout from '@/components/layouts/VendorLayout';

const VendorChatPage: React.FC = () => {
    const [msg, setMsg] = useState('');
    const [selectedUser, setSelectedUser] = useState<Pick<User, 'id' | 'firstName' | 'role'> | null>(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    const currentVendorId = useSelector((state: RootState) => state.vendor.vendor?.id);
    const isAuthenticated = Boolean(useSelector((state: RootState) => state.vendor.vendor?.id))
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: unReadMsgResponse } = useGetVendorUnreadChats();
    const { mutate: markMessageAsRead } = useMarkMsgRead();
    const { data: chattedUsersResponse, isLoading } = useGetVendorChatCustomers(debouncedSearch);
    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, liveUnreadCounts } = useSocketChat(isAuthenticated, selectedUser?.id, currentVendorId, 'vendor');
    const { data: oldMessagesData } = useGetVendorChatMessages(selectedUser?.id || '', !!selectedUser);

    const users = chattedUsersResponse || []
    const unreadMsg = unReadMsgResponse?.data;
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
                msg.fromId === currentVendorId ? msg.toId : msg.fromId;

            const time = new Date(msg.timestamp).getTime();
            const existing = map.get(otherId) || 0;

            if (time > existing) {
                map.set(otherId, time);
            }
        });

        return map;
    }, [oldMessages, liveMessages, currentVendorId]);

    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            const timeA = chatLastActivity.get(a.id) || 0;
            const timeB = chatLastActivity.get(b.id) || 0;
            return timeB - timeA;
        });
    }, [users, chatLastActivity]);

    useEffect(() => {
        if (selectedUser?.id) {
            markMessageAsRead(selectedUser?.id)
        }
    }, [selectedUser]);

    const handleTyping = () => {
        if (selectedUser) {
            sendTyping(selectedUser.id, selectedUser.role);
        }
    };

    const handleSend = () => {
        if (!msg.trim() || !selectedUser) return;

        sendMessage({
            toId: selectedUser.id,
            toRole: 'vendor',
            message: msg.trim(),
        });

        setMsg('');
    };

    return (
        <VendorLayout>
            <>
                <ChatPage
                    isLoading={isLoading}
                    users={sortedUsers}
                    setSelectedUser={setSelectedUser}
                    selectedUser={selectedUser!}
                    msg={msg}
                    setMsg={setMsg}
                    liveUnreadCounts={liveUnreadCounts}
                    unreadCounts={unreadMsg}
                    handleSend={handleSend}
                    handleTyping={handleTyping}
                    typingStatus={typingStatus}
                    currentUserId={currentVendorId as string}
                    combinedMessages={combinedMessages}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </>
        </VendorLayout>
    );
};

export default VendorChatPage;
