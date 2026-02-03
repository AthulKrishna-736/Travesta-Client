import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOffer, updateOffer, getVendorOffers, toggleOfferStatus } from "@/services/vendorService";
import { showError, showSuccess } from "@/utils/customToast";
import { TApiSuccessResponse } from "@/types/custom.types";
import { IOffer, TCreateOffer, TUpdateOffer } from "@/types/offer.types";
import { AxiosError } from "axios";


export const useCreateOffer = (cb: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: TCreateOffer) => createOffer(values),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ["vendor-offers"] });
                cb();
            } else {
                showError(res.message);
            }
        },
        onError: (err: AxiosError<{ success: boolean, message: string, error: object }>) => {
            showError(err?.response?.data.message || "Something went wrong");
            throw err.response?.data.error;
        },
    });
};


export const useUpdateOffer = (cb: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TUpdateOffer }) => updateOffer(id, data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                queryClient.invalidateQueries({ queryKey: ["vendor-offers"] });
                cb();
            } else {
                showError(res.message);
            }
        },
        onError: (err: AxiosError<{ success: boolean, message: string, error: object }>) => {
            showError(err?.response?.data.message || "Something went wrong");
            throw err.response?.data.error
        },
    });
};


export const useToggleOfferStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (offerId: string) => toggleOfferStatus(offerId),
        onMutate: async (offerId: string) => {
            await queryClient.cancelQueries({ queryKey: ["vendor-offers"], exact: false });

            const previousData = queryClient.getQueriesData({ queryKey: ["vendor-offers"] });

            queryClient.setQueriesData<TApiSuccessResponse<IOffer[]>>({ queryKey: ["vendor-offers"] }, (old) => {
                if (!old) return old;

                return {
                    ...old,
                    data: old.data.map((offer) =>
                        offer.id === offerId ? { ...offer, isBlocked: !offer.isBlocked } : offer
                    ),
                };
            })

            return { previousData };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                context.previousData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            showError("Failed to update offer status");
        },
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
            } else {
                showError(res.message);
            }
        },
    });
};

export const useVendorOffers = (page: number, limit: number, search?: string) => {
    return useQuery({
        queryKey: ["vendor-offers", { page, limit, search }],
        queryFn: () => getVendorOffers(page, limit, search),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
        retry: 1,
    });
};
