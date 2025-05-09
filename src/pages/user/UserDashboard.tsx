import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import ImageUpload from "@/components/user/ImageUpload";
import AccountStatus from "@/components/user/AccountStatus";
import ProfileSection from "@/components/user/ProfileSection";
import Wishlist from "@/components/user/Wishlist";
import { KycDocuments } from "@/components/user/KycDocument";
import { UserType } from "@/types/response.types";
import { UpdateUser } from "@/types/user.types";


// Dummy user data
const dummyUser: UserType = {
    id: "user-001",
    name: "John Doe",
    email: "johndoe@example.com",
    phone: 1234567890,
    isGoogle: false,
    isBlocked: false,
    isVerified: true,
    role: "user",
    subscriptionType: "basic",
    wishlist: [
        {
            id: "item-001",
            image: "https://via.placeholder.com/150",
        },
        {
            id: "item-002",
            image: "https://via.placeholder.com/150",
        },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
};

// Dummy update user (ProfileSection expects `UpdateUser`)
const dummyUpdateUser: UpdateUser = {
    id: dummyUser.id,
    firstName: "John",
    lastName: "Doe",
    email: dummyUser.email,
    phone: dummyUser.phone,
};

const UserDashboard = () => {
    const [user, setUser] = useState<UserType>(dummyUser);

    // const handleUpdateUser = (updated: Partial<UserType>) => {
    //     setUser((prev: any) => ({
    //         ...prev,
    //         ...updated,
    //     }));
    // };

    const handleProfileUpdate = (updatedUser: UpdateUser) => {
        setUser((prev: any) => ({
            ...prev,
            name: `${updatedUser.firstName} ${updatedUser.lastName}`,
            email: updatedUser.email,
            phone: updatedUser.phone,
        }));
    };

    const handleKycUpdate = (payload: { userId: string; files: File[] }) => {
        // Placeholder for update logic
        console.log("KYC submitted for:", payload.userId);
    };

    return (
        <div className="min-h-screen w-full bg-background px-4 py-6">
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
                                <div className="mt-6">
                                    <AccountStatus />
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <ProfileSection user={dummyUpdateUser} onUpdate={handleProfileUpdate} />
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

                <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
                    <p>© 2025 User Dashboard. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default UserDashboard;
