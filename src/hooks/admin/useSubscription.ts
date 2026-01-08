import { createPlan, getAllPlanHistory, getAllPlans, updatePlan } from "@/services/adminService"
import { cancelSubscription, getActivePlan, getUserSubscriptions, subscribePlan } from "@/services/userService"
import { ICustomError } from "@/types/custom.types"
import { TCreatePlan, TUpdatePlan } from "@/types/plan.types"
import { showError, showSuccess } from "@/utils/customToast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetSubscriptionPlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: getUserSubscriptions,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        retry: 1,
    })
}

export const useGetAllPlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: getAllPlans,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        retry: 1,
    })
}

export const useGetUserActivePlan = (enabled: boolean) => {
    return useQuery({
        queryKey: ['user-plan'],
        queryFn: getActivePlan,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        enabled,
        retry: 1,
    })
}

export const useGetPlanHistory = (page: number, limit: number, type: 'basic' | 'medium' | 'vip' | 'all') => {
    return useQuery({
        queryKey: ['planHistory', page, limit, type],
        queryFn: () => getAllPlanHistory(page, limit, type),
        placeholderData: (prev) => prev,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useCreatePlans = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TCreatePlan) => createPlan(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong');
            }
        },
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error.response.data.message || 'Something went wrong')
        }
    })
}

export const useUpdatePlans = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TUpdatePlan & { planId: string }) => updatePlan(data, data.planId),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong');
            }
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error.response.data.message || 'Something went wrong')
        }
    })
}

export const useSubscribePlan = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ planId, method }: { planId: string; method: 'wallet' | 'online' }) => subscribePlan(planId, method),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['user-plan'] })
            queryClient.invalidateQueries({ queryKey: ['wallet'] })
            queryClient.invalidateQueries({ queryKey: ['transactions'] })

            if (res.success) {
                showSuccess(res.message || "Subscription successful!");
            } else {
                showError(res.message || "Something went wrong");
            }
        },
        onError: (error: ICustomError) => {
            console.error("Subscription error:", error);
            showError(error.response?.data?.message || "Subscription failed");
        },
    });
};

export const useCancelSubscription = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: cancelSubscription,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['user-plan'] })
            queryClient.invalidateQueries({ queryKey: ['wallet'] })
            queryClient.invalidateQueries({ queryKey: ['transactions'] })

            if (res.success) {
                showSuccess(res.message || "Subscription successful!");
            } else {
                showError(res.message || "Something went wrong");
            }
        },
        onError: (error: ICustomError) => {
            console.error("Subscription error:", error);
            showError(error.response?.data?.message || "Subscription failed");
        },
    });
}