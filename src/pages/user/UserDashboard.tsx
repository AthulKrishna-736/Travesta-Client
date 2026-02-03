import React, { useEffect, useState } from "react";
import ImageUpload from "@/components/profile/ProfileImage";
import ProfileSection from "@/components/profile/ProfileSection";
import { UpdateUser } from "@/types/user.types";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useGetUser, useUpdateUser } from "@/hooks/user/useUser";
import { showError } from "@/utils/customToast";
import UserLayout from "../../components/layouts/UserLayout";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

const UserDashboard: React.FC = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

    const isAuthenticated = Boolean(useSelector((state: RootState) => state.user.user?.id));

    const { data: UserProfileResponse } = useGetUser(isAuthenticated);
    const { mutate: updateUser } = useUpdateUser();

    useEffect(() => {
        if (UserProfileResponse) {
            dispatch(setUser(UserProfileResponse.data));
        }
    }, [UserProfileResponse, dispatch]);

    const handleProfileUpdate = (userData: Omit<UpdateUser, "isVerified" | "id" | "email" | 'password'>) => {
        const formData = new FormData();
        if (userData.firstName) formData.append("firstName", userData.firstName);
        if (userData.lastName) formData.append("lastName", userData.lastName);
        if (userData.phone) formData.append("phone", String(userData.phone));
        if (selectedImageFile) formData.append("image", selectedImageFile);
        updateUser({ data: formData });
    };

    const handleProfileImageUpdate = () => {
        if (!selectedImageFile) {
            showError("No image provided. Please upload an Image");
            return;
        }
        const formData = new FormData();
        formData.append("image", selectedImageFile);
        updateUser({ data: formData });
    };

    return (
        <UserLayout>
            <>
                <div className="flex flex-col h-full gap-6 bg-white rounded-sm p-4">
                    <ImageUpload onImageSelected={setSelectedImageFile} updateProfileImage={handleProfileImageUpdate} />
                    <ProfileSection user={user!} onUpdate={handleProfileUpdate} />
                </div>
            </>
        </UserLayout>
    );
};

export default UserDashboard;
