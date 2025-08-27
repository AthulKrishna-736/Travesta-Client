import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface ImageCropperProps {
    imageUrl: string;
    onCropDone: (file: File) => void;
    onCancel: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropDone, onCancel, open, onOpenChange, }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
        setCroppedArea(croppedPixels);
    }, []);

    const createCroppedImage = async () => {
        if (!croppedArea) return;

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageUrl;

        await new Promise((res) => (image.onload = res));

        const canvas = document.createElement('canvas');
        canvas.width = croppedArea.width;
        canvas.height = croppedArea.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            image,
            croppedArea.x,
            croppedArea.y,
            croppedArea.width,
            croppedArea.height,
            0,
            0,
            croppedArea.width,
            croppedArea.height
        );

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'cropped-image.png', { type: blob.type });
                onCropDone(file);
            }
        }, 'image/png');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-5">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">Crop Image</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Adjust the image crop area and click "Done" to save.
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full h-[360px] bg-white rounded flex flex-col justify-between overflow-hidden">
                    <div className="relative flex-1">
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={4 / 3}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    <div className="flex justify-end gap-2 p-4 border-t">
                        <button
                            onClick={createCroppedImage}
                            className="bg-green-500 text-white px-4 py-1 rounded"
                        >
                            Done
                        </button>
                        <button
                            onClick={() => {
                                onCancel();
                                onOpenChange(false);
                            }}
                            className="bg-red-500 text-white px-4 py-1 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    );
};

export default ImageCropper;
