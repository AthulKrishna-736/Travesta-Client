import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import MultiImageUploader from '../common/ImageUpload';
import { ICreateRoomProps, } from '@/types/room.types';
import { IHotel } from '@/types/hotel.types';
import { X } from 'lucide-react';
import { useGetVendorAmenities } from '@/hooks/admin/useAmenities';
import { BED_TYPE_CAPACITY, BedType } from '@/types/room.types';
import { Label } from '../ui/label';
import { showError } from '@/utils/customToast';
import { IAmenity } from '@/types/amenities.types';

type RoomFormValues = {
    name: string;
    roomType: string;
    roomCount: number;
    bedType: string;
    guest: number;
    basePrice: number;
    amenities: string;
    images: File[];
};

const CreateRoomModal: React.FC<ICreateRoomProps & { hotels: IHotel[] }> = ({ open, onClose, onSubmit, isLoading, roomData, isEdit, hotels }) => {
    const [imageCount, setImageCount] = useState<number>(1);
    const [selectedHotelId, setSelectedHotelId] = useState<string>(roomData?.hotelId || (hotels.length > 0 ? hotels[0].id || '' : ''));
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RoomFormValues>({
        defaultValues: {
            name: '',
            roomType: '',
            roomCount: 1,
            bedType: '',
            guest: 1,
            basePrice: 0,
            amenities: '',
            images: []
        },
    });

    const { data: activeAmenitiesData } = useGetVendorAmenities();
    const roomAmenities = (activeAmenitiesData?.data || []).filter((a: IAmenity) => a.type === 'room');

    useEffect(() => {
        if (roomData) {
            reset({
                name: roomData.name,
                roomType: roomData.roomType,
                roomCount: roomData.roomCount,
                bedType: roomData.bedType,
                guest: roomData.guest,
                basePrice: roomData.basePrice,
                amenities: roomData.amenities?.join(',') || '',
                images: [],
            });

            setSelectedHotelId(roomData.hotelId || (hotels.length > 0 ? hotels[0].id || '' : ''));
            setSelectedAmenities(
                (roomData.amenities || []).map((a) => typeof a === "string" ? a : a._id)
            );
            setImageCount(roomData.images.length);
        } else {
            setSelectedHotelId(hotels.length > 0 ? hotels[0].id || '' : '');
            reset();
            setSelectedAmenities([]);
        }
    }, [roomData, reset, hotels]);

    const handleImageCount = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (imageCount >= 10) {
            showError('Max image limit is 10')
            return;
        }
        setImageCount(prev => prev + 1);
    }

    const handleReduceImageCount = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (imageCount <= 1) {
            showError('Min one image is required');
            return;
        }
        setImageCount(prev => prev - 1);
    }

    const submitHandler = (data: RoomFormValues) => {
        const imageFiles = data.images.filter((item) => item instanceof File) as File[];
        const imageUrls = data.images.filter((item) => typeof item === 'string') as string[];

        if (selectedAmenities.length < 1) {
            showError('Min one amenity should be selected');
            return
        }

        if (!isEdit && imageFiles.length < 1) {
            showError('Min one image is required')
            return
        }

        const formData = new FormData();
        formData.append('name', data.name.trim());
        formData.append('roomType', data.roomType);
        formData.append('bedType', data.bedType);
        formData.append('roomCount', String(data.roomCount));
        formData.append('guest', String(data.guest));
        formData.append('basePrice', String(data.basePrice));
        formData.append('hotelId', selectedHotelId);
        formData.append('amenities', JSON.stringify(selectedAmenities));

        imageFiles.forEach((file) => formData.append('imageFile', file));
        if (isEdit && imageUrls.length > 0) {
            formData.append('images', JSON.stringify(imageUrls));
        }

        if (isEdit && roomData) {
            onSubmit({ id: roomData.id as string, data: formData });
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

                    <div>
                        <label className="block mb-1 font-medium">Select Hotel</label>
                        <select
                            className="w-full p-2 border rounded overflow-y-auto"
                            value={selectedHotelId}
                            onChange={(e) => setSelectedHotelId(e.target.value)}
                        >
                            {hotels.map((hotel) => (
                                <option key={hotel.id} value={hotel.id}>
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


                    {/* Room Type select */}
                    <div>
                        <label className="block mb-1 font-medium">Room Type</label>
                        <select
                            className="w-full p-2 border rounded"
                            {...register('roomType', { required: 'Room type is required' })}
                        >
                            <option value="" disabled>Select Room Type</option>
                            {["AC", "Non-AC", "Deluxe", "Suite", "Standard"].map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {errors.roomType && <p className="text-red-500 text-sm">{errors.roomType.message}</p>}
                    </div>

                    {/* Room Count */}
                    <div>
                        <label className="block mb-1 font-medium">Room Count</label>
                        <Input type="number" {...register('roomCount', { required: true, min: 1 })} />
                        {errors.roomCount && <p className="text-red-500 text-sm">Minimum 1 room required</p>}
                    </div>

                    {/* Bed Type + Guest */}
                    <div>
                        <label className="block mb-1 font-medium">Bed Type</label>
                        <select
                            className="w-full p-2 border rounded"
                            {...register('bedType', { required: 'Bed type is required' })}
                            onChange={(e) => {
                                const value = e.target.value as BedType;
                                setValue('bedType', value);
                                setValue('guest', BED_TYPE_CAPACITY[value]);
                            }}
                        >
                            <option value="" disabled>Select Bed Type</option>
                            {Object.values(BedType).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {errors.bedType && <p className="text-red-500 text-sm">{errors.bedType.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Guest Capacity</label>
                        <Input type="number" {...register('guest')} readOnly />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Base Price</label>
                        <Input type="number" {...register('basePrice', { required: true, min: 1 })} />
                        {errors.basePrice && <p className="text-red-500 text-sm">Price must be greater than 0</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Select Amenities</label>
                        <div className="border p-2 rounded flex flex-wrap gap-2 min-h-[40px]">
                            {selectedAmenities.map((amenityId: string) => {
                                const amenity = roomAmenities.find((a: IAmenity) => a.id === amenityId);
                                return (
                                    <span
                                        key={amenityId}
                                        className="bg-gray-200 px-2 py-1 rounded flex items-center"
                                    >
                                        {amenity?.name}
                                        <X
                                            className="ml-1 w-3 h-3 cursor-pointer"
                                            onClick={() =>
                                                setSelectedAmenities((prev) =>
                                                    prev.filter((id) => id !== amenityId)
                                                )
                                            }
                                        />
                                    </span>
                                );
                            })}

                            {/* Add new amenity dropdown */}
                            <select
                                className="ml-auto px-2 py-1 outline-none"
                                value=""
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value && !selectedAmenities.includes(value)) {
                                        setSelectedAmenities((prev) => [...prev, value]);
                                    }
                                }}
                            >
                                <option value="">+ Add Amenity</option>
                                {roomAmenities
                                    .filter((a: IAmenity) => !selectedAmenities.includes(a.id))
                                    .map((a: IAmenity) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>


                    <div>
                        <div className='flex justify-between mb-2'>
                            <Label className='mb-1'>Images</Label>
                            <div>
                                <Button variant='ghost' className='bg-red-100 mr-2' onClick={handleReduceImageCount}>Remove</Button>
                                <Button variant='ghost' className='bg-green-200' onClick={handleImageCount}>Add+</Button>
                            </div>
                        </div>
                        <MultiImageUploader
                            maxImages={imageCount}
                            onImagesChange={(files: (string | File)[]) =>
                                setValue('images', files as File[])
                            }
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
