import { AdminLayout } from "@/components/layouts/AdminLayout"
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
            name: "A to Z",
            tooltip: "Sort alphabetically ascending",
            onClickHandler: () => {
                setPage(1);
                setSortOption({ firstName: 'ascending' });
            },
            icon: ArrowUpAZ,
        },
        {
            name: "Z to A",
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
            <div className="min-h-screen bg-slate-50/80 p-6">
                <div className="flex flex-col gap-5">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Platform Members</h1>
                        <p className="text-muted-foreground">
                            Here is the list of all users and vendors registered on the platform.
                        </p>
                    </div>
                    <div className="flex justify-between">

                        <ToggleGroup
                            type="single"
                            value={role}
                            onValueChange={handleRoleChange}
                            className="w-fit gap-1 rounded-lg bg-gray-100 p-1"
                        >
                            <ToggleGroupItem
                                value="user"
                                className="rounded-md border-0 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:shadow-sm"
                            >
                                Users
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="vendor"
                                className="rounded-md border-0 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:shadow-sm"
                            >
                                Vendors
                            </ToggleGroupItem>
                        </ToggleGroup>

                        <Input
                            type="text"
                            placeholder={`Search ${role}s...`}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0"
                        />

                    </div>

                    <CustomSort data={sortOptions} />

                    <UserTable users={users} loading={isLoading} />

                    {meta && meta.totalPages > 0 && (
                        <Pagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminUsers
