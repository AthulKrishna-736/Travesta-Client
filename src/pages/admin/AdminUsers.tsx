import { AdminLayout } from "@/components/admin/layout/AdminLayout"
import UserTable from "@/components/admin/UserTable"
import Pagination from "@/components/common/Pagination"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useGetAllUsers } from "@/hooks/admin/useGetAllUsers"
import { useState } from "react"

const AdminUsers = () => {
    const [page, setPage] = useState(1)
    const [role, setRole] = useState<'user' | 'vendor'>('user')
    const limit = 10
    const { data, isLoading } = useGetAllUsers(page, limit, role);

    const handleRoleChange = (val: string) => {
        if (val) {
            setRole(val as 'user' | 'vendor')
            setPage(1)
        }
    }

    const users = data?.data ?? [];
    const meta = data?.meta;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Here is the list of all users registered on the platform.
                    </p>
                </div>

                <ToggleGroup type="single" value={role} onValueChange={handleRoleChange}
                    className="w-fit"
                >
                    <ToggleGroupItem value="user">Users</ToggleGroupItem>
                    <ToggleGroupItem value="vendor">Vendors</ToggleGroupItem>
                </ToggleGroup>

                <div className="overflow-x-auto">
                    <UserTable users={users} loading={isLoading} page={page} limit={limit} role={role} />
                </div>

                {meta && meta.totalPages > 0 && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminUsers
