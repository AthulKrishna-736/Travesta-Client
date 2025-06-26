import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { SocketMessage, useSocketChat } from '@/utils/socket';
import Chat from '@/components/chat/Chat';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Vendor {
    id: string;
    name: string;
}

const dummyVendors: Vendor[] = [
    { id: 'vendor123', name: 'Tranquil Woods Resort' },
    { id: 'vendor456', name: 'City Palace Inn' },
    { id: 'vendor789', name: 'Beachfront Paradise' },
];

const dummyMessages: SocketMessage[] = [
    {
        from: { role: 'vendor', id: 'vendor123' },
        to: { role: 'user', id: 'user001' },
        message: 'Hi there! How can I help you today?',
    },
    {
        from: { role: 'user', id: 'user001' },
        to: { role: 'vendor', id: 'vendor123' },
        message: 'I’m interested in booking a room for this weekend.',
    },
    {
        from: { role: 'vendor', id: 'vendor123' },
        to: { role: 'user', id: 'user001' },
        message: 'Sure! We have deluxe and sea-view rooms available. 😊',
    },
    {
        from: { role: 'user', id: 'user001' },
        to: { role: 'vendor', id: 'vendor123' },
        message: 'Sea-view sounds perfect. What’s the price?',
    },
    {
        from: { role: 'vendor', id: 'vendor123' },
        to: { role: 'user', id: 'user001' },
        message: 'It’s ₹5,500 per night including breakfast.',
    },
];


const UserChatPage: React.FC = () => {
    const [msg, setMsg] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(dummyVendors[0]);
    const { messages, sendMessage } = useSocketChat();

    const handleSend = () => {
        if (msg.trim() && selectedVendor) {
            sendMessage({
                toId: selectedVendor.id,
                toRole: 'vendor',
                message: msg.trim(),
            });
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
                                {dummyVendors.map((vendor) => (
                                    <div
                                        key={vendor.id}
                                        onClick={() => setSelectedVendor(vendor)}
                                        className={`p-3 cursor-pointer rounded-md hover:bg-gray-100 ${selectedVendor?.id === vendor.id ? 'bg-gray-100 font-semibold' : ''}`}                                    >
                                        {vendor.name}
                                    </div>
                                ))}
                            </ScrollArea>
                        </Card>

                        {/* Chat Area */}
                        <Card className="col-span-8 flex flex-col border border-gray-200 rounded-md overflow-hidden">
                            <div className="px-4 py-2 border-b font-bold text-traveste-700">
                                {selectedVendor?.name || 'Select a vendor to chat'}
                            </div>
                            <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
                                <Chat
                                    msg={msg}
                                    setMsg={setMsg}
                                    messages={dummyMessages}
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
