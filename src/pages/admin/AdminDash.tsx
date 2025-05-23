import { AdminLayout } from "@/components/admin/layout/AdminLayout"

const AdminDash = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, Admin! Here's what's happening with your platform today.
                    </p>
                </div>


                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminDash