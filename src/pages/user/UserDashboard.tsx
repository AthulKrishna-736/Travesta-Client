import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/user/ImageUpload";
import ProfileSection from "@/components/user/ProfileSection";
import { UpdateUser } from "@/types/user.types";
import Header from "@/components/common/Header";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";

const UserDashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

    const { mutate: updateUser } = useUpdateUser()

    const handleProfileUpdate = (userData: Omit<UpdateUser, 'isVerified'>) => {
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
        updateUser({ data: formData })
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-background px-4 py-6">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-6 text-3xl font-bold">User Dashboard</h1>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="mb-4 w-full justify-start">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            {/* <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="wishlist">Wishlist</TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="lg:col-span-1">
                                    <ImageUpload onImageSelected={setSelectedImageFile} role="user"/>
                                </div>
                                <div className="lg:col-span-2">
                                    <ProfileSection user={user} onUpdate={handleProfileUpdate} />
                                </div>
                            </div>
                        </TabsContent>

                        {/* <TabsContent value="wishlist">
                            <Wishlist user={user} />
                        </TabsContent> */}
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
