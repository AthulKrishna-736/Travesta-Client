import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addWalletCredit, createPaymentIntent, createWallet, getUserTransactions, getWallet } from "@/services/userService";
import { showSuccess, showError } from "@/utils/customToast";
import { getVendorTransactions } from "@/services/vendorService";
import { ICustomError } from "@/types/custom.types";

// Get Wallet
export const useGetWallet = (enabled: boolean) => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: getWallet,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        enabled,
        retry: 2,
    });
};

export const useGetUserTransactions = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['transactions', { page, limit }],
        queryFn: () => getUserTransactions(page, limit),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        retry: 2,
    });
}

export const useGetVendorTransactions = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['transactions', { page, limit }],
        queryFn: () => getVendorTransactions(page, limit),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        retry: 2,
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
            queryClient.invalidateQueries({ queryKey: ['notification'] })
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: (err: ICustomError) => {
            showError(err.response.data.message || "Failed to create wallet");
        }
    });
};

// Add Credit to Wallet
export const useAddWalletCredit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (amount: number) => addWalletCredit(amount),
        onSuccess: (res) => {
            res.success ? showSuccess(res.message) : showError(res.message || "Something went wrong");
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['notification'] })
        },
        onError: (err: ICustomError) => {
            showError(err.response.data.message || "Failed to credit wallet");
        }
    });
};

// Create Stripe Payment Intent
export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: (amount: number) => createPaymentIntent({ amount }),
        onSuccess: (res) => {
            res.success ? showSuccess(res.message) : showError(res.message || "Something went wrong");
        },
        onError: (err: ICustomError) => {
            showError(err.response.data.message || "Failed to create payment intent");
        }
    });
};
