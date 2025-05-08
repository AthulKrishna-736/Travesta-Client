import { ReactNode } from "react";

export interface AdminLayoutProps {
    children: ReactNode
}

export type Action = {
    label: string
    onClick: (rowData: any) => void
    variant?: "default" | "outline" | "ghost" | "link" | "destructive"
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
}
