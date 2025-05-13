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
    onUpdate: (updatedUser: UpdateUser) => void;
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