import { AdminLayout } from '@/components/layouts/AdminLayout'
import VendorTable from '@/components/admin/VendorTable';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { useGetVendors } from '@/hooks/vendor/useVendor';
import React, { useEffect, useState } from 'react'
import { AlertTriangle, ArrowDownAZ, ArrowUpAZ, Clock } from 'lucide-react';
import CustomSort from '@/components/common/CustomSort';
import { TSortOption } from '@/types/custom.types';
import EmptyState from '@/components/common/EmptyState';

const VendorRequestPage: React.FC = () => {
    const LIMIT = 10;
    const [page, setPage] = useState(1);
    const [sortOption, setSortOption] = useState<TSortOption>({ 'name': 'ascending' });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedValue, setDebouncedValue] = useState<string>('');

    useEffect(() => {
        const searchInput = setTimeout(() => {
            setDebouncedValue(searchTerm)
        }, 1500)

        return () => clearTimeout(searchInput)
    }, [searchTerm])

    const { data, isLoading } = useGetVendors(page, LIMIT, debouncedValue, sortOption);

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
                setSortOption({ updatedAt: 'ascending' })
            },
            icon: Clock,
        },
    ];

    const vendors = data?.data ?? []
    const meta = data?.meta

    return (
        <AdminLayout>
            <div className="min-h-screen bg-slate-100 p-6">
                <div className='flex flex-col gap-5'>
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

                    <div className='flex justify-end'>
                        <Input
                            type="text"
                            placeholder={`Search vendors...`}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0"
                        />
                    </div>

                    <CustomSort data={sortOptions} />

                    <div className={`min-h-[70vh] flex ${vendors.length > 0 ? '' : 'items-center bg-white'} justify-center rounded-sm`}>
                        {vendors && vendors.length > 0 ? (
                            <VendorTable
                                vendors={vendors}
                                loading={isLoading}
                                page={page}
                                limit={LIMIT}
                                search={searchTerm} />
                        ) : (
                            <EmptyState
                                title="No vendor requests found"
                                description="There are no vendor requests available at the moment. Vendor requests will appear here once they are submitted."
                            />
                        )}
                    </div>
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
