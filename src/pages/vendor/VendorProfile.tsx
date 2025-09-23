import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/profile/ProfileImage";
import ProfileSection from "@/components/profile/ProfileSection";
import { UpdateUser } from "@/types/user.types";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { KycDocuments } from "@/components/profile/KycDocument";
import Header from "@/components/header/vendor/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { useGetVendor, useUpdateVendor } from "@/hooks/vendor/useVendor";
import { showError } from "@/utils/customToast";
import { useDispatch } from "react-redux";
import { setVendor } from "@/store/slices/vendorSlice";

const VendorProfile: React.FC = () => {
    const dispatch = useDispatch();
    const vendor = useSelector((state: RootState) => state.vendor.vendor);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const { data: vendorProfileResponse } = useGetVendor();
    const { mutate: updateVendor } = useUpdateVendor();

    useEffect(() => {
        if (vendorProfileResponse) {
            dispatch(setVendor(vendorProfileResponse.data))
        }
    }, [vendorProfileResponse, dispatch]);

    const handleProfileUpdate = (userData: Omit<UpdateUser, 'isVerified' | 'id' | 'email'>) => {
        const formData = new FormData()
        if (userData.firstName) {
            formData.append('firstName', userData.firstName)
        }
        if (userData.lastName) {
            formData.append('lastName', userData.lastName)
        }
        if (userData.phone) {
            formData.append('phone', String(userData.phone));
        }
        if (selectedImageFile) {
            formData.append('image', selectedImageFile);
        }
        updateVendor({ data: formData })
    };

    const handleProfileImageUpdate = () => {
        if (!selectedImageFile) {
            showError('No image provided. Please upload an Image');
            return;
        }
        const formData = new FormData();
        formData.append("image", selectedImageFile);
        updateVendor({ data: formData });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <Sidebar isOpen={sidebarOpen} />
            <main className={`flex-grow bg-background px-4 py-6 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-14 ml-0'}`}>
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-6 text-3xl font-bold">Vendor Dashboard</h1>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="mb-4 w-full justify-start">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <div className="flex flex-col h-full gap-6 bg-white rounded-sm p-4">
                                <ImageUpload onImageSelected={setSelectedImageFile} updateProfileImage={handleProfileImageUpdate} role="vendor" />
                                <ProfileSection user={vendor!} onUpdate={handleProfileUpdate} />
                            </div>
                        </TabsContent>

                        <TabsContent value="documents">
                            <KycDocuments />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default VendorProfile;
