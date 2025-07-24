import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { showError } from "@/utils/customToast";
import { ImageUploadProps } from "@/types/component.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, updateProfileImage, role }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const data = useSelector((state: RootState) =>
        role === "user" ? state?.auth?.user : state?.vendor?.vendor
    );

    useEffect(() => {
        if (data?.profileImage) {
            setPreviewImage(data.profileImage);
            setOriginalImage(data.profileImage);
        }
    }, [data?.profileImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.type)) {
            showError("Please upload a JPG, PNG, or WebP image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("Image size should be less than 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        onImageSelected(file);
    };

    const cancelChanges = () => {
        setPreviewImage(originalImage);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onImageSelected(null);
    };

    const saveChanges = () => {
        setOriginalImage(previewImage);
        if (updateProfileImage) {
            updateProfileImage();
        } else {
            showError('Update profile handler missing')
        }
    };

    return (
        <>
            <Card className="animate-fade-in animation-delay-200 bg-yellow-50 border border-yellow-100">
                <CardHeader>
                    <CardTitle>Profile Image</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <div className="relative mb-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                        <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-primary">
                            <img
                                src={previewImage || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                        </div>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-upload"
                    />

                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose New Image
                    </Button>

                    {previewImage && previewImage !== originalImage && (
                        <div className="flex gap-2 w-full justify-center mt-2">
                            <Button
                                variant="default"
                                className="w-1/2"
                                onClick={saveChanges}
                            >
                                Save
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-1/2 bg-white"
                                onClick={cancelChanges}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isModalOpen && previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                    onClick={() => setIsModalOpen(false)}
                >
                    <img
                        src={previewImage}
                        alt="Full View"
                        className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] object-contain rounded-lg shadow-xl"
                    />

                </div>
            )}
        </>
    );
};

export default ImageUpload;
