import { getNotification, getUnreadNotificationCount, markAllNotifications, markNotificationRead } from "@/services/userService"
import { showError, showSuccess } from "@/utils/customToast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useGetNotification = (enabled: boolean) => {
    return useQuery({
        queryKey: ['notification'],
        queryFn: getNotification,
        staleTime: 1 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        enabled,
        retry: 2,
    })
}

export const useGetUnreadNotificationCount = (enabled: boolean) => {
    return useQuery({
        queryKey: ['unreadCount'],
        queryFn: getUnreadNotificationCount,
        staleTime: 1 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        enabled,
        retry: 2,
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