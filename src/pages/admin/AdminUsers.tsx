import { AdminLayout } from "@/components/admin/layout/AdminLayout"
import UserTable from "@/components/admin/UserTable"
import { useGetAllUsers } from "@/hooks/admin/useGetAllUsers"

const AdminUsers = () => {

    const { data: users = [], isLoading } = useGetAllUsers()

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Here is the list of all users registered on the platform.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <UserTable users={users} loading={isLoading} /> 
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminUsers
