import { createAmenity, getActiveAmenities, getAllAmenities, getUsedActiveAmenities, toggleBlockAmenity, updateAmenity } from "@/services/adminService";
import { IAmenity, TCreateAmenityData } from "@/types/component.types";
import { showError, showSuccess } from "@/utils/customToast";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetAllAmenities = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ['amenities', page, limit, search],
        queryFn: () => getAllAmenities(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};

export const useGetUsedActiveAmenities = () => {
    return useQuery({
        queryKey: ['used-amenities'],
        queryFn: () => getUsedActiveAmenities(),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
}

export const useGetActiveAmenities = () => {
    return useQuery({
        queryKey: ['active-amenities'],
        queryFn: () => getActiveAmenities(),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

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
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong')
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
        onError: (error: any) => {
            console.log('error logging: ', error)
            showError(error.response?.data?.message || 'Something went wrong')
        }
    })
}


export const useBlockAmenity = (page: number, limit: number, cbFn: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (amenityId: string) => toggleBlockAmenity(amenityId),
        onMutate: async (amenityId: string) => {
            await queryClient.cancelQueries({ queryKey: ['amenities', page, limit, ''] });

            const prevAmenities = queryClient.getQueryData(['amenities', page, limit, '']);

            queryClient.setQueryData(['amenities', page, limit, ''], (oldData: any) => {
                return {
                    ...oldData,
                    data: oldData?.data?.map((amenity: IAmenity) => {
                        if (amenity._id === amenityId) {
                            amenity.isActive = !amenity.isActive;
                        }
                        return amenity;
                    }),
                };
            });

            return { prevAmenities };
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                cbFn();
            } else {
                showError(res.message || 'Something went wrong');
            }
        },
        onError: (error: any, _amenityId, context) => {
            if (context?.prevAmenities) {
                queryClient.setQueryData(['amenities', page, limit, ''], context.prevAmenities);
            }

            console.error('Error:', error);
            showError(error.response?.data?.message || 'Something went wrong');
        },
    });
};



