import { TRoles } from "./Auth.Types";
import { TSubscriptionType, WishlistItem } from "./user.types";

export type TGetAllUsersResponse = {
    data: IUserType[];
    meta: TPagination;
};

type TPagination = {
    currentPage: number,
    pageSize: number,
    totalData: number,
    totalPages: number,
}

export interface IUserType {
    id: string
    firstName: string
    lastName: string
    email: string
    isGoogle: boolean
    phone: number
    isBlocked: boolean
    wishlist: WishlistItem[]
    isVerified: boolean
    role: TRoles
    verificationReason?: string
    kycDocuments?: []
    subscriptionType: TSubscriptionType
    createdAt: Date
    updatedAt: Date
}

export interface ICustomErrorResponse {
    message: string;
    statusCode?: number;
    success?: boolean;
}

export type TGetVendorsResponse = {
    data: IUserType[],
    meta: TPagination
}