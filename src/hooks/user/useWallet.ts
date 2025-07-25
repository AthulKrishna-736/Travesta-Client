import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/utils/customToast";
import { addWalletCredit, confirmBooking, createPaymentIntent, createWallet, getWallet } from "@/services/userService";

// GET wallet data
export const useGetWallet = () => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: getWallet,
        staleTime: 5 * 60 * 1000,
    });
};

// Create wallet
export const useCreateWallet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createWallet,
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong')
            }
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message || "Failed to create wallet");
        }
    });
};

// Add credit
export const useAddWalletCredit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => addWalletCredit(amount),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong')
            }
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message || "Failed to credit wallet");
        }
    });
};

// Confirm booking (debit from wallet)
export const useConfirmBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ amount, bookingId }: { amount: number; bookingId: string }) => confirmBooking(amount, bookingId),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong')
            }
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message || "Failed to confirm booking");
        }
    });
};

// Create payment intent for Stripe
export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: (amount: number) => createPaymentIntent(amount),
        onSuccess: () => {
            showSuccess("Payment intent created");
        },
        onError: (error: any) => {
            showError(error?.response?.data?.message || "Failed to create payment intent");
        }
    });
};
