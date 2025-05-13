import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/user/ImageUpload";
import ProfileSection from "@/components/user/ProfileSection";
import Wishlist from "@/components/user/Wishlist";
import { KycDocuments } from "@/components/user/KycDocument";
import { UpdateUser } from "@/types/user.types";
import Header from "@/components/common/Header";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";

const UserDashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    const { mutate: updateUser } = useUpdateUser()

    const handleProfileUpdate = (updatedUser: Omit<UpdateUser, 'isVerified'>) => {
        updateUser({ data: updatedUser })
    };

    const handleKycUpdate = (payload: { userId: string; files: File[] }) => {
        console.log("KYC submitted for:", payload.userId);
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
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="lg:col-span-1">
                                    <ImageUpload />
                                </div>
                                <div className="lg:col-span-2">
                                    <ProfileSection user={user} onUpdate={handleProfileUpdate} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="documents">
                            <KycDocuments userId={user.id} onUpdate={handleKycUpdate} />
                        </TabsContent>

                        <TabsContent value="wishlist">
                            <Wishlist user={user} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
