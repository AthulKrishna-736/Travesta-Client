import { updateVendorVerify } from "@/services/adminService";
import { TUpdateVendorReqValues } from "@/types/auth.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVendorVerify = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: TUpdateVendorReqValues) => updateVendorVerify(values),

        onMutate: async (values) => {
            await queryClient.cancelQueries({ queryKey: ['admin-vendor'] });

            const previousVendors = queryClient.getQueryData<any[]>(['admin-vendor']);

            queryClient.setQueryData(['admin-vendor'], (old: any[] | undefined) => {
                return old?.map(v =>
                    v._id === values.vendorId
                        ? { ...v, isVerified: values.isVerified, verificationReason: values.reason }
                        : v
                );
            });

            return { previousVendors };
        },

        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message || 'Something went wrong');
            }
        },

        onError: (error: any, _values, context) => {
            if (context?.previousVendors) {
                queryClient.setQueryData(['admin-vendor'], context.previousVendors);
            }

            console.error('error logging: ', error);
            showError(error.response?.data?.message || 'Something went wrong');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-vendor'] });
        }
    });
};
