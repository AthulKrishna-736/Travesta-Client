import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { SendMessagePayload, useSocketChat } from '@/utils/socket';
import Chat from '@/components/chat/Chat';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAllUsers } from '@/hooks/admin/useGetAllUsers';
import { UserType } from '@/types/response.types';


const UserChatPage: React.FC = () => {
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<UserType | null>();
    const { messages, sendMessage } = useSocketChat();

    const { data, isLoading } = useGetAllUsers(1, 20, 'vendor');

    const vendors: UserType[] = data?.data || [];

    const handleSend = () => {
        if (msg.trim() && selectedVendor) {
            const payload: SendMessagePayload = {
                toId: selectedVendor.id,
                toRole: 'vendor',
                message: msg.trim(),
            };
            console.log("📤 Sending message:", payload);
            sendMessage(payload);
            setMsg('');
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gray-50">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <div className="grid grid-cols-12 gap-6 h-[70vh]">
                        {/* Sidebar Vendor List */}
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
                                            className={`p-3 my-1 cursor-pointer rounded-md hover:bg-gray-100 ${selectedVendor?.id === vendor.id ? 'bg-gray-100 font-semibold' : ''
                                                }`}
                                        >
                                            {vendor.firstName}
                                        </div>
                                    ))
                                )}
                            </ScrollArea>

                        </Card>

                        {/* Chat Area */}
                        <Card className="col-span-8 flex flex-col border border-gray-200 rounded-md overflow-hidden">
                            <div className="px-4 py-2 border-b font-bold text-traveste-700">
                                {selectedVendor?.firstName || 'Select a vendor to chat'}
                            </div>
                            <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
                                <Chat
                                    msg={msg}
                                    setMsg={setMsg}
                                    messages={messages}
                                    handleSend={handleSend}
                                />
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
