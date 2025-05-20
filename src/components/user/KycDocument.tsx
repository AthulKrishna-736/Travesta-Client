import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { showError } from "@/utils/customToast";
import { useKycUpload } from "@/hooks/vendor/useKycUpload";

export const KycDocuments = () => {
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);

    const frontInputRef = useRef<HTMLInputElement>(null);
    const backInputRef = useRef<HTMLInputElement>(null);

    const { mutate: uploadKyc, isPending } = useKycUpload();

    const vendor = useSelector((state: RootState) => state.vendor.vendor);
    const frontImage = vendor?.kycDocuments?.[0];
    const backImage = vendor?.kycDocuments?.[1];

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

    const renderImageBox = (
        uploadedFile: File | null,
        storedUrl: string | undefined,
        onClick: () => void,
        label: string
    ) => {
        const preview = uploadedFile
            ? URL.createObjectURL(uploadedFile)
            : storedUrl
                ? storedUrl
                : null;

        return (
            <div
                className={`border border-dashed border-gray-300 rounded-lg w-full aspect-square flex items-center justify-center cursor-pointer ${bothAlreadyUploaded ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                onClick={() => {
                    if (!bothAlreadyUploaded) onClick();
                }}
            >
                {preview ? (
                    <img src={preview} alt={label} className="object-cover w-full h-full rounded-lg" />
                ) : (
                    <span className="text-sm text-gray-500">{label}</span>
                )}
            </div>
        );
    };

    return (
        <div className="card max-w-md mx-auto p-4 space-y-4">
            <h2 className="text-lg font-semibold text-center">Identity Verification</h2>
            <p className="text-sm text-gray-500 text-center">Upload front and back images of your ID</p>

            <div className="grid grid-cols-2 gap-4">
                {renderImageBox(frontFile, frontImage, () => frontInputRef.current?.click(), "Front Side")}
                {renderImageBox(backFile, backImage, () => backInputRef.current?.click(), "Back Side")}
            </div>

            <input
                ref={frontInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFileChange(e, "front")}
                disabled={bothAlreadyUploaded}
            />
            <input
                ref={backInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFileChange(e, "back")}
                disabled={bothAlreadyUploaded}
            />

            <Button
                type="button"
                className="w-full"
                onClick={uploadDocuments}
                disabled={isPending || !frontFile || !backFile || bothAlreadyUploaded}
            >
                {isPending ? "Uploading..." : bothAlreadyUploaded ? "Already Uploaded" : "Submit ID Verification"}
            </Button>
        </div>
    );
};
