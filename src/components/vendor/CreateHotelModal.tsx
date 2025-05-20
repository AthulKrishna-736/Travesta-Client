import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { hotelSchema } from '@/utils/validations/commonValidation';
import { CreateHotelModalProps } from '@/types/component.types';
import { IHotel } from '@/types/user.types';
import ImageCropper from '../common/ImageCropper';
import { Loader2 } from 'lucide-react';


const CreateHotelModal: React.FC<CreateHotelModalProps> = ({ open, onClose, onSubmit, isLoading }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, resetField } = useForm<IHotel>({ resolver: yupResolver(hotelSchema) });
    const [geoLocation, setGeoLocation] = useState<number[] | null>(null);

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

    const onRender = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl)

            return () => URL.revokeObjectURL(imageUrl)
        }
    }

    const removeImage = () => {
        setPreviewImage(null);
        resetField('imageFile');
    };

    const handleOpenModal = () => {
        setShowCropper(true)

    }

    const handleCropDone = (file: File) => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        const croppedImageUrl = URL.createObjectURL(file);
        setPreviewImage(croppedImageUrl);
        setCroppedImageFile(file);
        setShowCropper(false);
    };


    const handleCropCancel = () => {
        setShowCropper(false);
        setCroppedImageFile(null);
    };

    const submitHandler = (data: IHotel) => {
        const formData = {
            ...data,
            geoLocation: geoLocation || undefined,
            imageFile: croppedImageFile || data.imageFile?.[0],
        };

        console.log('hotel formdata: ', formData);
        onSubmit(formData);

        setPreviewImage(null);
        setCroppedImageFile(null);
        reset();
        onClose();
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
                        {typeof errors.name?.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea {...register('description')} required />
                        {typeof errors.description?.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Input {...register('address')} required />
                        {typeof errors.address?.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <Label>State</Label>
                            <Input {...register('state')} required />
                            {typeof errors.state?.message === 'string' && (
                                <p className="text-sm text-red-500">{errors.state.message}</p>
                            )}
                        </div>
                        <div className="w-1/2">
                            <Label>City</Label>
                            <Input {...register('city')} required />
                            {typeof errors.city?.message === 'string' && (
                                <p className="text-sm text-red-500">{errors.city.message}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label>Tags (comma separated)</Label>
                        <Input {...register('tags')} />
                        {typeof errors.tags?.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.tags.message}</p>
                        )}
                    </div>
                    <div>
                        <Label>Amenities (comma separated)</Label>
                        <Input {...register('amenities')} />
                        {typeof errors.amenities?.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.amenities.message}</p>
                        )}
                    </div>
                    <div>
                        <Label>Services (comma separated)</Label>
                        <Input {...register('services')} />
                        {typeof errors.services?.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.services.message}</p>
                        )}
                    </div>
                    <div>
                        <Label>Image</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            {...register('imageFile')}
                            onChange={onRender}
                        />
                        {typeof errors.imageFile?.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.imageFile.message}</p>
                        )}

                        {previewImage && (
                            <div className="relative mt-2 w-full max-h-64">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-full max-h-64 object-cover rounded"
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button
                                        type="button"
                                        onClick={handleOpenModal}
                                        className="bg-yellow-100 text-yellow-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-yellow-200"
                                        aria-label="Crop Image"
                                    >
                                        ✂️
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-red-100 text-red-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-red-200"
                                        aria-label="Remove Image"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4" />
                                Creating...
                            </>
                        ) : (
                            "Create Hotel"
                        )}
                    </Button>
                </form>
            </DialogContent>
            {showCropper && previewImage && (
                <ImageCropper
                    open={showCropper}
                    onOpenChange={setShowCropper}
                    imageUrl={previewImage}
                    onCropDone={handleCropDone}
                    onCancel={handleCropCancel}
                />
            )}
        </Dialog>
    );
};

export default CreateHotelModal;
