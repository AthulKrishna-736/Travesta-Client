import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import VendorTable from '@/components/admin/VendorTable';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { useGetVendors } from '@/hooks/admin/useGetVendor';
import React, { useEffect, useState } from 'react'

const VendorRequestPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedValue, SetDebouncedValue] = useState<string>('');
    const limit = 10;

    useEffect(() => {
        const searchInput = setTimeout(() => {
            SetDebouncedValue(searchTerm)
        }, 1500)

        return () => clearTimeout(searchInput)
    }, [searchTerm])

    const { data, isLoading } = useGetVendors(page, limit, debouncedValue)

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
                <div className="overflow-x-auto space-y-4">
                    <Input
                        type="text"
                        placeholder={`Search vendors...`}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <VendorTable vendors={vendors} loading={isLoading} page={page} limit={limit} />
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
