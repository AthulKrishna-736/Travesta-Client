import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICreateHotelModalProps } from '@/types/component.types';
import { IHotel } from '@/types/user.types';
import { Loader2 } from 'lucide-react';
import { showError } from '@/utils/customToast';
import MultiImageUploader from '@/components/common/ImageUpload';
import { hotelSchema } from '@/utils/validations/commonValidation';

export type IHotelFormData = {
    name: string;
    description: string;
    address: string;
    state: string;
    city: string;
    tags: string;
    amenities: string;
    services: string;
};

const CreateHotelModal: React.FC<ICreateHotelModalProps> = ({ open, onClose, onSubmit, isLoading, hotelData = null, isEdit = false, }) => {
    const [geoLocation, setGeoLocation] = useState<number[] | null>(null);
    const [imageFiles, setImageFiles] = useState<File[] | string[]>([]);

    const { register, handleSubmit, formState: { errors }, reset, } = useForm<IHotelFormData>({ resolver: yupResolver(hotelSchema), });

    useEffect(() => {
        if (hotelData) {
            reset(hotelData);
            setImageFiles(hotelData.images as string[] || []);
            setGeoLocation(hotelData.geoLocation || null);
        } else {
            reset();
            setImageFiles([]);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { longitude, latitude } = position.coords;
                        setGeoLocation([longitude, latitude]);
                    },
                    () => setGeoLocation(null)
                );
            }
        }
    }, [hotelData, reset]);

    const submitHandler = (data: IHotelFormData) => {
        if (!isEdit && imageFiles.length !== 4) {
            showError('Please upload exactly 4 images.');
            return;
        }

        if (isEdit && imageFiles.length > 0 && imageFiles.length > 4) {
            showError('You can upload up to 4 images only.');
            return;
        }

        const finalPayload: IHotel & { images: File[] } = {
            ...data,
            geoLocation: geoLocation || [],
            images: imageFiles as File[],
        };

        onSubmit(finalPayload);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Hotel' : 'Create New Hotel'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update the hotel details below and save your changes.' : 'Fill in the details below to add a new hotel to the system.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input {...register('name')} required />
                        {errors.name && (<p className="text-sm text-red-500">{errors.name.message}</p>)}
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea {...register('description')} required />
                        {errors.description && (<p className="text-sm text-red-500">{errors.description.message}</p>)}
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Input {...register('address')} required />
                        {errors.address && (<p className="text-sm text-red-500">{errors.address.message}</p>)}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <Label>State</Label>
                            <Input {...register('state')} required />
                            {errors.state && (<p className="text-sm text-red-500">{errors.state.message}</p>)}
                        </div>
                        <div className="w-1/2">
                            <Label>City</Label>
                            <Input {...register('city')} required />
                            {errors.city && (<p className="text-sm text-red-500">{errors.city.message}</p>)}
                        </div>
                    </div>
                    <div>
                        <Label>Tags (comma separated)</Label>
                        <Input {...register('tags')} />
                        {errors.tags && (<p className="text-sm text-red-500">{errors.tags.message}</p>)}
                    </div>
                    <div>
                        <Label>Amenities (comma separated)</Label>
                        <Input {...register('amenities')} />
                        {errors.amenities && (<p className="text-sm text-red-500">{errors.amenities.message}</p>)}
                    </div>
                    <div>
                        <Label>Services (comma separated)</Label>
                        <Input {...register('services')} />
                        {errors.services && (<p className="text-sm text-red-500">{errors.services.message}</p>)}
                    </div>
                    <div>
                        <Label>Images (max 4)</Label>
                        <MultiImageUploader
                            maxImages={4}
                            onImagesChange={(files) => setImageFiles(files)}
                            initialImageUrls={isEdit && hotelData?.images ? hotelData.images as string[] : []}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                {isEdit ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            isEdit ? 'Update Hotel' : 'Create Hotel'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateHotelModal;
