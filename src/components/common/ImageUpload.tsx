import React, { useEffect, useState } from 'react';
import ImageCropper from '../common/ImageCropper';
import { Input } from '@/components/ui/input';
import { IMutilImageUploadProps } from '@/types/component.types';


const MultiImageUploader: React.FC<IMutilImageUploadProps> = ({ maxImages = 4, onImagesChange }) => {
    const [previewImages, setPreviewImages] = useState<(string | null)[]>([]);
    const [originalFiles, setOriginalFiles] = useState<(File | null)[]>([]);
    const [croppedFiles, setCroppedFiles] = useState<(File | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [cropSrc, setCropSrc] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);

            const newPreviews = [...previewImages];
            const newOriginals = [...originalFiles];
            const newCroppeds = [...croppedFiles];

            newPreviews[index] = url;
            newOriginals[index] = file;
            newCroppeds[index] = null;

            setPreviewImages(newPreviews);
            setOriginalFiles(newOriginals);
            setCroppedFiles(newCroppeds);

            setActiveIndex(index);
            setCropSrc(url);
            setShowCropper(true);
        }
    };


    const handleCropDone = (file: File) => {
        if (activeIndex !== null) {
            const newFiles = [...croppedFiles];
            const newPreviews = [...previewImages];

            if (previewImages[activeIndex]) {
                URL.revokeObjectURL(previewImages[activeIndex]!);
            }

            const url = URL.createObjectURL(file);
            newFiles[activeIndex] = file;
            newPreviews[activeIndex] = url;

            setCroppedFiles(newFiles);
            setPreviewImages(newPreviews);
            setActiveIndex(null);
            setShowCropper(false);
        }
    };

    const handleCropCancel = () => {
        setActiveIndex(null);
        setShowCropper(false);
    };

    const removeImage = (index: number) => {
        const newFiles = [...croppedFiles];
        const newPreviews = [...previewImages];
        const newOriginals = [...originalFiles];

        if (newPreviews[index]) {
            URL.revokeObjectURL(newPreviews[index]!);
        }

        newFiles[index] = null;
        newPreviews[index] = null;
        newOriginals[index] = null;

        setCroppedFiles(newFiles);
        setPreviewImages(newPreviews);
        setOriginalFiles(newOriginals);
    };

    useEffect(() => {
        const finalImages: File[] = [];

        for (let i = 0; i < originalFiles.length; i++) {
            if (croppedFiles[i]) {
                finalImages.push(croppedFiles[i]!);
            } else if (originalFiles[i]) {
                finalImages.push(originalFiles[i]!);
            }
        }

        onImagesChange(finalImages);
    }, [originalFiles, croppedFiles]);

    return (
        <div className="space-y-4">
            {[...Array(maxImages)].map((_, index) => (
                <div key={index}>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, index)}
                    />
                    {previewImages[index] && (
                        <div className="relative mt-2 w-full max-h-64">
                            <img
                                src={previewImages[index]!}
                                alt={`Preview ${index + 1}`}
                                className="w-full max-h-64 object-cover rounded"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCropSrc(previewImages[index]);
                                        setActiveIndex(index);
                                        setShowCropper(true);
                                    }}
                                    className="bg-yellow-100 text-yellow-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-yellow-200"
                                    aria-label="Crop Image"
                                >
                                    ✂️
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="bg-red-100 text-red-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-red-200"
                                    aria-label="Remove Image"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {showCropper && cropSrc && (
                <ImageCropper
                    open={showCropper}
                    onOpenChange={setShowCropper}
                    imageUrl={cropSrc}
                    onCropDone={handleCropDone}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
};

export default MultiImageUploader;
