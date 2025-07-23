import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import React from "react"
import { DataTableProps } from "@/types/component.types"
import { LoaderCircleIcon } from "lucide-react"
import { Button } from "../ui/button"

const DataTable: React.FC<DataTableProps> = ({ columns, data, actions = [], loading = false }) => {
    if (loading) return <div className="flex justify-center"><LoaderCircleIcon className="h-10 w-10 animate-spin" /></div>;

    return (
        <Table>
            <TableHeader className="bg-sky-300">
                <TableRow className="bg-sky-300">
                    {columns.map((col) => (
                        <TableHead
                            key={col.key}
                            className="text-sm font-semibold text-gray-700 border-b border-gray-300 px-4 py-2"
                        >
                            {col.label}
                        </TableHead>
                    ))}
                    {actions.length > 0 && (
                        <TableHead className="text-sm font-semibold text-gray-700 border-b border-gray-300 px-4 py-2">
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
                                {typeof row[col.key] === "boolean"
                                    ? row[col.key] ? "Yes" : "No"
                                    : row[col.key]}
                            </TableCell>
                        ))}
                        {actions.length > 0 && (
                            <TableCell>
                                {actions.map((action, i) => {
                                    const Icon = typeof action.icon === "function" ? action.icon(row) : action.icon;

                                    return (
                                        <Button
                                            key={i}
                                            variant={action.variant || "default"}
                                            onClick={() => action.onClick(row)}
                                            className={`flex items-center gap-1 px-3 ${action.className || ""}`}
                                        >
                                            {Icon && React.createElement(Icon as any, { className: "w-4 h-4" })}
                                            {action.showLabel !== false && <span>{action.label}</span>}
                                        </Button>
                                    );
                                })}

                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DataTable
