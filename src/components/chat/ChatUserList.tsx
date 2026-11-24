import { IChatUserList } from "@/types/chat.types";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import { Search } from "lucide-react";


const ChatUserList = ({ users, isLoading, selectedUser, handleSelectUser, searchText, setSearchText }: IChatUserList) => {
    return (
        <div className="w-1/4 flex flex-col gap-3 h-[75vh]">
            <div className="relative">
                <Search className="absolute h-5 top-[25%] left-[1%]" />
                <input
                    value={searchText}
                    type="text"
                    className="w-full pl-8 py-1.5 placeholder:italic bg-white rounded-sm"
                    placeholder="Search users..."
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className={`flex flex-col gap-1 ${users.length > 0 ? 'justify-start' : 'justify-center'} items-center h-full overflow-y-auto bg-white rounded-sm p-1`}>
                {isLoading ? (
                    <Loader />
                ) : users && users.length > 0 ? (
                    users.map((user) => {
                        return (
                            <div
                                key={user.id}
                                className={`flex justify-between items-center w-full p-1 cursor-pointer ${selectedUser?.id == user.id ? 'bg-gray-100 rounded-sm' : 'bg-white hover:bg-gray-50'}`}
                                onClick={() => handleSelectUser(user)}
                            >
                                <div className="flex items-center gap-2 w-[80%]">
                                    {/* Profile */}
                                    <div className="w-9 h-9 shrink-0 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                                        {user.firstName?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* User Details */}
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-800">
                                            {user.firstName}
                                        </div>

                                        <div className="text-xs text-gray-500 truncate w-36">
                                            {user.lastMessage || "Start a conversation"}
                                        </div>
                                    </div>
                                </div>

                                {/* Message Info */}
                                <div className="flex flex-col gap-2 items-end shrink-0">
                                    {/* Time */}
                                    <div className={`text-xs font-medium ${user.unreadCount > 0 ? "text-green-500" : "text-gray-400"}`}>
                                        {user.lastMessageTime ? new Date(user.lastMessageTime).toLocaleTimeString("en-IN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        }) : ""}
                                    </div>

                                    {/* Unread Badge */}
                                    <div
                                        className={`flex items-center justify-center w-4 h-4 text-[10px] text-white font-medium rounded-full bg-green-500 ${user.unreadCount > 0 ? "visible" : "invisible"
                                            }`}
                                    >
                                        {user.unreadCount}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <EmptyState
                        title="No conversations yet"
                        description="Your conversations will appear here once you start chatting with someone."
                    />)}
            </div>
        </div>
    );
}

export default ChatUserList;