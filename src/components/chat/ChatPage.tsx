import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Chat from './Chat';
import { IChatPageProps } from '@/types/chat.types';
import { Loader2 } from 'lucide-react';

const ChatPage: React.FC<IChatPageProps> = ({
    isLoading,
    users,
    setSelectedUser,
    selectedUser,
    msg,
    setMsg,
    handleSend,
    handleTyping,
    typingStatus,
    currentUserId,
    combinedMessages }) => {

    return (
        <div className="grid grid-cols-12 gap-6 h-[70vh]">
            {/* Left Sidebar: User List */}
            <Card className="col-span-4 flex flex-col bg-[#402e57] text-white">
                <div className="p-4 border-b">
                    <Input placeholder="Search users..." className='bg-white text-black' />
                </div>
                <ScrollArea className="flex-grow px-2">
                    {isLoading ? (
                        <div className="p-4 text-sm text-gray-500 flex items-center gap-2">
                            <span>Loading users</span>
                            <Loader2 className='animate-spin' />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">No users have messaged yet.</div>
                    ) : (
                        users.map((user) => (
                            <div key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`p-3 my-1 cursor-pointer rounded-md flex items-center gap-3 hover:bg-[#4e3c69] transition ${selectedUser?.id === user.id ? 'bg-[#4e3c69] font-semibold' : ''}`}   >
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
                <div className="m-0 px-4 py-3 border-b font-bold bg-[#402e57] text-white flex items-center gap-2">
                    {selectedUser ? (
                        <>
                            <span className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-700'>
                                {selectedUser.firstName?.charAt(0).toUpperCase()}
                            </span>
                            <span>{selectedUser.firstName}</span>
                        </>
                    ) : (
                        <span className="text-sm text-gray-300">Select a user to chat</span>
                    )}
                </div>
                <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
                    {selectedUser ? (
                        <>
                            {combinedMessages.length === 0 && (
                                <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">
                                    No messages yet. Say hello
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
                            Select a user to start chatting
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ChatPage