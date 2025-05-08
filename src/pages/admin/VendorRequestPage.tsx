import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import VendorTable from '@/components/admin/VendorTable';
import Pagination from '@/components/common/Pagination';
import { useGetVendors } from '@/hooks/admin/useGetVendor';
import React, { useState } from 'react'

const VendorRequestPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useGetVendors(page, limit)

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
                <div className="overflow-x-auto">
                    <VendorTable vendors={vendors} loading={isLoading} />
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
