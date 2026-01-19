import React from "react"
import DataTable from "../common/Table"
import { User, UserTableProps } from "@/types/user.types"
import ConfirmationModal from "../common/ConfirmationModa"
import { useBlockUser } from "@/hooks/user/useUser"
import { Ban, Unlock } from "lucide-react"
import { Column } from "@/types/custom.types"


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

    const columns: Column<User>[] = [
        { key: "firstName", label: "Name", render: (value) => (<span className="font-semibold">{value}</span>) },
        { key: "email", label: "Email" },
        {
            key: "role", label: "Role", render: (value) => (
                <span className="px-4 py-2 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium">
                    {value}
                </span>
            ),
        },
        {
            key: "isBlocked", label: "Blocked", render: (value) => value ? (
                <span className="px-4 py-2 rounded-sm bg-red-100 text-red-700 text-xs font-medium">
                    Yes
                </span>
            ) : (
                <span className="px-4 py-2 rounded-sm bg-green-100 text-green-700 text-xs font-medium">
                    No
                </span>
            ),
        },
    ];

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
                <DataTable<User>
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