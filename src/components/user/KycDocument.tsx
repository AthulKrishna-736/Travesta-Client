import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/utils/customToast";
import { KycDocumentsProps } from "@/types/component.types";

export const KycDocuments: React.FC<KycDocumentsProps> = ({ userId, onUpdate }) => {
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
            showError("Please upload a JPG, PNG, or WebP image");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("Image size should be less than 5MB");
            return;
        }

        if (side === "front") setFrontFile(file);
        else setBackFile(file);
    };

    const uploadDocuments = async () => {
        if (!frontFile || !backFile) {
            showError("Please upload both front and back images of your ID");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("front", frontFile);
            formData.append("back", backFile);
            formData.append("userId", userId);

            const response = await fetch("/api/kyc/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                showError("Upload failed");
            }

            // const result = await response.json();

            // Trigger onUpdate with files and userId
            onUpdate({ userId, files: [frontFile, backFile] });

            showSuccess("Your ID verification has been submitted and is pending review");
            setFrontFile(null);
            setBackFile(null);
        } catch (err) {
            showError("An error occurred while uploading your documents.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="text-lg">Identity Verification</h2>
                <p className="text-sm text-gray-500">Upload images of the front and back of your government-issued ID.</p>
            </div>
            <div className="card-content">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                        <label className="block text-sm">Front Side of ID</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleFileChange(e, "front")}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm">Back Side of ID</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleFileChange(e, "back")}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        type="button"
                        className="w-full"
                        onClick={uploadDocuments}
                        disabled={uploading || !frontFile || !backFile}
                    >
                        {uploading ? "Uploading..." : "Submit ID Verification"}
                    </Button>
                </div>
            </div>
            <div className="card-footer text-center text-xs text-gray-500">
                Your ID information is encrypted and securely stored according to our privacy policy.
            </div>
        </div>
    );
};
