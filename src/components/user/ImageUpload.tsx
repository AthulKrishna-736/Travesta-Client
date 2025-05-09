import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { showError, showSuccess } from "@/utils/customToast";

const defaultUser = {
    name: "John Doe",
    profileImage: "https://via.placeholder.com/150",
};

export const ImageUpload: React.FC = () => {
    const [user, setUser] = useState(defaultUser);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    };

    const handleUpload = () => {
        if (!previewImage) return;
        setLoading(true);

        setTimeout(() => {
            setUser({ ...user, profileImage: previewImage });
            setPreviewImage(null);
            setLoading(false);
            showSuccess("Profile image updated.");
        }, 1000);
    };

    const cancelPreview = () => {
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <Card className="animate-fade-in animation-delay-200">
            <CardHeader>
                <CardTitle>Profile Image</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="relative mb-4">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-primary">
                        <img
                            src={previewImage || user.profileImage}
                            alt="Profile"
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                    </div>
                    {previewImage && (
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background p-0 shadow"
                            onClick={cancelPreview}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                        </Button>
                    )}
                </div>

                <div className="mt-2 flex flex-col items-center space-y-4">
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

                    {previewImage && (
                        <Button onClick={handleUpload} disabled={loading} className="w-full">
                            {loading ? "Uploading..." : "Save New Image"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageUpload;
