import { env } from "@/config/config"
import { USER_APIS } from "@/constants/apiConstants"
import { getNotification, markAllNotifications, markNotificationRead } from "@/services/userService"
import { INotification } from "@/types/notification.types"
import { showError, showSuccess } from "@/utils/customToast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export const useGetNotification = (enabled: boolean) => {
    return useQuery({
        queryKey: ['notification'],
        queryFn: getNotification,
        staleTime: 1 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        enabled,
        retry: 1,
    })
}

export const useMarkAllNotificationRead = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: markAllNotifications,
        onSuccess: (res) => {
            showSuccess(res.message)
            queryClient.invalidateQueries({ queryKey: ['notification'] })
        },
        onError: (err) => {
            showError(err.message)
        }
    })
}

export const useMarkNotification = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (notificationId: string) => markNotificationRead(notificationId),
        onSuccess: (res) => {
            showSuccess(res.message)
            queryClient.invalidateQueries({ queryKey: ['notification'] })
        },
        onError: (err) => {
            showError(err.message)
        }
    })
}

export const useGetLiveNotifications = (isAuthenticated: boolean, setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>) => {
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        if (!isAuthenticated || eventSourceRef.current) return;

        const eventSource = new EventSource(`${env.SERVER_URL}${USER_APIS.notification}/events`, { withCredentials: true });
        eventSourceRef.current = eventSource;

        const onNotification = (e: MessageEvent) => {
            try {
                const data: INotification = JSON.parse(e.data);

                setNotifications(prev => {
                    if (prev.some(n => n.id === data.id)) return prev;
                    return [data, ...prev];
                });
            } catch (err) {
                console.error("Invalid SSE JSON", e.data, err);
            }
        };

        eventSource.addEventListener("notification", onNotification);

        eventSource.onerror = () => {
            eventSource.close();
            eventSourceRef.current = null;
        };

        return () => {
            eventSource.removeEventListener("notification", onNotification);
            eventSource.close();
            eventSourceRef.current = null;
        };
    }, [isAuthenticated, setNotifications]);
};