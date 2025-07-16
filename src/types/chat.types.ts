import { TRoles } from "./Auth.Types";
import { User } from "./user.types";

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
    users: Pick<User, 'id' | 'firstName' | 'role'>[];
    setSelectedUser: (data: Pick<User, 'id' | 'firstName' | 'role'>) => void;
    selectedUser: Pick<User, 'id' | 'firstName' | 'role'>;
    msg: string;
    setMsg: (data: string) => void;
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
