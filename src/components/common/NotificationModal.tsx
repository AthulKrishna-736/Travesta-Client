import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";


export type TNotification = {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
};

interface INotificationModalProps {
    open: boolean;
    onClose: () => void;
    notifications: TNotification[];
    onMarkAsRead: (id: string) => void;
};

const NotificationModal: React.FC<INotificationModalProps> = ({ open, onClose, notifications, onMarkAsRead }) => {
    const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");

    const unreadNotifications = notifications.filter(n => !n.isRead);
    const displayedNotifications = activeTab === "unread" ? unreadNotifications : notifications;

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-w-[420px] max-h-[95%] p-0 overflow-auto">
                <DialogHeader className="px-4 py-3 border-b">
                    <DialogTitle>Notifications</DialogTitle>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex border-b text-sm">
                    <button onClick={() => setActiveTab("unread")} className={`flex-1 py-2 ${activeTab === "unread" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}>
                        Unread ({unreadNotifications.length})
                    </button>

                    <button onClick={() => setActiveTab("all")} className={`flex-1 py-2 ${activeTab === "all" ? "border-b-2 border-black font-medium" : "text-gray-500"}`}>
                        All
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[400px] overflow-y-auto p-3 space-y-3">
                    {displayedNotifications.length === 0 && (
                        <div className="text-center text-sm text-gray-500 py-10">
                            No notifications
                        </div>
                    )}

                    {displayedNotifications.map(notification => (
                        <div key={notification.id} className="border rounded-md p-3 text-sm">
                            <div className="font-medium">{notification.title}</div>

                            <div className="text-gray-600 mt-1">
                                {notification.message}
                            </div>

                            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                <span>
                                    {new Date(notification.createdAt).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </span>

                                {!notification.isRead && (
                                    <button onClick={() => onMarkAsRead(notification.id)} className="text-blue-600 hover:underline">
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-2 text-right">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-black"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NotificationModal;
