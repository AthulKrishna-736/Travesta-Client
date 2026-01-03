import { createAmenity, getAllAmenities, toggleBlockAmenity, updateAmenity } from "@/services/adminService";
import { getUserAmenities } from "@/services/userService";
import { getVendorAmenities } from "@/services/vendorService";
import { IAmenity, TCreateAmenityData } from "@/types/amenities.types";
import { ICustomError, TApiSuccessResponse, TSortOption } from "@/types/custom.types";
import { showError, showSuccess } from "@/utils/customToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetAllAmenities = (page: number, limit: number, type: 'hotel' | 'room', search?: string, sortOption?: TSortOption) => {
    return useQuery({
        queryKey: ['amenities', { page, limit, type, search, sortOption }],
        queryFn: () => getAllAmenities(page, limit, type, search, sortOption),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        retry: 2,
    });
};

export const useGetUserAmenities = () => {
    return useQuery({
        queryKey: ['user-amenities'],
        queryFn: getUserAmenities,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        retry: 2,
    })
}

export const useGetVendorAmenities = () => {
    return useQuery({
        queryKey: ['vendor-amenities'],
        queryFn: getVendorAmenities,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
        retry: 2,
    });
}

export const useCreateAmentiy = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: TCreateAmenityData) => createAmenity(data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['amenities'], exact: false });
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


export const useUpdateAmenity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<TCreateAmenityData> & { id: string }) => updateAmenity(data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['amenities'], exact: false });
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


export const useBlockAmenity = (cbFn: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (amenityId: string) => toggleBlockAmenity(amenityId),
        onMutate: async (amenityId: string) => {
            await queryClient.cancelQueries({ queryKey: ['amenities'], exact: false });

            const allQueries = queryClient.getQueriesData({ queryKey: ['amenities'] });

            allQueries.forEach(([key]) => {
                queryClient.setQueryData(key, (prev: TApiSuccessResponse<IAmenity[]>) => ({
                    ...prev,
                    data: prev.data.map(amenity =>
                        amenity.id == amenityId ? { ...amenity, isActive: !amenity.isActive } : amenity
                    )
                }))
            })

            return { allQueries };
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                cbFn();
            } else {
                showError(res.message || 'Something went wrong');
            }
        },
        onError: (error: ICustomError, _amenityId, context) => {
            if (context?.allQueries) {
                context.allQueries.forEach(([key, oldData]) => {
                    queryClient.setQueryData(key, oldData);
                });
            }

            console.error('Error:', error);
            showError(error.response.data.message || 'Something went wrong');
        },
    });
};
