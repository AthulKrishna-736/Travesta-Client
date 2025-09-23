import { AdminLayout } from '@/components/layouts/AdminLayout'
import VendorTable from '@/components/admin/VendorTable';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { useGetVendors } from '@/hooks/vendor/useVendor';
import React, { useEffect, useState } from 'react'
import { AlertTriangle, ArrowDownAZ, ArrowUpAZ, Clock, Search } from 'lucide-react';
import CustomSort from '@/components/common/CustomSort';
import { TSortOption } from '@/types/custom.types';

const VendorRequestPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [sortOption, setSortOption] = useState<TSortOption>({ 'name': 'ascending' });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedValue, setDebouncedValue] = useState<string>('');
    const limit = 10;

    useEffect(() => {
        const searchInput = setTimeout(() => {
            setDebouncedValue(searchTerm)
        }, 1500)

        return () => clearTimeout(searchInput)
    }, [searchTerm])

    const { data, isLoading } = useGetVendors(page, limit, debouncedValue, sortOption);


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
                setSortOption({ updatedAt: 'ascending' })
            },
            icon: Clock,
        },
    ];

    const vendors = data?.data ?? []
    const meta = data?.meta

    return (
        <AdminLayout>
            <div className="space-y-6">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendor Request Management</h1>
                    <p className="text-muted-foreground">
                        Here is the list of all vendor requests awaiting approval or review.
                    </p>
                </div>

                <div className="mt-4 flex items-start space-x-3 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 shadow-sm">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-1" />
                    <div>
                        <span className="text-sm text-yellow-800 font-semibold">Caution: </span>
                        <span className="text-sm text-yellow-700 leading-relaxed">
                            Please review the uploaded documents carefully before approving.
                            Only <span className="font-medium">verified vendors</span> will be allowed
                            to list hotels and create rooms on the platform.
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto space-y-4">
                    <div className='w-full relative'>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-800" />
                        <Input
                            type="text"
                            placeholder={`Search vendors...`}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            className="pl-10 text-gray-800 placeholder:text-gray-800 placeholder:italic"
                        />
                    </div>

                    <CustomSort data={sortOptions} />

                    {vendors && vendors.length > 0 ? (
                        <VendorTable
                            vendors={vendors}
                            loading={isLoading}
                            page={page}
                            limit={limit}
                            search={searchTerm} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                            <p className="mb-2 text-lg font-medium">No Vendors found</p>
                        </div>
                    )}
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

export default VendorRequestPage;
