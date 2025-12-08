import { LucideIcon } from "lucide-react"
import { ReactElement } from "react"

//api types
export type TSortOption = {
    [key: string]: 'ascending' | 'descending',
}

export type TPagination = {
    currentPage: number,
    pageSize: number,
    totalData: number,
    totalPages: number,
}

export type TApiErrorResponse = {
    success: boolean,
    message: string,
    statusCode: number,
}

export type TApiSuccessResponse<T = any | null> = {
    success: boolean,
    message: string,
    data: T,
    meta?: TPagination,
    statusCode: number,
}

export interface ICustomError extends Error {
    response: {
        data: TApiErrorResponse,
    }
}

//component types
export interface ILayoutProps {
    children: ReactElement;
    title?: string;
}

export type Action = {
    label: string | ((rowData: any) => string);
    tooltip?: string | ((rowData: any) => string);
    onClick: (rowData: any) => void;
    variant?: "default" | "outline" | "ghost" | "link" | "destructive";
    className?: string | ((rowData: any) => string);
    showLabel?: boolean;
    icon?: LucideIcon | ((rowData: any) => LucideIcon);
    hidden?: boolean | ((rowData: any) => boolean);
};

export interface DataTableProps<T = any[]> {
    columns: { key: string; label: string }[]
    data: T
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

export type ImageUploadProps = {
    onImageSelected: (file: File | null) => void;
    updateProfileImage?: () => void;
    role: 'vendor' | 'user'
};

export interface IMutilImageUploadProps {
    maxImages: number;
    onImagesChange: (files: (string | File)[]) => void;
    initialImageUrls?: string[];
};
