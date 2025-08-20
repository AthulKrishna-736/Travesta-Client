import React from "react"
import DataTable from "../common/Table"
import { User, UserTableProps } from "@/types/user.types"
import ConfirmationModal from "../common/ConfirmationModa"
import { useBlockUser } from "@/hooks/user/useUser"
import { Ban, Unlock } from "lucide-react"


const UserTable: React.FC<UserTableProps> = ({ users, loading }) => {
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { mutate: toggleBlock, isPending } = useBlockUser()

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
            label: (user: User) => (user.isBlocked ? "Unblock" : "Block"),
            variant: 'ghost' as const,
            icon: (user: User) => (user.isBlocked ? Unlock : Ban),
            tooltip: (user: User) => (user.isBlocked ? 'Unblock user' : 'Block user'),
            showLabel: false,
            className: (user: User) => user.isBlocked ? "text-green-700 hover:bg-green-100" : "text-red-700 hover:bg-red-100",
            onClick: (user: User) => {
                setSelectedUser(user);
                setIsModalOpen(true);
            },
        },
    ]

    return (
        <>
            <div className="rounded-lg border-1 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={users}
                    actions={actions}
                    loading={loading || isPending}
                />
            </div>
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