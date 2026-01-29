import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCoupon, updateCoupon, getVendorCoupon, toggleCouponStatus } from "@/services/vendorService";
import { showError, showSuccess } from "@/utils/customToast";
import { ICustomError, TApiSuccessResponse } from "@/types/custom.types";
import { getUserCoupons } from "@/services/userService";
import { ICoupon, TCreateCoupon, TUpdateCoupon } from "@/types/coupon.types";
import { AxiosError } from "axios";

export const useCreateCoupon = (cb: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: TCreateCoupon) => createCoupon(values),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ["vendor-coupons"] });
                cb();
            } else {
                showError(res.message);
            }
        },
        onError: (err: AxiosError<{ message: string, success: boolean, error: Object }>) => {
            showError(err.response?.data?.message || "Something went wrong");
            console.log('error coupon creation: ', err)
            throw err.response?.data?.error;
        },
    });
};

export const useUpdateCoupon = (cb: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TUpdateCoupon }) => updateCoupon(id, data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ["vendor-coupons"] });
                cb();
            } else {
                showError(res.message);
            }
        },
        onError: (err: ICustomError) => {
            showError(err?.response?.data?.message || "Something went wrong");
        },
    });
};

export const useToggleCouponStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (couponId: string) => toggleCouponStatus(couponId),

        onMutate: async (couponId: string) => {
            await queryClient.cancelQueries({ queryKey: ["vendor-coupons"] });

            const previousData = queryClient.getQueryData<TApiSuccessResponse<ICoupon[]>>(["vendor-coupons"]);

            if (previousData) {
                const updated = {
                    ...previousData,
                    data: previousData.data.map((c) => {
                        return c.id === couponId ? { ...c, isBlocked: !c.isBlocked } : c
                    }
                    ),
                };

                queryClient.setQueryData(["vendor-coupons"], updated);
            }

            return { previousData };
        },

        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["vendor-coupons"], context.previousData);
            }
            showError("Failed to update coupon status");
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message);
            }
        },
    })
}

export const useVendorCoupons = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ["vendor-coupons", { page, limit, search }],
        queryFn: () => getVendorCoupon(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        retry: 2,
    });
};

export const useUserCoupons = (vendorId: string, price: number, enabled: boolean) => {
    return useQuery({
        queryKey: ['user-coupons', { vendorId }],
        queryFn: () => getUserCoupons(vendorId, price),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        enabled,
        retry: 2,
    })
}
