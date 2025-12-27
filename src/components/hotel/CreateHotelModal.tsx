import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICreateHotelModalProps, TUpdateHotel } from '@/types/hotel.types';
import { TCreateHotel, TIdProof } from '@/types/hotel.types';
import { Loader2, X } from 'lucide-react';
import { showError } from '@/utils/customToast';
import MultiImageUploader from '@/components/common/ImageUpload';
import { hotelSchema } from '@/utils/validations/commonValidation';
import { useGetVendorAmenities } from '@/hooks/admin/useAmenities';
import GeoMap from '../maps/GeoMap';
import { IAmenity } from '@/types/amenities.types';


const CreateHotelModal: React.FC<ICreateHotelModalProps> = ({ open, onClose, onSubmit, isLoading, hotelData = null, isEdit = false, }) => {
    const [geoLocation, setGeoLocation] = useState<[number, number] | null>(null);
    const [imageCount, setImageCount] = useState<number>(1);
    const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>('');
    const [tagError, SetTagError] = useState<string>('');
    const [idProofs, setIdProofs] = useState<TIdProof[]>([]);
    const [idProofError, setIdProofError] = useState<string>('');

    const { data: activeAmenitiesData } = useGetVendorAmenities();
    const hotelAmenities = (activeAmenitiesData?.data || []).filter((a: IAmenity) => a.type === 'hotel');

    type TFormData = {
        name: string;
        description: string;
        address: string;
        state: string;
        city: string;
        checkInTime: string,
        checkOutTime: string,
        minGuestAge: number,
        petsAllowed: boolean,
        outsideFoodAllowed: boolean,
        specialNotes: string,
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm<TFormData>({
        resolver: yupResolver(hotelSchema),
    });

    useEffect(() => {
        if (hotelData) {
            reset({
                name: hotelData.name,
                description: hotelData.description,
                address: hotelData.address,
                state: hotelData.state,
                city: hotelData.city,
                checkInTime: hotelData.propertyRules?.checkInTime || '',
                checkOutTime: hotelData.propertyRules?.checkOutTime || '',
                minGuestAge: hotelData.propertyRules?.minGuestAge || 18,
                petsAllowed: hotelData.propertyRules?.petsAllowed || false,
                outsideFoodAllowed: hotelData.propertyRules?.outsideFoodAllowed || false,
                specialNotes: hotelData.propertyRules?.specialNotes || '',
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

            if (hotelData.propertyRules?.idProofAccepted) {
                setIdProofs((hotelData.propertyRules.idProofAccepted) ?? [])
            }
            setImageFiles((hotelData.images as string[]) || []);
            setImageCount(hotelData.images?.length as number)
            setGeoLocation(hotelData.geoLocation?.coordinates || null);

        } else {
            reset();
            setSelectedAmenities([]);
            setTags([]);
            setImageFiles([]);
        }
    }, [hotelData, reset]);

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (!trimmed || tags.includes(trimmed) || !/^[a-zA-Z-]+$/.test(trimmed)) {
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

    const submitHandler: SubmitHandler<TFormData> = (data) => {
        if (!geoLocation || geoLocation !== null && geoLocation.length < 0) {
            showError('Please select the GeoLocation')
            return;
        }

        if (idProofs.length === 0) {
            setIdProofError('At least one ID proof must be accepted');
            return;
        }

        if (selectedAmenities.length === 0) {
            showError('Select at least one amenity');
            return;
        }
        if (!isEdit && imageFiles.length === 0) {
            showError('Please upload at least one image');
            return;
        }
        if (imageFiles.length > 10) {
            showError('Maximum 10 images allowed');
            return;
        }


        const newFiles = imageFiles.filter((f): f is File => f instanceof File);
        const oldUrls = imageFiles.filter((f): f is string => typeof f === 'string');

        if (!isEdit) {
            const payload: TCreateHotel = {
                ...data,
                tags,
                amenities: selectedAmenities,
                images: newFiles,
                geoLocation: geoLocation,
                idProofAccepted: idProofs,
            };
            onSubmit(payload);
        } else {
            const payload: TUpdateHotel = {
                ...data,
                id: hotelData ? hotelData.id : '',
                tags,
                amenities: selectedAmenities,
                images: newFiles,
                geoLocation: geoLocation,
                idProofAccepted: idProofs,
                oldImages: oldUrls,
            }
            onSubmit(payload)
        }
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

                {/* Hotel Form */}
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                    {/* Hotel Basic Details */}
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

                    {/* Tags */}
                    <div>
                        <Label>Tags</Label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => {
                                    SetTagError('');
                                    setTagInput(e.target.value);
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                placeholder="Enter a tag"
                            />
                            <Button type="button" onClick={handleAddTag}>Add</Button>
                        </div>
                        {tagError && <p className="text-sm text-red-500">{tagError}</p>}
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag} className="bg-gray-200 px-2 py-1 rounded flex items-center">
                                    {tag}
                                    <X className="ml-1 w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <Label>Select Amenities</Label>
                        <div className="border p-2 rounded flex flex-wrap gap-2 min-h-[40px]">
                            {selectedAmenities.map((amenityId) => {
                                const amenity = hotelAmenities.find((a: IAmenity) => a.id === amenityId);
                                return (
                                    <span key={amenityId} className="bg-gray-200 px-2 py-1 rounded flex items-center">
                                        {amenity?.name}
                                        <X className="ml-1 w-3 h-3 cursor-pointer" onClick={() => setSelectedAmenities((prev) => prev.filter((id) => id !== amenityId))} />
                                    </span>
                                );
                            })}
                            <select
                                className="ml-auto px-2 py-1 outline-none"
                                value=""
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value && !selectedAmenities.includes(value)) {
                                        setSelectedAmenities([...selectedAmenities, value]);
                                    }
                                }}
                            >
                                <option value="">+ Add Amenity</option>
                                {hotelAmenities.map((a: any) => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Geo Location */}
                    <div>
                        <GeoMap geoLocation={geoLocation!} setGeoLocation={setGeoLocation} />
                    </div>

                    {/* Property Rules Section */}
                    <div className="border-t pt-4 space-y-3">
                        <h3 className="font-semibold text-lg">Property Rules</h3>

                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <Label>Check-in Time</Label>
                                <Input
                                    type="time"
                                    {...register("checkInTime")}
                                    className="w-full"
                                />
                                {errors.checkInTime && (
                                    <p className="text-sm text-red-500">{errors.checkInTime.message}</p>
                                )}
                            </div>

                            <div className="w-1/2">
                                <Label>Check-out Time</Label>
                                <Input
                                    type="time"
                                    {...register("checkOutTime")}
                                    className="w-full"
                                />
                                {errors.checkOutTime && (
                                    <p className="text-sm text-red-500">{errors.checkOutTime.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Minimum Guest Age</Label>
                            <Input type="number" {...register("minGuestAge")} />
                            {errors.minGuestAge && <p className="text-sm text-red-500">{errors.minGuestAge.message}</p>}
                        </div>

                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <Label>Pets Allowed</Label>
                                <select {...register("petsAllowed")} className="w-full border rounded px-2 py-1">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <Label>Outside Food Allowed</Label>
                                <select {...register("outsideFoodAllowed")} className="w-full border rounded px-2 py-1">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>

                        {/* ID Proofs – external */}
                        <div>
                            <Label>ID Proofs Accepted</Label>
                            <div className="flex flex-wrap gap-2">
                                {(['Aadhaar', 'Passport', 'DrivingLicense', 'PAN'] as const).map((proof) => (
                                    <label key={proof} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={proof}
                                            checked={idProofs.includes(proof)}
                                            onChange={(e) => {
                                                setIdProofError('');
                                                if (e.target.checked) {
                                                    setIdProofs((prev) => [...prev, proof]);
                                                } else {
                                                    setIdProofs((prev) => prev.filter((p) => p !== proof));
                                                }
                                            }}
                                        />
                                        {proof}
                                    </label>
                                ))}
                            </div>
                            {idProofError && <p className="text-sm text-red-500">{idProofError}</p>}
                        </div>

                        <div>
                            <Label>Special Notes</Label>
                            <Textarea {...register("specialNotes")} placeholder="Any important notes or policies..." />
                            {errors.specialNotes && (
                                <p className="text-sm text-red-500">{errors.specialNotes.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <Label>Images</Label>
                            <div>
                                <Button variant="ghost" className="bg-red-100 mr-2" onClick={handleReduceImageCount}>Remove</Button>
                                <Button variant="ghost" className="bg-green-200" onClick={handleImageCount}>Add+</Button>
                            </div>
                        </div>
                        <MultiImageUploader
                            maxImages={imageCount}
                            onImagesChange={(files) => setImageFiles(files)}
                            initialImageUrls={isEdit && hotelData?.images ? (hotelData.images as string[]) : []}
                        />
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                {isEdit ? "Updating..." : "Creating..."}
                            </>
                        ) : isEdit ? "Update Hotel" : "Create Hotel"}
                    </Button>

                </form>

            </DialogContent>
        </Dialog>
    );
};

export default CreateHotelModal;
