import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { showError } from "@/utils/customToast";
import { ImageUploadProps } from "@/types/custom.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const ProfileImage: React.FC<ImageUploadProps> = ({ onImageSelected, updateProfileImage, role }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const data = useSelector((state: RootState) =>
        role === "user" ? state?.user?.user : state?.vendor?.vendor
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
            <div className="relative h-60 rounded-md cursor-pointe object-cover"
                style={{ background: "url('https://picsum.photos/1920/1080?grayscale)" }}>
                <div onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-[-75px] left-0 right-0 mx-auto h-40 w-40 overflow-hidden border-6 border-white rounded-full bg-white text-center">
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Profile Image"
                            className="object-cover h-full w-full"
                        />
                    ) : (
                        <span className="flex items-center justify-center h-full w-full rounded-full bg-blue-100 text-blue-700 font-bold text-5xl">
                            {data?.firstName.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-2 bottom-2"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Update Profile Image
                </Button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="profile-upload"
            />

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

export default ProfileImage;
