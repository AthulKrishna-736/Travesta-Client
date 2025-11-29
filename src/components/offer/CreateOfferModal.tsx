import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IOfferModalProps, TCreateOffer, TUpdateOffer } from "@/types/offer.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, disablePastDates } from "@/utils/helperFunctions";
import { offerSchema } from "@/utils/validations/commonValidation";
import { useHotelsByVendor } from "@/hooks/vendor/useHotel";

type OfferFormValues = TCreateOffer;

const CreateOfferModal: React.FC<IOfferModalProps> = ({ open, onClose, onSubmit, isEdit = false, offerData, isLoading = false }) => {
    const { data: hotelsData } = useHotelsByVendor(1, 40);
    const hotels = hotelsData?.data;

    const { register, handleSubmit, formState: { errors }, reset, } = useForm<OfferFormValues>({
        resolver: yupResolver(offerSchema),
        defaultValues: {
            name: '',
            hotelId: null,
            roomType: "AC",
            discountType: "flat",
            discountValue: 0,
            startDate: formatDate(new Date()),
            expiryDate: formatDate(new Date()),
        },
    });

    useEffect(() => {
        if (isEdit && offerData) {
            reset({
                name: offerData.name,
                hotelId: offerData.hotelId || null,
                roomType: offerData.roomType,
                discountType: offerData.discountType,
                discountValue: offerData.discountValue,
                startDate: formatDate(offerData.startDate),
                expiryDate: formatDate(offerData.expiryDate),
            });
        } else {
            reset({
                name: '',
                hotelId: null,
                roomType: "AC",
                discountType: "flat",
                discountValue: 0,
                startDate: formatDate(new Date()),
                expiryDate: formatDate(new Date()),
            });
        }
    }, [isEdit, offerData, reset]);

    const submitHandler = (data: OfferFormValues) => {
        const sanitized = {
            ...data,
            name: data.name.trim(),
            hotelId: data.hotelId?.trim() || undefined,
        };

        if (isEdit && offerData?.id) {
            onSubmit({ ...sanitized, id: offerData.id, } as TUpdateOffer, true);
        } else {
            onSubmit(sanitized, false);
        }
    };

    const startMinDate = disablePastDates(new Date());
    const endMinDate = disablePastDates(new Date(), 1);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white h-auto overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {isEdit ? "Edit Offer" : "Create Offer"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="space-y-4 mt-4"
                >
                    {/* Offer Name */}
                    <div>
                        <label className="text-sm font-medium">Offer Name</label>
                        <Input
                            type="text"
                            placeholder="Enter offer name"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Hotel (Optional) */}
                    <div>
                        <label className="text-sm font-medium">Hotel (Optional)</label>
                        <select
                            {...register("hotelId")}
                            className="border p-2 w-full rounded-md"
                        >
                            {/* Default option */}
                            <option value="">None</option>

                            {/* Map hotels */}
                            {hotels?.map((hotel: any) => (
                                <option key={hotel.id} value={hotel.id}>
                                    {hotel.name}
                                </option>
                            ))}
                        </select>

                        {errors.hotelId && (
                            <p className="text-red-500 text-xs">{errors.hotelId.message}</p>
                        )}
                    </div>


                    {/* Room Type */}
                    <div>
                        <label className="text-sm font-medium">Room Type</label>
                        <select
                            {...register("roomType")}
                            className="border p-2 w-full rounded-md"
                        >
                            <option value="AC">AC</option>
                            <option value="Non-AC">Non-AC</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Suite</option>
                            <option value="Standard">Standard</option>
                        </select>
                        {errors.roomType && (
                            <p className="text-red-500 text-xs">{errors.roomType.message}</p>
                        )}
                    </div>

                    {/* Discount Type */}
                    <div>
                        <label className="text-sm font-medium">Discount Type</label>
                        <select
                            {...register("discountType")}
                            className="border p-2 w-full rounded-md"
                        >
                            <option value="flat">Flat</option>
                            <option value="percent">Percent</option>
                        </select>
                        {errors.discountType && (
                            <p className="text-red-500 text-xs">{errors.discountType.message}</p>
                        )}
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="text-sm font-medium">Discount Value</label>
                        <Input
                            type="number"
                            {...register("discountValue")}
                            placeholder="e.g., 500 or 10%"
                        />
                        {errors.discountValue && (
                            <p className="text-red-500 text-xs">{errors.discountValue.message}</p>
                        )}
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">Start Date</label>
                            <Input
                                type="date"
                                min={startMinDate}
                                {...register("startDate")}
                            />
                            {errors.startDate && (
                                <p className="text-red-500 text-xs">{errors.startDate.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium">End Date</label>
                            <Input
                                type="date"
                                min={endMinDate}
                                {...register("expiryDate")}
                            />
                            {errors.expiryDate && (
                                <p className="text-red-500 text-xs">{errors.expiryDate.message}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2"
                    >
                        {isEdit ? "Update Offer" : "Create Offer"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateOfferModal;
