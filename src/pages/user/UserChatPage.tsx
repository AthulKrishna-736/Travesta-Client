import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useGetChatMessages, useGetChattedVendors, useSocketChat } from '@/hooks/user/useChat';
import { useQueryClient } from '@tanstack/react-query';
import { SendMessagePayload } from '@/types/chat.types';
import { User } from '@/types/user.types';
import ChatPage from '@/components/chat/ChatPage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const UserChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Pick<User, 'id' | 'firstName' | 'role'> | null>(null);
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id)
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: chattedVendorsResponse, isLoading } = useGetChattedVendors(debouncedSearch);
    const vendors = chattedVendorsResponse || [];

    const { messages: liveMessages, sendMessage, sendTyping, typingStatus } = useSocketChat(selectedVendor?.id);
    const { data: oldMessagesData } = useGetChatMessages(selectedVendor?.id || '', !!selectedVendor);
    const oldMessages = oldMessagesData || [];
    const combinedMessages = [
        ...oldMessages,
        ...liveMessages.filter(
            (liveMsg) => !oldMessages.some((oldMsg) => oldMsg._id === liveMsg._id)
        ),
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
            sendTyping(selectedVendor.id, 'vendor');
        }
    };

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
                        searchText={searchText}
                        setSearchText={setSearchText}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserChatPage;
