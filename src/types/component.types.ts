import { ReactNode } from "react";
import { IHotel, IRoom, UpdateUser } from "./user.types";
import { IUserType } from "./response.types";

export interface AdminLayoutProps {
    children: ReactNode
}

export type Action = {
    label: string
    onClick: (rowData: any) => void
    variant?: "default" | "outline" | "ghost" | "link" | "destructive"
    className?: string
}

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
    onUpdate: (updatedUser: Omit<UpdateUser, 'isVerified'>) => void;
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
export type UpdateUserFormValues = Omit<UpdateUser, 'isVerified'>;

export type ImageUploadProps = {
    onImageSelected: (file: File | null) => void;
    role: 'vendor' | 'user'
};

export interface ICreateHotelModalProps {
    open: boolean;
    onClose: () => void;
    isLoading: boolean;
    onSubmit: (data: IHotel & { images: File[] }) => void;
    hotelData?: IHotel | null;
    isEdit?: boolean;
}

export interface IMutilImageUploadProps {
    maxImages?: number;
    onImagesChange: (files: File[]) => void;
    initialImageUrls?: string[];
};

export interface IHotelTableProps {
    hotels: IHotel[];
    loading: boolean;
    onEdit?: (hotel: IHotel) => void;
}

type RoomSubmitPayload =
    | FormData
    | { id: string; data: FormData };


export interface ICreateRoomProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: RoomSubmitPayload) => void;
    isLoading: boolean;
    roomData?: IRoom | null;
    isEdit?: boolean;
    hotelId: string;
}

export interface IRoomTableProps {
    rooms: IRoom[];
    loading: boolean;
    onEdit?: (room: IRoom) => void;
}
