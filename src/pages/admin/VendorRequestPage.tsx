import { AdminLayout } from '@/components/header/admin/AdminLayout'
import VendorTable from '@/components/admin/VendorTable';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { useGetVendors } from '@/hooks/vendor/useVendor';
import React, { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react';

const VendorRequestPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedValue, setDebouncedValue] = useState<string>('');
    const limit = 10;

    useEffect(() => {
        const searchInput = setTimeout(() => {
            setDebouncedValue(searchTerm)
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
                    <Input
                        type="text"
                        placeholder={`Search vendors...`}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <VendorTable vendors={vendors} loading={isLoading} page={page} limit={limit} search={searchTerm} />
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
