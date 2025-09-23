import { createAmenity, getAllAmenities, toggleBlockAmenity, updateAmenity } from "@/services/adminService";
import { getUserAmenities } from "@/services/userService";
import { getVendorAmenities } from "@/services/vendorService";
import { TCreateAmenityData } from "@/types/component.types";
import { ICustomError, TSortOption } from "@/types/custom.types";
import { TGetAmenityResponse } from "@/types/response.types";
import { showError, showSuccess } from "@/utils/customToast";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetAllAmenities = (page: number, limit: number, type: 'hotel' | 'room', search?: string, sortOption?: TSortOption) => {
    return useQuery({
        queryKey: ['amenities', { page, limit, type, search, sortOption }],
        queryFn: () => getAllAmenities(page, limit, type, search, sortOption),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};

// export const useGetUsedActiveAmenities = () => {
//     return useQuery({
//         queryKey: ['used-amenities'],
//         queryFn: () => getUsedActiveAmenities(),
//         staleTime: 5 * 60 * 1000,
//         placeholderData: keepPreviousData,
//     });
// }

export const useGetUserAmenities = () => {
    return useQuery({
        queryKey: ['user-amenities'],
        queryFn: getUserAmenities,
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

export const useGetVendorAmenities = () => {
    return useQuery({
        queryKey: ['vendor-amenities'],
        queryFn: getVendorAmenities,
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
}


// export const useGetActiveAmenities = () => {
//     return useQuery({
//         queryKey: ['active-amenities'],
//         queryFn: () => getActiveAmenities(),
//         staleTime: 5 * 60 * 1000,
//         placeholderData: keepPreviousData,
//     })
// }

export const useCreateAmentiy = (page: number, limit: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: TCreateAmenityData) => createAmenity(data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['amenities', page, limit, ''] });
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


export const useUpdateAmenity = (page: number, limit: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<TCreateAmenityData> & { id: string }) => updateAmenity(data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ['amenities', page, limit, ''] });
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

            const allQueries = queryClient.getQueriesData<TGetAmenityResponse>({ queryKey: ['amenities'] });

            allQueries.forEach(([key, _]) => {
                queryClient.setQueryData(key, (prev: TGetAmenityResponse) => ({
                    ...prev,
                    data: prev?.data?.map(amenity =>
                        amenity._id == amenityId ? { ...amenity, isActive: !amenity.isActive } : amenity
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
