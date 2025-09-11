import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { IAmenity, ICreateHotelModalProps } from '@/types/component.types';
import { IHotel } from '@/types/hotel.types';
import { Loader2, X } from 'lucide-react';
import { showError } from '@/utils/customToast';
import MultiImageUploader from '@/components/common/ImageUpload';
import { hotelSchema } from '@/utils/validations/commonValidation';
import { useGetVendorAmenities } from '@/hooks/admin/useAmenities';
import GeoMap from '../common/GeoMap';

export type IHotelFormData = {
    name: string;
    description: string;
    address: string;
    state: string;
    city: string;
    tags?: string[];
};

const CreateHotelModal: React.FC<ICreateHotelModalProps> = ({ open, onClose, onSubmit, isLoading, hotelData = null, isEdit = false, }) => {
    const [geoLocation, setGeoLocation] = useState<[number, number] | null>(null);
    const [imageCount, setImageCount] = useState<number>(1);
    const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>('');
    const [tagError, SetTagError] = useState<string>('');

    const { data: activeAmenitiesData } = useGetVendorAmenities();
    const hotelAmenities = (activeAmenitiesData?.data || []).filter((a: IAmenity) => a.type === 'hotel');

    const { register, handleSubmit, formState: { errors }, reset, } = useForm<IHotelFormData>({ resolver: yupResolver(hotelSchema), });

    useEffect(() => {
        if (hotelData) {
            reset({
                name: hotelData.name,
                description: hotelData.description,
                address: hotelData.address,
                state: hotelData.state,
                city: hotelData.city,
                tags: [],
            });

            if (Array.isArray(hotelData?.amenities)) {
                setSelectedAmenities(hotelData.amenities.map((a: any) => a._id));
            } else if (typeof hotelData?.amenities === 'string') {
                setSelectedAmenities((hotelData.amenities as string).split(',').map((a: any) => a.trim()).filter(Boolean));
            } else {
                setSelectedAmenities([]);
            }


            if (Array.isArray(hotelData.tags)) {
                setTags(hotelData.tags);
            } else if (typeof hotelData.tags === "string") {
                setTags((hotelData.tags as string).split(",").map(t => t.trim()).filter(Boolean));
            }


            setImageFiles((hotelData.images as string[]) || []);
            setImageCount(hotelData.images?.length as number)
            setGeoLocation(hotelData.geoLocation || null);

        } else {
            reset();
            setSelectedAmenities([]);
            setTags([]);
            setImageFiles([]);
        }
    }, [hotelData, reset]);

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (!trimmed || tags.includes(trimmed) || !/^[a-zA-Z]+$/.test(trimmed)) {
            SetTagError('Tags can only be alphabets');
            setTagInput("");
            return;
        }

        if (tags.length >= 10) {
            showError('Maximum 10 tags are allowed');
            return;
        }

        setTags(prev => [...prev, trimmed]);
        setTagInput("");
    };


    const handleRemoveTag = (tag: string) => {
        setTags(prev => prev.filter(t => t !== tag));
    };

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

    const submitHandler: SubmitHandler<IHotelFormData> = (data, event) => {
        event?.preventDefault();

        if (!isEdit && imageFiles.length < 1) {
            showError('Please upload minimum an image.');
            return;
        }

        if (!isEdit && imageFiles.length >= 10) {
            showError('Maximum 10 images are allowed');
            return;
        }

        if (isEdit && imageFiles.length >= 10) {
            showError('You can upload up to 10 images only.');
            return;
        }

        if (!geoLocation) {
            showError('You must select a location');
            return;
        }

        if (selectedAmenities.length < 1) {
            showError('Minimum one amenity should be there');
            return;
        }

        const newImageFiles = imageFiles.filter(
            (img): img is File => typeof img !== 'string'
        );
        const keptImageUrls = imageFiles.filter(
            (img): img is string => typeof img === 'string'
        );

        const finalPayload: IHotel & { oldImages: string[] } = {
            ...data,
            _id: hotelData?.id,
            geoLocation: geoLocation as [number, number],
            amenities: selectedAmenities,
            images: newImageFiles,
            oldImages: keptImageUrls,
            tags,
        };
        onSubmit(finalPayload);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className='text-2xl'>
                        {isEdit ? 'Edit Hotel' : 'Create New Hotel'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the hotel details below and save your changes.'
                            : 'Fill in the details below to add a new hotel to the system.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    <div>
                        <Label className='mb-1'>Name</Label>
                        <Input {...register('name')} required />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <Label className='mb-1'>Description</Label>
                        <Textarea {...register('description')} required />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>
                    <div>
                        <Label className='mb-1'>Address</Label>
                        <Input {...register('address')} required />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <Label className='mb-1'>State</Label>
                            <Input {...register('state')} required />
                            {errors.state && (
                                <p className="text-sm text-red-500">{errors.state.message}</p>
                            )}
                        </div>
                        <div className="w-1/2">
                            <Label className='mb-1'>City</Label>
                            <Input {...register('city')} required />
                            {errors.city && (
                                <p className="text-sm text-red-500">{errors.city.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Tags Input */}
                    <div>
                        <Label className='mb-1'>Tags</Label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => {
                                    SetTagError('');
                                    setTagInput(e.target.value)
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                placeholder="Enter a tag"
                            />
                            <Button type="button" onClick={handleAddTag}>Add</Button>
                        </div>
                        {tagError && (<p className='text-sm text-red-500'>{tagError}</p>)}
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag} className="bg-gray-200 px-2 py-1 rounded flex items-center">
                                    {tag}
                                    <X
                                        className="ml-1 w-3 h-3 cursor-pointer"
                                        onClick={() => handleRemoveTag(tag)}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Amenities Multi-select */}
                    <div>
                        <Label className='mb-1'>Select Amenities</Label>
                        <div className="border p-2 rounded flex flex-wrap gap-2 min-h-[40px]">
                            {selectedAmenities.map((amenityId) => {
                                const amenity = hotelAmenities.find((a: IAmenity) => a._id === amenityId);
                                return (
                                    <span key={amenityId} className="bg-gray-200 px-2 py-1 rounded flex items-center">
                                        {amenity?.name}
                                        <X className="ml-1 w-3 h-3 cursor-pointer" onClick={() => setSelectedAmenities((prev) => prev.filter((id) => id !== amenityId))} />
                                    </span>
                                );
                            })}
                            <select className="ml-auto px-2 py-1 outline-none" value=""
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value && !selectedAmenities.includes(value)) {
                                        setSelectedAmenities([...selectedAmenities, value]);
                                    }
                                }}
                            >
                                <option value="">+ Add Amenity</option>
                                {hotelAmenities.map((a: any) => (
                                    <option key={a._id} value={a._id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Geo Map Location Picker */}
                    <div>
                        <GeoMap
                            geoLocation={geoLocation!}
                            setGeoLocation={setGeoLocation}
                        />
                    </div>

                    {/* Image uploading */}
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
                            onImagesChange={(files) => setImageFiles(files)}
                            initialImageUrls={isEdit && hotelData?.images ? (hotelData.images as string[]) : []}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                {isEdit ? 'Updating...' : 'Creating...'}
                            </>
                        ) : isEdit ? ('Update Hotel') : ('Create Hotel')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateHotelModal;
