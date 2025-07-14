import React, { useEffect, useState } from 'react';
import { SendMessagePayload } from '@/utils/socket';
import Chat from '@/components/chat/Chat';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserType } from '@/types/response.types';
import { getVendor } from '@/services/vendorService';
import { useQueryClient } from '@tanstack/react-query';
import { useGetChatMessages, useGetChattedUsers, useSocketChat } from '@/hooks/user/useChat';
import Header from '@/components/vendor/Header';
import Sidebar from '@/components/vendor/Sidebar';

const VendorChatPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [msg, setMsg] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [currentVendorId, setCurrentVendorId] = useState<string>('');

    const { data: chattedUsersResponse, isLoading } = useGetChattedUsers();
    const users: UserType[] = Array.isArray(chattedUsersResponse?.data)
        ? chattedUsersResponse.data.map((u: any) => ({
            id: u.id ?? u._id,
            firstName: u.firstName
        }))
        : [];

    useEffect(() => {
        const fetchVendor = async () => {
            const vendor = await getVendor();
            console.log('vendor: ', vendor)
            if (vendor?.data?.id) {
                setCurrentVendorId(vendor.data.id);
            }
        };
        fetchVendor();
    }, []);

    const { messages: liveMessages, sendMessage, sendTyping, sendReadReceipt, typingStatus } = useSocketChat(selectedUser?.id);
    const { data: oldMessagesData } = useGetChatMessages(selectedUser?.id || '', !!selectedUser);
    const oldMessages = oldMessagesData?.data || [];
    const combinedMessages = [...oldMessages, ...liveMessages];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleTyping = () => {
        if (selectedUser) {
            sendTyping(selectedUser.id, 'user');
        }
    };

    useEffect(() => {
        if (selectedUser && combinedMessages.length > 0) {
            const lastMsg = combinedMessages[combinedMessages.length - 1];
            if (
                lastMsg &&
                !lastMsg.isRead &&
                lastMsg.toId === currentVendorId &&
                lastMsg._id
            ) {
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
                    <div className="grid grid-cols-12 gap-6 h-[70vh]">
                        {/* Left Sidebar: User List */}
                        <Card className="col-span-4 flex flex-col bg-[#402e57] text-white">
                            <div className="p-4 border-b">
                                <Input placeholder="Search users..." className='bg-white text-black'/>
                            </div>
                            <ScrollArea className="flex-grow px-2">
                                {isLoading ? (
                                    <div className="p-4 text-sm text-gray-500">Loading users...</div>
                                ) : users.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-500">No users have messaged yet.</div>
                                ) : (
                                    users.map((user) => (
                                        <div
                                            key={user.id}
                                            onClick={() => setSelectedUser(user)}
                                            className={`p-3 my-1 cursor-pointer rounded-md flex items-center gap-3 hover:bg-[#4e3c69] transition ${selectedUser?.id === user.id ? 'bg-[#4e3c69] font-semibold' : ''
                                                }`}
                                        >
                                            {/* Profile Picture Placeholder */}
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-700">
                                                {user.firstName?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white">{user.firstName}</span>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        </Card>

                        {/* Chat Panel */}
                        <Card className="col-span-8 flex flex-col border border-gray-200 rounded-md overflow-hidden p-0 gap-0">
                            <div className="m-0 px-4 py-3 border-b font-bold bg-[#402e57] text-white">
                                {selectedUser?.firstName || 'Select a user to chat'}
                            </div>
                            <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
                                {selectedUser ? (
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
                                            currentUserId={currentVendorId}
                                        />
                                    </>
                                ) : (
                                    <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">
                                        Select a user to start chatting
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VendorChatPage;
