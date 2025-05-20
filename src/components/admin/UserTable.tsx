import { useBlockUser } from "@/hooks/admin/useBlockUser"
import React from "react"
import DataTable from "../common/Table"
import { User, UserTableProps } from "@/types/user.types"


const UserTable: React.FC<UserTableProps> = ({ users, loading, page, limit, role }) => {
    const { mutate: toggleBlock, isPending } = useBlockUser(page, limit, role)

    const columns = [
        { key: "firstName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "isBlocked", label: "Blocked" },
    ]

    const actions = [
        {
            label: "Toggle Block",
            variant: "ghost" as const,
            onClick: (user: User) => toggleBlock(user.id),
        },
    ]

    return (
        <DataTable
            columns={columns}
            data={users}
            actions={actions}
            loading={loading || isPending}
        />
    )
}

export default UserTable
