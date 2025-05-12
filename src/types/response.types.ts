import { TRoles } from "./auth.types";
import { TSubscriptionType, WishlistItem } from "./user.types";

export type GetAllUsersResponse = {
    data: UserType[];
    meta: Pagination;
};

type Pagination = {
    currentPage: number,
    pageSize: number,
    totalData: number,
    totalPages: number,
}

export interface UserType {
    id: string
    name: string
    email: string
    isGoogle: boolean
    phone: number
    isBlocked: boolean
    wishlist: WishlistItem[]
    isVerified: boolean
    role: TRoles
    verificationReason?: string
    subscriptionType: TSubscriptionType
    createdAt: Date
    updatedAt: Date
}

export interface CustomErrorResponse {
    message: string;
    statusCode?: number;
    success?: boolean;
}

export type GetVendorsResponse = {
    data: UserType[],
    meta: Pagination
}