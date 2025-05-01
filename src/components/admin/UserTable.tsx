import { useBlockUser } from "@/hooks/admin/useBlockUser"
import React from "react"
import DataTable from "../common/Table"
import { User, UserTableProps } from "@/types/user.types"


const UserTable: React.FC<UserTableProps> = ({ users, loading }) => {
    const { mutate: toggleBlock, isPending } = useBlockUser()

    const columns = [
        { key: "firstName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "isBlocked", label: "Blocked" },
    ]

    const actions = [
        {
            label: "Toggle Block",
            variant: "destructive" as const,
            onClick: (user: User) => toggleBlock(user._id),
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
