import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import React from "react"
import { DataTableProps } from "@/types/component.types"

const DataTable: React.FC<DataTableProps> = ({ columns, data, actions = [], loading = false }) => {
    if (loading) return <div>Loading...</div>

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
                                    <Button
                                        key={i}
                                        variant={action.variant || "outline"}
                                        size="sm"
                                        onClick={() => action.onClick(row)}
                                        className="mr-2"
                                    >
                                        {action.label}
                                    </Button>
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
