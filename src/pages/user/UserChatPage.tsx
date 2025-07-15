import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useGetAllUsers } from '@/hooks/admin/useGetAllUsers';
import { useGetChatMessages, useSocketChat } from '@/hooks/user/useChat';
import { useQueryClient } from '@tanstack/react-query';
import { SendMessagePayload } from '@/types/chat.types';
import { User } from '@/types/user.types';
import ChatPage from '@/components/chat/ChatPage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const UserChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Pick<User, 'id' | 'firstName'> | null>(null);
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id)

    const { data, isLoading } = useGetAllUsers(1, 20, 'vendor');
    const vendors = data?.data || [];

    const { messages: liveMessages, sendMessage, sendTyping, sendReadReceipt, typingStatus } = useSocketChat(selectedVendor?.id);
    const { data: oldMessagesData } = useGetChatMessages(selectedVendor?.id || '', !!selectedVendor);
    const oldMessages = oldMessagesData || [];
    const combinedMessages = [
        ...oldMessages,
        ...liveMessages.filter(
            (liveMsg) => !oldMessages.some((oldMsg) => oldMsg._id === liveMsg._id)
        ),
    ];

    const handleTyping = () => {
        if (selectedVendor) {
            sendTyping(selectedVendor.id, 'vendor');
        }
    };

    useEffect(() => {
        if (selectedVendor && combinedMessages.length > 0) {
            const lastMsg = combinedMessages[combinedMessages.length - 1];
            if (lastMsg && !lastMsg.isRead && lastMsg.toId === currentUserId && lastMsg._id) {
                sendReadReceipt(lastMsg._id, lastMsg.fromId, lastMsg.fromRole);
            }
        }
    }, [selectedVendor, combinedMessages, currentUserId]);

    const handleSend = () => {
        if (msg.trim() && selectedVendor) {
            const payload: SendMessagePayload = {
                toId: selectedVendor.id,
                toRole: 'vendor',
                message: msg.trim(),
            };
            sendMessage(payload);
            setMsg('');

            queryClient.invalidateQueries({
                queryKey: ['chat-history', selectedVendor.id],
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gray-50">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <ChatPage
                        isLoading={isLoading}
                        users={vendors}
                        setSelectedUser={setSelectedVendor}
                        selectedUser={selectedVendor!}
                        msg={msg}
                        setMsg={setMsg}
                        handleSend={handleSend}
                        handleTyping={handleTyping}
                        typingStatus={typingStatus}
                        currentUserId={currentUserId}
                        combinedMessages={combinedMessages}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserChatPage;
