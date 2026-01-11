import { TRoles } from "./authentication.types";

//chat model
export interface IChat {
    _id: string
    fromId: string;
    fromRole: TRoles;
    toId: string;
    toRole: TRoles;
    message: string;
    timestamp: string;
    isRead: boolean;
    createdAt?: Date;
    updateAt?: Date;
}

//chat types
export type TResponseChat = IChat;

//component props and types
export interface IChatPageProps {
    isLoading: boolean;
    users: ChatItem[];
    selectedUser: ChatItem;
    handleSelectUser: (data: ChatItem) => void;
    msg: string;
    setMsg: (data: string) => void;
    unreadCounts?: Record<string, number>;
    handleSend: () => void;
    handleTyping: () => void;
    typingStatus: boolean;
    currentUserId: string;
    combinedMessages: IChat[];
    searchText: string;
    setSearchText: (data: string) => void;
}

export interface IChatProps {
    msg: string;
    setMsg: (msg: string) => void;
    messages: IChat[];
    handleSend: () => void;
    handleTyping: () => void;
    typingStatus: boolean;
    currentUserId: string;
}

export interface ChatItem {
    id: string;
    firstName: string;
    role: TRoles;
    lastMessage: string;
    lastMessageTime: number;
    unreadCount: number;
}


//socket types
export interface SendMessagePayload {
    toId: string;
    toRole: TRoles;
    message: string;
}

export interface TypingPayload {
    fromId: string;
    toId: string;
    toRole: TRoles;
}

export interface ReadReceiptPayload {
    messageId: string;
    toId: string;
    toRole: TRoles;
}


