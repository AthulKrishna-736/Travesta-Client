import { AdminLayout } from "@/components/admin/layout/AdminLayout"
import UsersTable from "@/components/common/Table"

const AdminUsers = () => {
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
                    <UsersTable /> 
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminUsers
