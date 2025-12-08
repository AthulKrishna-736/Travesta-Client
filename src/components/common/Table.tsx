import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import React from "react"
import { DataTableProps } from "@/types/custom.types"
import { LoaderCircleIcon, LucideIcon } from "lucide-react"
import { Button } from "../ui/button"

const DataTable: React.FC<DataTableProps> = ({ columns, data, actions = [], loading = false }) => {
    if (loading) return <div className="flex justify-center"><LoaderCircleIcon className="h-10 w-10 animate-spin" /></div>;

    return (
        <Table>
            <TableHeader className="bg-[#222b2f]">
                <TableRow>
                    {columns.map((col) => (
                        <TableHead
                            key={col.key}
                            className="text-sm font-semibold text-white px-4 py-0"
                        >
                            {col.label}
                        </TableHead>
                    ))}
                    {actions.length > 0 && (
                        <TableHead className="text-sm font-semibold text-white px-4 py-2">
                            Actions
                        </TableHead>
                    )}
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columns.map((col) => (
                            <TableCell key={col.key}>
                                {typeof row[col.key] === "boolean" ? (
                                    row[col.key] ? (
                                        <span className="px-4 py-2 rounded-sm bg-green-100 text-green-700 text-xs font-medium">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="px-4 py-2 rounded-sm bg-red-100 text-red-700 text-xs font-medium">
                                            No
                                        </span>
                                    )
                                ) : col.key === 'name' || col.key === 'firstName' ? (
                                    <span className="font-semibold">{row[col.key]}</span>
                                ) : col.key === 'role' || col.key === 'type' ? (
                                    <span className="px-4 py-2 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium">{row[col.key]}</span>
                                ) : (
                                    row[col.key]
                                )}
                            </TableCell>
                        ))}
                        {actions.length > 0 && (
                            <TableCell className="whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    {actions.map((action, i) => {
                                        const isHidden = typeof action.hidden === "function" ? action.hidden(row) : action.hidden;
                                        if (isHidden) return null;

                                        const Icon = typeof action.icon === 'function' ? action.icon(row) as LucideIcon : action.icon;
                                        const className = typeof action.className === "function" ? action.className(row) : action.className || "";
                                        const toolTip = typeof action.tooltip === 'function' ? action.tooltip(row) as string : action.tooltip || "";
                                        return (
                                            <Button
                                                key={i}
                                                variant={action.variant || "default"}
                                                onClick={() => action.onClick(row)}
                                                className={`flex items-center gap-1 px-2 py-1 text-sm ${className}`}
                                                title={toolTip}
                                            >
                                                {Icon && <Icon className='w-4 h-4' />}
                                                {action.showLabel !== false && (
                                                    <span>
                                                        {typeof action.label === "function" ? action.label(row) : action.label}
                                                    </span>
                                                )}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DataTable
