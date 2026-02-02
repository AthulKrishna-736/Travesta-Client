import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentIntent, createWallet, getUserTransactions, getWallet } from "@/services/userService";
import { showSuccess, showError } from "@/utils/customToast";
import { getVendorTransactions } from "@/services/vendorService";
import { ICustomError } from "@/types/custom.types";
import { TPaymentIntent } from "@/types/wallet.types";

// Get Wallet
export const useGetWallet = () => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: getWallet,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });
};

export const useGetUserTransactions = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['transactions', { page, limit }],
        queryFn: () => getUserTransactions(page, limit),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}

export const useGetVendorTransactions = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['transactions', { page, limit }],
        queryFn: () => getVendorTransactions(page, limit),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        retry: 1,
    })
}

// Create Wallet
export const useCreateWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWallet,
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
            } else {
                showError(res.message || "Something went wrong");
            }
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: (err: ICustomError) => {
            showError(err.response.data.message || "Failed to create wallet");
        }
    });
};

// Create Stripe Payment Intent
export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: ({ amount, purpose }: TPaymentIntent) => createPaymentIntent({ amount, purpose }),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
            } else {
                showError(res.message || "Something went wrong");
            }
        },
        onError: (err: ICustomError) => {
            showError(err.response.data.message || "Failed to create payment intent");
        }
    });
};
