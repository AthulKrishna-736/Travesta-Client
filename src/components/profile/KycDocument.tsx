import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { showError } from "@/utils/customToast";
import { useKycUpload } from "@/hooks/vendor/useVendor";

export const KycDocuments = () => {
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [openPreview, setOpenPreview] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);

    const { mutate: uploadKyc, isPending } = useKycUpload();

    const vendor = useSelector((state: RootState) => state.vendor.vendor);
    const [frontImage, backImage] = vendor?.kycDocuments as string[];
    const bothAlreadyUploaded = Boolean(frontImage && backImage);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
        if (bothAlreadyUploaded) return;

        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
            showError("Only JPG, PNG or WebP images allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("Image must be less than 5MB");
            return;
        }

        if (side === "front") setFrontFile(file);
        else setBackFile(file);
    };

    const uploadDocuments = () => {
        if (!frontFile || !backFile) {
            showError("Please upload both images");
            return;
        }

        const formData = new FormData();
        formData.append("front", frontFile);
        formData.append("back", backFile);

        uploadKyc({ data: formData });
        setFrontFile(null);
        setBackFile(null);
    };

    const handleImagePreviewModal = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        setOpenPreview(prev => !prev);
        const image = e.target as HTMLImageElement
        setPreviewImage(image.src);

    }

    return (
        <>
            <div className="mx-auto p-4 space-y-4">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Identity Verification
                </h2>
                <p className="text-lg text-gray-600 text-center">
                    Upload front and back images of your ID to verify your account
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
                    <span className="text-yellow-800 font-semibold mb-1">Note: </span>
                    <span className="text-yellow-700 text-sm leading-relaxed">
                        Please upload your documents and wait for verification by the admin.
                        Only <span className="font-medium">verified vendors</span> can create hotels and rooms.
                    </span>
                </div>

                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 my-5">
                    {/* input images */}
                    <input
                        ref={frontInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className={`${bothAlreadyUploaded && 'hidden'} h-40 bg-blue-100 w-full border-2 border-blue-500 border-dashed rounded-sm`}
                        onChange={(e) => handleFileChange(e, "front")}
                        disabled={bothAlreadyUploaded}
                    />
                    <input
                        ref={backInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className={`${bothAlreadyUploaded && 'hidden'} h-40 bg-blue-100 w-full border-2 border-blue-500 border-dashed rounded-sm`}
                        onChange={(e) => handleFileChange(e, "back")}
                        disabled={bothAlreadyUploaded}
                    />
                    {/* display images */}
                    {bothAlreadyUploaded && (
                        <>
                            <img onClick={(e) => handleImagePreviewModal(e)} src={bothAlreadyUploaded ? frontImage : frontFile ? URL.createObjectURL(frontFile) : undefined} className="md:h-[250px] lg:h-[250px] w-full object-cover border-2 border-blue-500 border-dashed rounded-lg cursor-pointer" alt="front-card" />
                            <img onClick={(e) => handleImagePreviewModal(e)} src={bothAlreadyUploaded ? backImage : backFile ? URL.createObjectURL(backFile) : undefined} className="md:h-[250px] lg:h-[250px]  w-full object-cover border-2 border-blue-500 border-dashed rounded-lg cursor-pointer" alt="back-card" />
                        </>
                    )}
                </div>
                <Button
                    type="button"
                    className="w-full"
                    onClick={uploadDocuments}
                    disabled={isPending || !frontFile || !backFile || bothAlreadyUploaded}
                >
                    {isPending ? "Uploading..." : bothAlreadyUploaded ? "Already Uploaded" : "Submit ID Verification"}
                </Button>
            </div>
            {openPreview && previewImage && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/70"
                    onClick={() => setOpenPreview(false)}
                >
                    <img
                        src={previewImage}
                        alt="imagePreview"
                        className="md:w-120 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}


        </>
    );
};
