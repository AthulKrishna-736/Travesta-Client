import { useState } from 'react';
import VendorBookingTable from '@/components/booking/VendorListBooking';
import { useGetVendorBookings } from '@/hooks/user/useBooking';
import Pagination from '@/components/common/Pagination';
import VendorLayout from '@/components/layouts/VendorLayout';
import { TPagination } from '@/types/custom.types';

const VendorBookingListPage = () => {
    const [page, setPage] = useState(1);
    const BOOKINGS_LIMIT = 10;

    const { data: bookingsRes, isLoading } = useGetVendorBookings(page, BOOKINGS_LIMIT);
    const bookings = bookingsRes?.data ?? [];
    const meta = bookingsRes?.meta as TPagination;

    return (
        <VendorLayout title='Vendor Bookings'>
            <>
                <VendorBookingTable bookings={bookings || []} loading={isLoading} />
                {meta && meta.totalPages > 0 && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </>
        </VendorLayout>
    );
};

export default VendorBookingListPage;
