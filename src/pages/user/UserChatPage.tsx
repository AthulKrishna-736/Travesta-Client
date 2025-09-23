import React, { useEffect, useState } from 'react';
import { useGetUserChatAccess, useGetUserChatMessages, useGetUserChatVendors, useGetUserUnreadChats, useSocketChat } from '@/hooks/user/useChat';
import { useQueryClient } from '@tanstack/react-query';
import { SendMessagePayload } from '@/types/chat.types';
import { User } from '@/types/user.types';
import ChatPage from '@/components/chat/ChatPage';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import UserLayout from '@/components/layouts/UserLayout';

const UserChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const currentUserId = useSelector((state: RootState) => state?.user?.user?.id);
    const [msg, setMsg] = useState<string>('');
    const [selectedVendor, setSelectedVendor] = useState<Pick<User, 'id' | 'firstName' | 'role'> | null>(null);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 400);
        return () => clearTimeout(handler);
    }, [searchText]);

    const { data: chatAccess, isLoading: chatAccessLoading, error: chatAccessError } = useGetUserChatAccess();
    const { data: unReadMsgResponse } = useGetUserUnreadChats();
    const { data: chattedVendorsResponse, isLoading } = useGetUserChatVendors(debouncedSearch);
    const { messages: liveMessages, sendMessage, sendTyping, typingStatus, liveUnreadCounts, bookingError } = useSocketChat(selectedVendor?.id, currentUserId, 'user');
    const { data: oldMessagesData } = useGetUserChatMessages(selectedVendor?.id || '', !!selectedVendor);

    const vendors = chattedVendorsResponse || [];
    const unreadMsg = unReadMsgResponse?.data;
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
        <UserLayout>
            <>
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    {chatAccessLoading ?
                        (
                            <div>
                                Loading....
                            </div>
                        ) : chatAccessError ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <div className="p-50 bg-red-100 border border-red-300 rounded-md shadow-md text-center">
                                    <h2 className="text-xl font-semibold text-red-700">Chat Unavailable {chatAccessError.response.data.message}</h2>
                                    <p className="mt-2 text-gray-700">{bookingError}</p>
                                </div>
                            </div>
                        ) : (
                            <ChatPage
                                isLoading={isLoading}
                                users={vendors}
                                setSelectedUser={setSelectedVendor}
                                selectedUser={selectedVendor!}
                                msg={msg}
                                setMsg={setMsg}
                                liveUnreadCounts={liveUnreadCounts}
                                unreadCounts={unreadMsg}
                                handleSend={handleSend}
                                handleTyping={handleTyping}
                                typingStatus={typingStatus}
                                currentUserId={currentUserId!}
                                combinedMessages={combinedMessages}
                                searchText={searchText}
                                setSearchText={setSearchText}
                            />
                        )}
                </div>
            </>
        </UserLayout>
    );
};

export default UserChatPage;
