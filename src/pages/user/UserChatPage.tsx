import React, { useEffect, useState } from 'react';
import Header from '@/components/header/user/Header';
import { useGetChatMessages, useGetChattedVendors, useSocketChat } from '@/hooks/user/useChat';
import { useQueryClient } from '@tanstack/react-query';
import { SendMessagePayload } from '@/types/chat.types';
import { User } from '@/types/user.types';
import ChatPage from '@/components/chat/ChatPage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import UserSidebar from '@/components/sidebar/UserSidebar';
import { Menu } from 'lucide-react';

const UserChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Pick<User, 'id' | 'firstName' | 'role'> | null>(null);
    const currentUserId = useSelector((state: RootState) => state?.user?.user?.id)
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: chattedVendorsResponse, isLoading } = useGetChattedVendors(debouncedSearch);
    const vendors = chattedVendorsResponse || [];

    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, unreadFrom } = useSocketChat(selectedVendor?.id);

    const sortedVendors = [...vendors].sort((a, b) => {
        const aUnread = unreadFrom.has(a.id);
        const bUnread = unreadFrom.has(b.id);
        if (aUnread && !bUnread) return -1;
        if (!aUnread && bUnread) return 1;
        return 0;
    });

    useEffect(()=> {
        console.log('unread: ', unreadFrom);
    },[unreadFrom])

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

            <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {!sidebarOpen && (
                <button
                    className="fixed top-18 left-1 z-40 bg-yellow-200 p-2 rounded-md shadow-lg lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}
            <main className="flex-grow bg-gray-50 lg:ml-64">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <ChatPage
                        isLoading={isLoading}
                        users={sortedVendors}
                        setSelectedUser={setSelectedVendor}
                        selectedUser={selectedVendor!}
                        msg={msg}
                        setMsg={setMsg}
                        unreadFrom={unreadFrom}
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
        </div>
    );
};

export default UserChatPage;
