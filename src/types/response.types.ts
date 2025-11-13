import { TRoles } from "./auth.types";
import { IAmenity } from "./component.types";
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

export type TGetAmenityResponse = {
    data: IAmenity[],
    meta: TPagination,
}

export type THotelResponse = {
    _id?: string;
    vendorId: string;
    name: string;
    description: string;
    images: string[];
    rating: number;
    amenities: { _id: string, name: string }[];
    tags: string[];
    state: string;
    city: string;
    address: string;
    geoLocation: {
        type: String,
        coordinates: [number, number],
    };
    propertyRules: {
        checkInTime: string
        checkOutTime: string
        minGuestAge: number
        breakfastFee?: number
        petsAllowed: boolean
        outsideFoodAllowed: boolean
        idProofAccepted: string[]
        specialNotes: string
    }
}

export type TRoomResponse = {
    id: string;
    name: string;
    hotelId: string | THotelResponse
    roomType: string;
    roomCount: number;
    bedType: string;
    guest: number;
    amenities: { _id: string, name: string }[];
    images: string[];
    basePrice: number;
    gstPrice: number;
    isAvailable: boolean;
}