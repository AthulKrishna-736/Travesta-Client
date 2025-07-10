import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { SendMessagePayload } from '@/utils/socket';
import Chat from '@/components/chat/Chat';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAllUsers } from '@/hooks/admin/useGetAllUsers';
import { UserType } from '@/types/response.types';
import { useGetChatMessages, useSocketChat } from '@/hooks/user/useChat';
import { getUser } from '@/services/userService';
import { useQueryClient } from '@tanstack/react-query';

const UserChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<UserType | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    const { data, isLoading } = useGetAllUsers(1, 20, 'vendor');
    const vendors = data?.data || [];

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            console.log('user: ', user);
            setCurrentUserId(user.data.id);
        };
        fetchUser();
    }, []);

    const { messages: liveMessages, sendMessage, sendTyping, sendReadReceipt, typingStatus } = useSocketChat(selectedVendor?.id);

    const { data: oldMessagesData } = useGetChatMessages(selectedVendor?.id || '', !!selectedVendor);

    const oldMessages = oldMessagesData?.data || [];
    const combinedMessages = [...oldMessages, ...liveMessages];

    const handleTyping = () => {
        if (selectedVendor) {
            sendTyping(selectedVendor.id, 'vendor');
        }
    };

    useEffect(() => {
        if (selectedVendor && combinedMessages.length > 0) {
            const lastMsg = combinedMessages[combinedMessages.length - 1];
            if (
                lastMsg &&
                !lastMsg.isRead &&
                lastMsg.toId === currentUserId &&
                lastMsg._id
            ) {
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
                    <div className="grid grid-cols-12 gap-6 h-[70vh]">
                        <Card className="col-span-4 flex flex-col">
                            <div className="p-4 border-b">
                                <Input placeholder="Search vendors..." />
                            </div>
                            <ScrollArea className="flex-grow px-2">
                                {isLoading ? (
                                    <div className="p-4 text-sm text-gray-500">Loading vendors...</div>
                                ) : vendors.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-500">No vendors found.</div>
                                ) : (
                                    vendors.map((vendor) => (
                                        <div
                                            key={vendor.id}
                                            onClick={() => setSelectedVendor(vendor)}
                                            className={`p-3 my-1 cursor-pointer rounded-md hover:bg-gray-100 ${selectedVendor?.id === vendor.id
                                                ? 'bg-gray-100 font-semibold'
                                                : ''
                                                }`}
                                        >
                                            {vendor.firstName}
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        </Card>

                        <Card className="col-span-8 flex flex-col border border-gray-200 rounded-md overflow-hidden">
                            <div className="px-4 py-2 border-b font-bold text-traveste-700 bg-violet-500 text-white">
                                {selectedVendor?.firstName || 'Select a vendor to chat'}
                            </div>
                            <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
                                {selectedVendor ? (
                                    <>
                                        {combinedMessages.length === 0 && (
                                            <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">
                                                No messages yet. Say hello 👋
                                            </div>
                                        )}
                                        <Chat
                                            msg={msg}
                                            setMsg={setMsg}
                                            messages={combinedMessages}
                                            handleSend={handleSend}
                                            handleTyping={handleTyping}
                                            typingStatus={typingStatus}
                                            currentUserId={currentUserId}
                                        />
                                    </>
                                ) : (
                                    <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">
                                        Select a vendor to start chatting
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserChatPage;
