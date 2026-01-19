import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { planFormSchema } from "@/utils/validations/commonValidation";
import { PlanFormData, PlanFormModalProps, PlanSubmitData } from "@/types/plan.types";


const PlanFormModal: React.FC<PlanFormModalProps> = ({ open, title, onCancel, onSubmit, loading = false, initialData }) => {
    const [type, setType] = React.useState<"basic" | "medium" | "vip">("basic");

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<PlanFormData>({
        resolver: yupResolver(planFormSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            duration: 30,
            features: [{ value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "features",
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    description: initialData.description,
                    price: initialData.price,
                    duration: initialData.duration,
                    features: initialData.features.map(f => ({ value: f })),
                });
                setType(initialData.type);
            } else {
                reset({
                    name: "",
                    description: "",
                    price: 0,
                    duration: 30,
                    features: [{ value: "" }],
                });
                setType("basic");
            }
        }
    }, [open, initialData, reset]);

    const handleFormSubmit = (data: PlanFormData) => {
        const finalPlanData: PlanSubmitData = {
            ...data,
            type,
            features: data.features.map(f => f.value),
        }
        onSubmit(finalPlanData);
    };

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900">{title}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Plan Name</Label>
                            <Input id="name" placeholder="Enter plan name" {...register("name")} disabled={loading} />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="type">Plan Type</Label>
                            <Select value={type} onValueChange={(val) => setType(val as "basic" | "medium" | "vip")} disabled={loading}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Enter plan description" {...register("description")} disabled={loading} />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input id="price" type="number" placeholder="Enter price" {...register("price")} min={1} disabled={loading} />
                            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="duration">Duration (days)</Label>
                            <Input id="duration" type="number" placeholder="Enter duration" {...register("duration")} min={1} disabled={loading} />
                            {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label>Features</Label>
                        <div className="space-y-2 mt-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <Input
                                        placeholder="Enter feature"
                                        {...register(`features.${index}.value`)}
                                        disabled={loading}
                                    />
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            disabled={loading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {errors.features && <p className="text-sm text-red-500">{errors.features.message}</p>}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ value: "" })}
                            disabled={loading}
                            className="mt-2"
                        >
                            Add Feature
                        </Button>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Plan" : "Create Plan")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PlanFormModal;