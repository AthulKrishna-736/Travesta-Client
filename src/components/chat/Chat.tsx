import { SocketMessage } from '@/utils/socket';
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatProps {
    msg: string;
    setMsg: (msg: string) => void;
    messages: SocketMessage[];
    handleSend: () => void;
}

const Chat: React.FC<ChatProps> = ({ msg, setMsg, messages, handleSend }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const isSender = (role: string) => role === 'user';

    return (
        <div className="flex flex-col flex-grow overflow-hidden"> 

            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 space-y-4">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${isSender(m.from.role) ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`inline-block px-4 py-2 rounded-xl shadow-sm text-sm my-1 break-words whitespace-pre-wrap ${isSender(m.from.role)
                                    ? 'bg-violet-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                }`}
                            style={{ maxWidth: '40%' }} 
                        >
                            <p>{m.message}</p>
                        </div>

                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t bg-white p-3 flex gap-2 items-center">
                <Input
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-traveste-600"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                    }}
                />
                <Button
                    onClick={handleSend}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-all flex items-center gap-2"
                >
                    <span className="hidden sm:inline">Send</span>
                    <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
                </Button>
            </div>
        </div>
    );
};

export default Chat;
