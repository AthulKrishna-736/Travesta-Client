import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Chat from './Chat';
import { IChatPageProps } from '@/types/chat.types';
import { Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';

const ChatPage: React.FC<IChatPageProps> = ({
    isLoading,
    users,
    setSelectedUser,
    selectedUser,
    msg,
    setMsg,
    liveUnreadCounts,
    unreadCounts,
    handleSend,
    handleTyping,
    typingStatus,
    currentUserId,
    combinedMessages,
    searchText,
    setSearchText }) => {

    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 h-[120vh] md:h-[80vh]">
            {/* Left Sidebar: User List */}
            <Card className="col-span-4 flex flex-col bg-[#402e57] text-white">
                <div className="p-4 border-b">
                    <Input
                        placeholder="Search users..."
                        className="bg-white text-black"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
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
                        users.map((user) => {

                            const serverCount = unreadCounts?.find(u => u.id === user.id)?.count || 0;
                            const liveCount = liveUnreadCounts[user.id] || 0;
                            const totalCount = serverCount + liveCount;

                            return (
                                <div key={user.id} onClick={() => setSelectedUser(user)}
                                    className={`relative p-3 my-1 cursor-pointer rounded-md flex items-center gap-3 hover:bg-[#4e3c69] transition ${selectedUser?.id === user.id ? 'bg-[#4e3c69] font-semibold' : ''}`} >

                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                                        {user.firstName?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className='flex flex-col items-start justify-center w-3/4 overflow-hidden'>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white">{user.firstName}</span>
                                            {totalCount > 0 && (
                                                <Badge className="absolute right-5 my-auto bg-green-500 rounded-full">
                                                    {totalCount}
                                                </Badge>
                                            )}
                                            {user.role === 'admin' && (
                                                <span className="text-xs px-2 py-0.5 bg-yellow-400 text-black rounded-full">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        {user.lastMessage && (
                                            <div className="flex items-center justify-between text-[12px] w-full text-yellow-200 gap-2">

                                                <div className="truncate w-[65%]">
                                                    {user.lastMessage}
                                                </div>

                                                <div className="text-right">
                                                    {new Date(user.lastMessageTime!).toLocaleString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </div>

                                            </div>
                                        )}

                                    </div>
                                </div>
                            )
                        })
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