import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetChatMessages, useGetVendorsChatAdmin, useSocketChat } from '@/hooks/user/useChat';
import { SendMessagePayload } from '@/types/chat.types';
import { User } from '@/types/user.types';
import ChatPage from '@/components/chat/ChatPage';
import { AdminLayout } from '@/components/header/admin/AdminLayout';

const AdminChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Pick<User, 'id' | 'firstName' | 'role'> | null>(null);
    const adminId = useSelector((state: RootState) => state.admin.admin?.id);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: vendors, isLoading } = useGetVendorsChatAdmin(debouncedSearch);
    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, unreadFrom } = useSocketChat(selectedVendor?.id);
    const { data: oldMessagesData } = useGetChatMessages(selectedVendor?.id || '', !!selectedVendor);
    const oldMessages = oldMessagesData || [];

    const combinedMessages = [
        ...oldMessages,
        ...liveMessages.filter((liveMsg) => !oldMessages.some((oldMsg) => oldMsg._id === liveMsg._id)),
    ];

    useEffect(() => {
        if (selectedVendor?.id) {
            queryClient.invalidateQueries({
                queryKey: ['chat-history', selectedVendor.id],
            });
        }
    }, [selectedVendor?.id, queryClient]);

    const handleTyping = () => {
        if (selectedVendor) {
            sendTyping(selectedVendor.id, selectedVendor.role);
        }
    };

    const handleSend = () => {
        if (msg.trim() && selectedVendor) {
            const payload: SendMessagePayload = {
                toId: selectedVendor.id,
                toRole: selectedVendor.role,
                message: msg.trim(),
            };
            sendMessage(payload);
            setMsg('');
            queryClient.invalidateQueries({ queryKey: ['chat-history', selectedVendor.id] });
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
                </div>

                <ChatPage
                    isLoading={isLoading}
                    users={vendors || []}
                    setSelectedUser={setSelectedVendor}
                    selectedUser={selectedVendor!}
                    msg={msg}
                    setMsg={setMsg}
                    unreadFrom={unreadFrom}
                    handleSend={handleSend}
                    handleTyping={handleTyping}
                    typingStatus={typingStatus}
                    currentUserId={adminId}
                    combinedMessages={combinedMessages}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminChatPage;
