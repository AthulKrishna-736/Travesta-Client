import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addWalletCredit, createPaymentIntent, createWallet, getWallet } from "@/services/userService";
import { showSuccess, showError } from "@/utils/customToast";

// Get Wallet
export const useGetWallet = () => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: getWallet,
        staleTime: 5 * 60 * 1000,
    });
};

// Create Wallet
export const useCreateWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWallet,
        onSuccess: (res) => {
            res.success ? showSuccess(res.message) : showError(res.message || "Something went wrong");
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
        onError: (err: any) => {
            showError(err?.response?.data?.message || "Failed to create wallet");
        }
    });
};

// Add Credit to Wallet
export const useAddWalletCredit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ amount, transactionId }: { amount: number, transactionId: string }) => addWalletCredit({ type: 'credit', amount, description: 'Wallet top-up via Stripe', transactionId }),
        onSuccess: (res) => {
            res.success ? showSuccess(res.message) : showError(res.message || "Something went wrong");
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
        onError: (err: any) => {
            showError(err?.response?.data?.message || "Failed to credit wallet");
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
        onError: (err: any) => {
            showError(err?.response?.data?.message || "Failed to create payment intent");
        }
    });
};
