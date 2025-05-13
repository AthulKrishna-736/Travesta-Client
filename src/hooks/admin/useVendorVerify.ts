import { updateVendorVerify } from "@/services/adminService";
import { TUpdateVendorReqValues } from "@/types/auth.types";
import { GetVendorsResponse } from "@/types/response.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVendorVerify = (page: number, limit: number, search: string, onSuccessCallback: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: TUpdateVendorReqValues) => updateVendorVerify(values),
        onMutate: async (values) => {
            await queryClient.cancelQueries({ queryKey: ['admin-vendor', page, limit, search] });

            const previousVendors = queryClient.getQueryData<any[]>(['admin-vendor', page, limit, search]);

            queryClient.setQueryData(['admin-vendor', page, limit, search], (oldData: GetVendorsResponse) => {
                return {
                    ...oldData,
                    data: oldData?.data?.map((vendor) => {
                        if (vendor.id == values.vendorId) {
                            vendor.isVerified = values.isVerified
                            vendor.verificationReason = values.reason
                        }
                        return vendor
                    })
                }
            });

            return { previousVendors };
        },

        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                onSuccessCallback()
            } else {
                showError(res.message || 'Something went wrong');
            }
        },

        onError: (error: any, _values, context) => {
            if (context?.previousVendors) {
                queryClient.setQueryData(['admin-vendor', page, limit, search], context.previousVendors);
            }

            console.error('error logging: ', error);
            showError(error.response?.data?.message || 'Something went wrong');
        },
    });
};
