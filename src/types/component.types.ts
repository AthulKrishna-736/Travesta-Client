import { ReactNode } from "react";
import { UpdateUser } from "./user.types";
import { UserType } from "./response.types";

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
    user: UserType
}

export interface ShowDetailModalProps {
    open: boolean
    title: string
    data: UserType
    onCancel: () => void
}
export type UpdateUserFormValues = Omit<UpdateUser, 'isVerified'>;

export type ImageUploadProps = {
    onImageSelected: (file: File | null) => void;
    role: 'vendor' | 'user'
};

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