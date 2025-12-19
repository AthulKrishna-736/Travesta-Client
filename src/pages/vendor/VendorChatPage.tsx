import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetVendorChatCustomers, useGetVendorChatMessages, useGetVendorUnreadChats, useMarkMsgRead, useSocketChat } from '@/hooks/user/useChat';
import { SendMessagePayload } from '@/types/chat.types';
import ChatPage from '@/components/chat/ChatPage';
import { User } from '@/types/user.types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import VendorLayout from '@/components/layouts/VendorLayout';

const VendorChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [msg, setMsg] = useState('');
    const [selectedUser, setSelectedUser] = useState<Pick<User, 'id' | 'firstName' | 'role'> | null>(null);
    const currentVendorId = useSelector((state: RootState) => state.vendor.vendor?.id);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: unReadMsgResponse } = useGetVendorUnreadChats();
    const { mutate: markMessageAsRead } = useMarkMsgRead();
    const { data: chattedUsersResponse, isLoading } = useGetVendorChatCustomers(debouncedSearch);
    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, liveUnreadCounts } = useSocketChat(selectedUser?.id, currentVendorId, 'vendor');
    const { data: oldMessagesData } = useGetVendorChatMessages(selectedUser?.id || '', !!selectedUser);

    const users = chattedUsersResponse || []
    const unreadMsg = unReadMsgResponse?.data;
    const oldMessages = oldMessagesData || [];
    const combinedMessages = [
        ...oldMessages,
        ...liveMessages.filter(
            (liveMsg) => !oldMessages.some((oldMsg) => oldMsg._id === liveMsg._id)
        ),
    ];

    useEffect(() => {
        if (selectedUser?.id) {
            markMessageAsRead(selectedUser?.id)
        }
    }, [selectedUser?.id]);

    useEffect(() => {
        if (selectedUser?.id) {
            queryClient.invalidateQueries({
                queryKey: ['chat-history', selectedUser.id],
            });
        }
    }, [selectedUser?.id, queryClient]);

    const handleTyping = () => {
        if (selectedUser) {
            sendTyping(selectedUser.id, selectedUser.role);
        }
    };

    const handleSend = () => {
        if (msg.trim() && selectedUser && currentVendorId) {
            const payload: SendMessagePayload = {
                toId: selectedUser.id,
                toRole: selectedUser.role,
                message: msg.trim(),
            };
            sendMessage(payload);
            setMsg('');
            queryClient.invalidateQueries({ queryKey: ['chat-history', selectedUser.id] });
        }
    };


    return (
        <VendorLayout>
            <>
                <ChatPage
                    isLoading={isLoading}
                    users={users}
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
