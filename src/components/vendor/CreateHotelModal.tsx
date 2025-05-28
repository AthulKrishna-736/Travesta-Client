import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { hotelSchema } from '@/utils/validations/commonValidation';
import { ICreateHotelModalProps } from '@/types/component.types';
import { IHotel } from '@/types/user.types';
import { Loader2 } from 'lucide-react';
import MultiImageUploader from '../common/ImageUpload';

const CreateHotelModal: React.FC<ICreateHotelModalProps> = ({ open, onClose, onSubmit, isLoading }) => {
    const [geoLocation, setGeoLocation] = useState<number[] | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<IHotel>({
        resolver: yupResolver(hotelSchema),
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setGeoLocation([longitude, latitude]);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setGeoLocation(null);
                }
            );
        }
    }, []);

    const submitHandler = (data: IHotel) => {
        if (imageFiles.length < 4) {
            alert("Please upload at least 4 image.");
            return;
        }

        const finalPayload = {
            ...data,
            geoLocation: geoLocation || undefined,
            images: imageFiles, 
        };

        console.log("📦 Final payload:", finalPayload);

        onSubmit(finalPayload); 
        setImageFiles([]);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Hotel</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new hotel to the system. Make sure all fields are accurate before submitting.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input {...register('name')} required />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea {...register('description')} required />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Input {...register('address')} required />
                        {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <Label>State</Label>
                            <Input {...register('state')} required />
                            {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                        </div>
                        <div className="w-1/2">
                            <Label>City</Label>
                            <Input {...register('city')} required />
                            {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                        </div>
                    </div>
                    <div>
                        <Label>Tags (comma separated)</Label>
                        <Input {...register('tags')} />
                        {errors.tags && <p className="text-sm text-red-500">{errors.tags.message}</p>}
                    </div>
                    <div>
                        <Label>Amenities (comma separated)</Label>
                        <Input {...register('amenities')} />
                        {errors.amenities && <p className="text-sm text-red-500">{errors.amenities.message}</p>}
                    </div>
                    <div>
                        <Label>Services (comma separated)</Label>
                        <Input {...register('services')} />
                        {errors.services && <p className="text-sm text-red-500">{errors.services.message}</p>}
                    </div>
                    <div>
                        <Label>Images (max 4)</Label>
                        <MultiImageUploader
                            maxImages={4}
                            onImagesChange={(files) => {
                                console.log("🖼️ Image files selected:", files);
                                setImageFiles(files);
                            }}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                Creating...
                            </>
                        ) : (
                            "Create Hotel"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateHotelModal;
