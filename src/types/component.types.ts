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