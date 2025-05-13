import { UpdateUser } from "@/types/user.types"
import { axiosInstance } from "./axiosInstance"


export const updateUser = async (data: Omit<UpdateUser, 'isVerified'>) => {
    const response = await axiosInstance.patch(`/user/profile`, data)
    return response.data
}