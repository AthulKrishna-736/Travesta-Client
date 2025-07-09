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
    handleTyping: () => void;
    typingStatus: boolean;
}

const Chat: React.FC<ChatProps> = ({ msg, setMsg, messages, handleSend, handleTyping, typingStatus, }) => {
    const messageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const isSender = (role: string) => role === 'user';

    return (
        <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 space-y-4">
                <div
                    ref={messageContainerRef}
                    className="flex-grow overflow-y-auto bg-gray-50 p-4 space-y-4"
                >
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`flex ${isSender(m.fromRole) ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`inline-block px-4 py-2 rounded-xl shadow-sm text-sm my-1 break-words whitespace-pre-wrap ${isSender(m.fromRole)
                                    ? 'bg-violet-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                    }`}
                                style={{ maxWidth: '40%' }}
                            >
                                <p>{m.message}</p>
                            </div>
                        </div>
                    ))}

                    {typingStatus && (
                        <div className="text-sm text-gray-400 italic">Typing...</div>
                    )}
                </div>
            </div>

            <div className="border-t bg-white p-3 flex gap-2 items-center">
                <Input
                    value={msg}
                    onChange={(e) => {
                        setMsg(e.target.value);
                        handleTyping();
                    }}
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
