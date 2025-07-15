import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetChatMessages, useGetChattedUsers, useSocketChat } from '@/hooks/user/useChat';
import Header from '@/components/vendor/Header';
import Sidebar from '@/components/vendor/Sidebar';
import { SendMessagePayload } from '@/types/chat.types';
import ChatPage from '@/components/chat/ChatPage';
import { User } from '@/types/user.types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const VendorChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [selectedUser, setSelectedUser] = useState<Pick<User, 'id' | 'firstName'> | null>(null);
    const currentVendorId = useSelector((state: RootState) => state.vendor.vendor?.id);

    const { data: chattedUsersResponse, isLoading } = useGetChattedUsers();
    const users = chattedUsersResponse || []

    const { messages: liveMessages, sendMessage, sendTyping, sendReadReceipt, typingStatus } = useSocketChat(selectedUser?.id);
    const { data: oldMessagesData } = useGetChatMessages(selectedUser?.id || '', !!selectedUser);
    const oldMessages = oldMessagesData || [];
    const combinedMessages = [
        ...oldMessages,
        ...liveMessages.filter(
            (liveMsg) => !oldMessages.some((oldMsg) => oldMsg._id === liveMsg._id)
        ),
    ];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleTyping = () => {
        if (selectedUser) {
            sendTyping(selectedUser.id, 'user');
        }
    };

    useEffect(() => {
        if (selectedUser && combinedMessages.length > 0) {
            const lastMsg = combinedMessages[combinedMessages.length - 1];
            if (lastMsg && !lastMsg.isRead && lastMsg.toId === currentVendorId && lastMsg._id) {
                sendReadReceipt(lastMsg._id, lastMsg.fromId, lastMsg.fromRole);
            }
        }
    }, [selectedUser, combinedMessages, currentVendorId]);

    const handleSend = () => {
        if (msg.trim() && selectedUser && currentVendorId) {
            const payload: SendMessagePayload = {
                toId: selectedUser.id,
                toRole: 'user',
                message: msg.trim(),
            };
            sendMessage(payload);
            setMsg('');
            queryClient.invalidateQueries({ queryKey: ['chat-history', selectedUser.id] });
        }
    };


    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <div className="flex flex-1 overflow-hidden mt-16">
                <Sidebar isOpen={sidebarOpen} />
                <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-13'}`}>
                    <ChatPage
                        isLoading={isLoading}
                        users={users}
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser!}
                        msg={msg}
                        setMsg={setMsg}
                        handleSend={handleSend}
                        handleTyping={handleTyping}
                        typingStatus={typingStatus}
                        currentUserId={currentVendorId}
                        combinedMessages={combinedMessages}
                    />
                </main>
            </div>
        </div>
    );
};

export default VendorChatPage;
