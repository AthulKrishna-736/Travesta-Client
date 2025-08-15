import { ReactNode } from "react";
import { IHotel, IRoom, UpdateUser } from "./user.types";
import { IUserType } from "./response.types";

export interface AdminLayoutProps {
    children: ReactNode
}

export type Action = {
    label: string | ((rowData: any) => string);
    onClick: (rowData: any) => void;
    variant?: "default" | "outline" | "ghost" | "link" | "destructive";
    className?: string | ((rowData: any) => string); 
    showLabel?: boolean;
    icon?: any;
};


export interface DataTableProps {
    columns: { key: string; label: string }[]
    data: any[]
    actions?: Action[]
    loading?: boolean
}

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export interface ConfirmationModalProps {
    open: boolean
    title: string
    description?: string
    extraNote?: React.ReactNode
    showInput?: boolean
    inputValue?: string
    onInputChange?: (val: string) => void
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
}

export interface KycDocumentsProps {
    userId: string;
    onUpdate: (payload: { userId: string; files: File[] }) => void;
}

export interface ProfileSectionProps {
    user: UpdateUser;
    onUpdate: (updatedUser: Omit<UpdateUser, 'isVerified' | 'id' | 'email'>) => void;
}

export interface WishlistProps {
    user: IUserType
}

export interface ShowDetailModalProps {
    open: boolean
    title: string
    data: IUserType
    onCancel: () => void
}
export type UpdateUserFormValues = Omit<UpdateUser, 'isVerified' | 'id'>;

export type ImageUploadProps = {
    onImageSelected: (file: File | null) => void;
    updateProfileImage?: () => void;
    role: 'vendor' | 'user'
};

export interface ICreateHotelModalProps {
    open: boolean;
    onClose: () => void;
    isLoading: boolean;
    onSubmit: (data: IHotel & { oldImages: string[] }) => void;
    hotelData?: IHotel | null;
    isEdit?: boolean;
}

export interface IMutilImageUploadProps {
    maxImages: number;
    onImagesChange: (files: (string | File)[]) => void;
    initialImageUrls?: string[];
};

export interface IHotelTableProps {
    hotels: IHotel[];
    loading: boolean;
    onHotelsFetched?: (hotels: IHotel[]) => void;
}

type RoomSubmitPayload = FormData | { id: string; data: FormData };


export interface ICreateRoomProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: RoomSubmitPayload) => void;
    isLoading: boolean;
    roomData?: IRoom | null;
    isEdit?: boolean;
    hotelId?: string;
}

export interface IRoomTableProps {
    hotels: IHotel[]
    rooms: IRoom[];
    loading: boolean;
}


export interface IAmenity {
    _id: string
    name: string
    description: string
    type: 'hotel' | 'room'
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface AmenityTableProps {
    amenities: IAmenity[]
    loading: boolean
    page: number
    limit: number
}

export interface TCreateAmenityData {
    name: string;
    description: string;
    type: "hotel" | "room";
}

export interface IAmenitiesModalProps {
    open: boolean;
    title: string;
    onCancel: () => void;
    onSubmit: (data: TCreateAmenityData) => void;
    initialData?: TCreateAmenityData;
    loading?: boolean;
}

export interface RoomCardLayoutProps {
    room: any;
    bookingRoomId: string | null;
    setBookingRoomId: (id: string | null) => void;
    formData: {
        checkIn: string;
        checkOut: string;
        guests: number;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBookingSubmit: (roomId: string) => void;
    handleBookClick: (roomId: string) => void;
}