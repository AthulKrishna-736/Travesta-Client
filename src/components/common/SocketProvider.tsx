import { RootState } from "@/store/store";
import { connectChatSocket, disconnectChatSocket, getChatSocket } from "@/utils/socket";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const SocketProvider = () => {
    const isAuthenticated = Boolean(useSelector((state: RootState) => state.user.user));

    useEffect(() => {
        if (!isAuthenticated) {
            disconnectChatSocket()
            return
        }

        const socket = getChatSocket()

        if (socket == null) {
            connectChatSocket()
        } else if (!socket.connected) {
            connectChatSocket()
        }
    }, [isAuthenticated])

    return null
}

export default SocketProvider;