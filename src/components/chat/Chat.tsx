import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IChatProps } from '@/types/chat.types';
import { Check, SendIcon } from 'lucide-react';


const Chat: React.FC<IChatProps> = ({ msg, setMsg, messages, handleSend, handleTyping, typingStatus, currentUserId }) => {
    const messageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const isSender = (fromId: string) => String(fromId) === String(currentUserId);

    return (
        <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex-grow overflow-y-auto bg-[#f1edf7] p-4 space-y-4" ref={messageContainerRef}>
                {messages.map((m, i) => {
                    const sent = isSender(m.fromId);
                    return (
                        <div
                            key={i}
                            className={`flex ${sent ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`inline-block px-4 py-2 rounded-xl shadow-sm text-sm my-1 break-words whitespace-pre-wrap ${sent
                                    ? 'bg-violet-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                    }`}
                                style={{ maxWidth: '70%' }}
                            >
                                <p className="text-sm">{m.message}</p>

                                <div className="flex justify-between items-center mt-1 text-[10px] opacity-70">
                                    <span className="text-xs">
                                        {new Date(m.timestamp).toLocaleString([], {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>

                                    {isSender(m.fromId) && (
                                        <span className="flex items-center gap-[2px]">
                                            <Check
                                                size={12}
                                                className={m.isRead ? 'text-white' : 'text-gray-300'}
                                            />
                                            {m.isRead && (
                                                <Check
                                                    size={12}
                                                    className={m.isRead ? 'text-white' : 'text-gray-300'}
                                                />
                                            )}
                                        </span>
                                    )}
                                </div>

                            </div>
                        </div>
                    );
                })}

                {typingStatus && (
                    <div className="flex justify-start">
                        <div className="inline-block px-4 py-2 rounded-xl shadow-sm text-sm my-1 break-words whitespace-pre-wrap bg-white text-gray-400 border border-gray-200 rounded-bl-none italic">
                            Typing...
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t bg-[#402e57] p-3 flex gap-2 items-center">
                <Input
                    value={msg}
                    onChange={(e) => {
                        setMsg(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 focus:ring-2 focus:ring-traveste-600"
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') handleSend();
                    }}
                />
                <Button
                    onClick={handleSend}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-all flex items-center gap-2"
                >
                    <span className="hidden sm:inline">Send</span>
                    <SendIcon className="w-5 h-5 rotate-45" />
                </Button>
            </div>
        </div>
    );
};

export default Chat;
