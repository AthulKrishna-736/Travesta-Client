import { AdminLayout } from "@/components/header/admin/AdminLayout"
import UserTable from "@/components/admin/UserTable"
import Pagination from "@/components/common/Pagination"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useGetAllUsers } from "@/hooks/user/useUser"
import { useEffect, useState } from "react"
import { ArrowDownAZ, ArrowUpAZ, Clock, Search } from "lucide-react"
import CustomSort from "@/components/common/CustomSort"
import { TSortOption } from "@/types/custom.types"

const AdminUsers = () => {
    const [page, setPage] = useState(1)
    const [role, setRole] = useState<'user' | 'vendor'>('user')
    const [sortOption, setSortOption] = useState<TSortOption>({ firstName: 'ascending' })
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedValue, SetDebouncedValue] = useState<string>('');
    const limit = 10
    const { data, isLoading } = useGetAllUsers(page, limit, role, debouncedValue, sortOption);

    const sortOptions = [
        {
            name: "Name (A → Z)",
            tooltip: "Sort alphabetically ascending",
            onClickHandler: () => {
                setPage(1);
                setSortOption({ firstName: 'ascending' });
            },
            icon: ArrowUpAZ,
        },
        {
            name: "Name (Z → A)",
            tooltip: "Sort alphabetically descending",
            onClickHandler: () => {
                setPage(1);
                setSortOption({ firstName: 'descending' });
            },
            icon: ArrowDownAZ,
        },
        {
            name: "Recently Updated",
            tooltip: "Sort by last updated date",
            onClickHandler: () => {
                setPage(1);
                setSortOption({ updatedAt: 'descending' })
            },
            icon: Clock,
        },
    ];

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
                    <h1 className="text-3xl font-bold tracking-tight">Platform Members</h1>
                    <p className="text-muted-foreground">
                        Here is the list of all users and vendors registered on the platform.
                    </p>
                </div>

                <ToggleGroup type="single" value={role} onValueChange={handleRoleChange}
                    className="w-fit"
                >
                    <ToggleGroupItem value="user" className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-blue-100 data-[state=on]:bg-blue-600 data-[state=on]:text-white">Users</ToggleGroupItem>
                    <ToggleGroupItem value="vendor" className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-blue-100 data-[state=on]:bg-blue-600 data-[state=on]:text-white">Vendors</ToggleGroupItem>
                </ToggleGroup>

                <div className="overflow-x-auto space-y-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-800" />
                        <Input
                            type="text"
                            placeholder={`Search ${role}s...`}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            className="pl-10 text-gray-800 placeholder:text-gray-800 placeholder:italic"
                        />
                    </div>
                    <CustomSort data={sortOptions} />

                    <UserTable users={users} loading={isLoading} />
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
