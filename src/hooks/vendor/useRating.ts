import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { showSuccess, showError } from "@/utils/customToast";
import { createRating, updateRating } from "@/services/userService";
import { ICustomError } from "@/types/custom.types";
import { TRatingFormData } from "@/components/hotel/RatingModal";
import { getHotelRatings } from "@/services/vendorService";

export const useCreateRating = (cbFn: () => void) => {
    return useMutation({
        mutationFn: (data: TRatingFormData & { hotelId: string }) => createRating(data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                cbFn();
            } else {
                showError(res.message || "Something went wrong");
            }
        },
        onError: (error: ICustomError) => {
            showError(error.response.data.message || "Something went wrong");
        }
    });
};

export const useUpdateRating = (cbFn: () => void) => {
    return useMutation({
        mutationFn: (data: TRatingFormData & { ratingId: string }) => updateRating(data),
        onSuccess: (res) => {
            if (res.success) {
                showSuccess(res.message);
                cbFn();
            } else {
                showError(res.message || "Something went wrong");
            }
        },
        onError: (error: ICustomError) => {
            showError(error.response.data.message || "Something went wrong");
        }
    });
};

export const useGetHotelRatings = (hotelId: string) => {
    return useQuery({
        queryKey: ['hotel-rating'],
        queryFn: () => getHotelRatings(hotelId),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
        retry: 2,
    })
}