import { getVendors, updateVendorVerify } from "@/services/adminService"
import { getVendor, updateVendor, uplodKyc } from "@/services/vendorService"
import { setVendor } from "@/store/slices/vendorSlice"
import { TUpdateVendorReqValues } from "@/types/auth.types"
import { TGetVendorsResponse } from "@/types/response.types"
import { showError, showSuccess } from "@/utils/customToast"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"


export const useGetVendor = () => {
    return useQuery({
        queryKey: ['vendor'],
        queryFn: () => getVendor(),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

export const useUpdateVendor = () => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (values: { data: FormData }) => updateVendor(values.data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                dispatch(setVendor(res.data.user))
                queryClient.invalidateQueries({ queryKey: ['vendor'] })
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}

export const useKycUpload = () => {
    const dispatch = useDispatch()

    return useMutation({
        mutationFn: (values: { data: FormData }) => uplodKyc(values.data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message)
                dispatch(setVendor(res.data))
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error?.response?.data?.message || 'Something went wrong')
        }
    })
}

export const useGetVendors = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ['admin-vendor', page, limit, search],
        queryFn: () => getVendors(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData
    })
}

export const useVendorVerify = (page: number, limit: number, search: string, onSuccessCallback: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: TUpdateVendorReqValues) => updateVendorVerify(values),
        onMutate: async (values) => {
            await queryClient.cancelQueries({ queryKey: ['admin-vendor', page, limit, search] });

            const previousVendors = queryClient.getQueryData<any[]>(['admin-vendor', page, limit, search]);

            queryClient.setQueryData(['admin-vendor', page, limit, search], (oldData: TGetVendorsResponse) => {
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