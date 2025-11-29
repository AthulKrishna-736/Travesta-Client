import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOffer, updateOffer, getVendorOffers, toggleOfferStatus } from "@/services/vendorService";
import { showError, showSuccess } from "@/utils/customToast";
import { ICustomError, TApiSuccessResponse } from "@/types/custom.types";
import { IOffer, TCreateOffer, TUpdateOffer } from "@/types/offer.types";


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
        onError: (err: ICustomError) => {
            showError(err?.response?.data?.message || "Something went wrong");
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
        onError: (err: ICustomError) => {
            showError(err?.response?.data?.message || "Something went wrong");
        },
    });
};


export const useToggleOfferStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (offerId: string) => toggleOfferStatus(offerId),
        onMutate: async (offerId: string) => {
            await queryClient.cancelQueries({ queryKey: ["vendor-offers"] });

            const previousData = queryClient.getQueryData<TApiSuccessResponse<IOffer[]>>(["vendor-offers"]);

            if (previousData) {
                const updated = {
                    ...previousData,
                    data: previousData.data.map((offer) =>
                        offer.id === offerId
                            ? { ...offer, isBlocked: !offer.isBlocked }
                            : offer
                    ),
                };

                queryClient.setQueryData(["vendor-offers"], updated);
            }

            return { previousData };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["vendor-offers"], context.previousData);
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
        retry: 2,
    });
};
