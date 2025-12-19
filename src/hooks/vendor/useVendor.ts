import { getAdminAnalytics, getVendors, updateVendorVerify } from "@/services/adminService"
import { getVendor, updateVendor, uplodKyc } from "@/services/vendorService"
import { setVendor } from "@/store/slices/vendorSlice"
import { TUpdateVendorReqValues } from '../../types/auth.types'
import { ICustomError, TApiSuccessResponse, TSortOption } from "@/types/custom.types"
import { IUser } from "@/types/user.types"
import { showError, showSuccess } from "@/utils/customToast"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"


export const useGetVendor = () => {
    return useQuery({
        queryKey: ['vendor-profile'],
        queryFn: getVendor,
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
        retry: 2,
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
                dispatch(setVendor(res.data))
                queryClient.invalidateQueries({ queryKey: ['vendor'] })
            } else {
                showError(res.message || 'Something went wrong')
            }
        },
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error.response.data.message || 'Something went wrong')
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
        onError: (error: ICustomError) => {
            console.log('error logging: ', error)
            showError(error.response.data.message || 'Something went wrong')
        }
    })
}

export const useGetVendors = (page: number, limit: number, search?: string, sortOption?: TSortOption) => {
    return useQuery({
        queryKey: ['admin-vendor', { page, limit, search, sortOption }],
        queryFn: () => getVendors(page, limit, search, sortOption),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData
    })
}

export const useVendorVerify = (page: number, limit: number, search: string, onSuccessCallback: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: TUpdateVendorReqValues) => updateVendorVerify(values),
        onMutate: async (values) => {
            await queryClient.cancelQueries({ queryKey: ['admin-vendor'], exact: false });

            const previousVendors = queryClient.getQueriesData({ queryKey: ['admin-vendor'], exact: false });

            queryClient.setQueryData(['admin-vendor'], (prev: TApiSuccessResponse<IUser[]>) => {
                return {
                    ...prev,
                    data: prev?.data?.map((vendor) => {
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

        onError: (error: ICustomError, _values, context) => {
            if (context?.previousVendors) {
                queryClient.setQueryData(['admin-vendor', page, limit, search], context.previousVendors);
            }

            console.error('error logging: ', error);
            showError(error.response.data.message || 'Something went wrong');
        },
    });
};


export const useGetAdminAnalytics = () => {
    return useQuery({
        queryKey: ['admin-analytics'],
        queryFn: getAdminAnalytics,
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}