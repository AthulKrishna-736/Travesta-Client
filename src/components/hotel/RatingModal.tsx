import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ratingSchema } from "@/utils/validations/commonValidation";
import { yupResolver } from "@hookform/resolvers/yup";

export type TRatingFormData = {
    hospitality: number;
    cleanliness: number;
    facilities: number;
    room: number;
    moneyValue: number;
    review: string;
};

interface RatingModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TRatingFormData) => void;
    isEdit?: boolean;
    ratingData?: Partial<TRatingFormData> | null;
}

const RatingModal = ({ open, onClose, onSubmit, isEdit = false, ratingData }: RatingModalProps) => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<TRatingFormData>({
        resolver: yupResolver(ratingSchema),
    });

    const fields = ["hospitality", "cleanliness", "facilities", "room", "moneyValue"] as const;

    const [stars, setStars] = useState<Record<string, number>>({
        hospitality: 0,
        cleanliness: 0,
        facilities: 0,
        room: 0,
        moneyValue: 0,
    });

    useEffect(() => {
        if (ratingData) {
            Object.entries(ratingData).forEach(([key, val]) => {
                if (val !== undefined) {
                    setStars((prev) => ({ ...prev, [key]: val as number }));
                    setValue(key as keyof TRatingFormData, val);
                }
            });

            if (ratingData.review) {
                setValue("review", ratingData.review);
            }
        } else {
            setStars({
                hospitality: 0,
                cleanliness: 0,
                facilities: 0,
                room: 0,
                moneyValue: 0,
            });
        }
    }, [ratingData]);


    const handleStarClick = (field: string, value: number) => {
        console.log(field, value)
        setStars((prev) => ({ ...prev, [field]: value }));
        setValue(field as keyof TRatingFormData, value);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {isEdit ? "Edit Rating" : "Add Rating"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update your rating and review for this hotel."
                            : "Share your rating and review for this hotel."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data) => {
                        onSubmit(data);
                        onClose();
                    })}
                    className="space-y-6"
                >
                    {fields.map((fieldName) => (
                        <div key={fieldName}>
                            <Label className="capitalize">{fieldName}</Label>
                            <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => handleStarClick(fieldName, num)}
                                    >
                                        <Star
                                            size={28}
                                            className={
                                                num <= stars[fieldName]
                                                    ? "text-yellow-500 fill-yellow-500"
                                                    : "text-gray-400"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Validation message */}
                            {errors[fieldName] && (
                                <p className="text-sm text-red-500">Please rate 1–5 stars.</p>
                            )}

                            {/* Hidden input for react-hook-form */}
                            <input
                                type="hidden"
                                value={stars[fieldName]}
                                {...register(fieldName as any, { required: true, min: 1 })}
                            />
                        </div>
                    ))}

                    <div>
                        <Label>Review</Label>
                        <Textarea
                            {...register("review", { required: true })}
                            placeholder="Share your experience..."
                        />
                        {errors.review && <p className="text-sm text-red-500">Review is required</p>}
                    </div>

                    <Button type="submit" className="w-full">
                        {isEdit ? "Update Rating" : "Submit Rating"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default RatingModal;