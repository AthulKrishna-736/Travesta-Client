import { createPlan, getAllPlans, updatePlan } from "@/services/adminService"
import { getUserSubscriptions, subscribePlan } from "@/services/userService"
import { ICustomError } from "@/types/custom.types"
import { TCreatePlan, TUpdatePlan } from "@/types/plan.types"
import { showError, showSuccess } from "@/utils/customToast"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetSubscriptionPlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: getUserSubscriptions,
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

export const useGetAllPlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: getAllPlans,
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

export const useCreatePlans = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TCreatePlan) => createPlan(data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong');
            }
            queryClient.invalidateQueries({ queryKey: ['plans'] })
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
    return useMutation({
        mutationFn: ({ planId, method }: { planId: string; method: 'wallet' | 'online' }) => subscribePlan(planId, method),
        onSuccess: (res) => {
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