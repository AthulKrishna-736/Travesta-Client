import { useBlockUser } from "@/hooks/admin/useBlockUser"
import React from "react"
import DataTable from "../common/Table"
import { User, UserTableProps } from "@/types/user.types"
import ConfirmationModal from "../common/ConfirmationModa"


const UserTable: React.FC<UserTableProps> = ({ users, loading, page, limit, role, search }) => {
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { mutate: toggleBlock, isPending } = useBlockUser(page, limit, role, search)

    const handleConfirm = () => {
        if (selectedUser) {
            toggleBlock(selectedUser.id, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

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
            onClick: (user: User) => {
                setSelectedUser(user);
                setIsModalOpen(true);
            },
        },
    ]

    return (
        <>
            <DataTable
                columns={columns}
                data={users}
                actions={actions}
                loading={loading || isPending}
            />
            <ConfirmationModal
                open={isModalOpen}
                title={`${selectedUser?.isBlocked ? "Unblock" : "Block"} User`}
                description={`Are you sure you want to ${selectedUser?.isBlocked ? "unblock" : "block"} this user?`}
                showInput={false}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isLoading={isPending}
            />
        </>
    )
}

export default UserTable
