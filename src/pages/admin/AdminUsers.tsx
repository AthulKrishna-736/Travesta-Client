import { AdminLayout } from "@/components/header/admin/AdminLayout"
import UserTable from "@/components/admin/UserTable"
import Pagination from "@/components/common/Pagination"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useGetAllUsers } from "@/hooks/user/useUser"
import { useEffect, useState } from "react"

const AdminUsers = () => {
    const [page, setPage] = useState(1)
    const [role, setRole] = useState<'user' | 'vendor'>('user')
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedValue, SetDebouncedValue] = useState<string>('');
    const limit = 10
    const { data, isLoading } = useGetAllUsers(page, limit, role, debouncedValue);

    const handleRoleChange = (val: string) => {
        if (val) {
            setRole(val as 'user' | 'vendor')
            setPage(1)
            setSearchTerm('')
            SetDebouncedValue('')
        }
    }

    useEffect(() => {
        const searchInput = setTimeout(() => {
            SetDebouncedValue(searchTerm)
        }, 1500)

        return () => clearTimeout(searchInput)
    }, [searchTerm])

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

                <div className="overflow-x-auto space-y-4">
                    <Input
                        type="text"
                        placeholder={`Search ${role}s...`}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <UserTable users={users} loading={isLoading} page={page} limit={limit} role={role} search={debouncedValue} />
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
