import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import MultiImageUploader from '../../common/ImageUpload';
import { ICreateRoomProps } from '@/types/component.types';
import { IHotel } from '@/types/user.types';

type RoomFormValues = {
    name: string;
    capacity: number;
    bedType: string;
    basePrice: number;
    amenities: string;
    images: File[];
};

const CreateRoomModal: React.FC<ICreateRoomProps & { hotels: IHotel[] }> = ({ open, onClose, onSubmit, isLoading, roomData, isEdit, hotels, }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RoomFormValues>({
        defaultValues: {
            name: '',
            capacity: 1,
            bedType: '',
            basePrice: 0,
            amenities: '',
            images: [],
        },
    });

    const [selectedHotelId, setSelectedHotelId] = useState<string>(
        roomData?.hotelId || (hotels.length > 0 ? hotels[0]._id || '' : '')
    );

    useEffect(() => {
        if (roomData) {
            reset({
                name: roomData.name,
                capacity: roomData.capacity,
                bedType: roomData.bedType,
                basePrice: roomData.basePrice,
                amenities: roomData.amenities?.join(',') || '',
                images: [],
            });
            setSelectedHotelId(roomData.hotelId || (hotels.length > 0 ? hotels[0]._id || '' : ''));
        } else {
            setSelectedHotelId(hotels.length > 0 ? hotels[0]._id || '' : '');
            reset({
                name: '',
                capacity: 1,
                bedType: '',
                basePrice: 0,
                amenities: '',
                images: [],
            });
        }
    }, [roomData, reset, hotels]);

    const submitHandler = (data: RoomFormValues) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('capacity', String(data.capacity));
        formData.append('bedType', data.bedType);
        formData.append('basePrice', String(data.basePrice));
        formData.append('hotelId', selectedHotelId);
        formData.append('amenities', JSON.stringify(data.amenities.split(',').map(item => item.trim())));

        const imageFiles = data.images.filter((item) => item instanceof File) as File[];
        const imageUrls = data.images.filter((item) => typeof item === 'string') as string[];

        imageFiles.forEach((file) => formData.append('imageFile', file));

        if (isEdit && imageUrls.length > 0) {
            formData.append('images', JSON.stringify(imageUrls));
        }


        if (isEdit && roomData?._id) {
            onSubmit({ id: roomData._id, data: formData });
        } else {
            onSubmit(formData);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    {/* Hotel Select Dropdown */}
                    <div>
                        <label className="block mb-1 font-medium">Select Hotel</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedHotelId}
                            onChange={(e) => setSelectedHotelId(e.target.value)}
                        >
                            {hotels.map((hotel) => (
                                <option key={hotel._id} value={hotel._id}>
                                    {hotel.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Room Name</label>
                        <Input {...register('name', { required: 'Name is required' })} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Capacity</label>
                        <Input type="number" {...register('capacity', { required: true, min: 1 })} />
                        {errors.capacity && <p className="text-red-500 text-sm">Minimum capacity is 1</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Bed Type</label>
                        <Input {...register('bedType', { required: 'Bed type is required' })} />
                        {errors.bedType && <p className="text-red-500 text-sm">{errors.bedType.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Base Price</label>
                        <Input type="number" {...register('basePrice', { required: true, min: 0 })} />
                        {errors.basePrice && <p className="text-red-500 text-sm">Price must be at least 0</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Amenities (comma-separated)</label>
                        <Input {...register('amenities')} />
                        {errors.amenities && (<p className="text-sm text-red-500">{errors.amenities.message}</p>)}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Room Images</label>
                        <MultiImageUploader
                            onImagesChange={(files: (string | File)[]) => setValue('images', files as File[])}
                            initialImageUrls={roomData?.images as string[] || []}
                        />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isEdit ? 'Update Room' : 'Create Room'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateRoomModal;
