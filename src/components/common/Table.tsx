import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import React from "react"
import { DataTableProps } from "@/types/component.types"
import { LoaderCircleIcon, ToggleLeft, ToggleRight } from "lucide-react"

const DataTable: React.FC<DataTableProps> = ({ columns, data, actions = [], loading = false }) => {
    if (loading) return <div className="flex justify-center"><LoaderCircleIcon className="h-10 w-10 animate-spin" /></div>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                    {actions.length > 0 && <TableHead>Actions</TableHead>}
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
                                {actions.map((action, i) => (
                                    <div key={i} onClick={() => action.onClick(row)}>
                                        {row.isBlocked ? <ToggleRight className="w-10 h-8" /> : <ToggleLeft className="w-10 h-8" />}
                                    </div>
                                ))}
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DataTable
