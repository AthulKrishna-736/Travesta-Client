import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAmenitySchema } from "@/utils/validations/commonValidation";
import { IAmenitiesModalProps, TCreateAmenityData } from "@/types/amenities.types";


const AmenitiesModal: React.FC<IAmenitiesModalProps> = ({ open, title, onCancel, onSubmit, loading = false, initialData }) => {
    const [type, setType] = React.useState<"hotel" | "room">("hotel");
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Pick<TCreateAmenityData, "name" | "description">>({
        resolver: yupResolver(createAmenitySchema),
        defaultValues: { name: "", description: "" },
    });

    useEffect(() => {
        if (open) {
            reset({
                name: initialData?.name || "",
                description: initialData?.description || "",
            });
            setType(initialData?.type || "hotel");
        }
    }, [open, initialData, reset]);

    const handleFormSubmit = (data: Pick<TCreateAmenityData, "name" | "description">) => {
        onSubmit({ ...data, type });
    };

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900">{title}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter amenity name" {...register("name")} disabled={loading} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Enter amenity description" {...register("description")} disabled={loading} />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={type}
                            onValueChange={(val) => setType(val as "hotel" | "room")}
                            disabled={loading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="room">Room</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? initialData ? "Updating..." : "Creating..."
                                : initialData ? "Update Amenity" : "Create Amenity"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AmenitiesModal;
