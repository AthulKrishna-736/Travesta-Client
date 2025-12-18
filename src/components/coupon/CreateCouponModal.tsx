import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ICouponModalProps, TCreateCoupon, TUpdateCoupon } from "@/types/coupon.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { couponSchema } from "@/utils/validations/commonValidation";
import { disablePastDates, formatDate } from "@/utils/helperFunctions";

type CouponFormValues = TCreateCoupon;

const CouponModal: React.FC<ICouponModalProps> = ({ open, onClose, onSubmit, isEdit = false, couponData, isLoading, }) => {

    const { register, handleSubmit, reset, formState: { errors }, } = useForm<CouponFormValues>({
        resolver: yupResolver(couponSchema),
        defaultValues: {
            name: "",
            code: "",
            type: "flat",
            value: 0,
            minPrice: 0,
            maxPrice: 0,
            count: 0,
            startDate: formatDate(new Date()),
            endDate: formatDate(new Date()),
        },
    });

    useEffect(() => {
        if (isEdit && couponData) {
            reset({
                name: couponData.name || "",
                code: couponData.code || "",
                type: couponData.type || "flat",
                value: couponData.value || 0,
                minPrice: couponData.minPrice || 0,
                maxPrice: couponData.maxPrice || 0,
                count: couponData.count || 0,
                startDate: couponData.startDate ? formatDate(couponData.startDate) : formatDate(new Date()),
                endDate: couponData.endDate ? formatDate(couponData.endDate) : formatDate(new Date()),
            });
        } else {
            reset({
                name: "",
                code: "",
                type: "flat",
                value: 0,
                minPrice: 0,
                maxPrice: 0,
                count: 0,
                startDate: formatDate(new Date()),
                endDate: formatDate(new Date()),
            });
        }
    }, [isEdit, couponData, reset]);


    const submitHandler = (data: CouponFormValues) => {
        const sanitizedData = {
            ...data,
            name: data.name.trim(),
            code: data.code.trim(),
        };

        if (isEdit && couponData?.id) {
            onSubmit({ ...sanitizedData, id: couponData.id } as TUpdateCoupon, true);
        } else {
            onSubmit(sanitizedData, false);
        }
    };

    const startMinDate = disablePastDates(new Date());
    const endMinDate = disablePastDates(new Date(), 1);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white h-140 overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {isEdit ? "Edit Coupon" : "Create Coupon"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mt-4">

                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium">Coupon Name</label>
                        <Input {...register("name")} placeholder="Special Discount" />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    {/* Code */}
                    <div>
                        <label className="text-sm font-medium">Coupon Code</label>
                        <Input {...register("code")} placeholder="SAVE20" />
                        {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="text-sm font-medium">Type</label>
                        <select {...register("type")} className="border p-2 w-full rounded-md">
                            <option value="flat">Flat</option>
                            <option value="percent">Percent</option>
                        </select>
                        {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
                    </div>

                    {/* Value */}
                    <div>
                        <label className="text-sm font-medium">Value</label>
                        <Input type="number" {...register("value")} placeholder="e.g., 500 or 5%" />
                        {errors.value && <p className="text-red-500 text-xs">{errors.value.message}</p>}
                    </div>

                    {/* Count */}
                    <div>
                        <label className="text-sm font-medium">Count</label>
                        <Input type="number" {...register("count")} placeholder="e.g. 10" />
                        {errors.value && <p className="text-red-500 text-xs">{errors.value.message}</p>}
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">Min Price</label>
                            <Input type="number" {...register("minPrice")} />
                            {errors.minPrice && <p className="text-red-500 text-xs">{errors.minPrice.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Max Price</label>
                            <Input type="number" {...register("maxPrice")} />
                            {errors.maxPrice && <p className="text-red-500 text-xs">{errors.maxPrice.message}</p>}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium">Start Date</label>
                            <Input min={startMinDate} type="date" {...register("startDate")} />
                            {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium">End Date</label>
                            <Input min={endMinDate} type="date" {...register("endDate")} />
                            {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate.message}</p>}
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full mt-2">
                        {isEdit ? "Update Coupon" : "Create Coupon"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CouponModal;
