import { useState } from 'react';
import VendorBookingTable from '@/components/booking/VendorListBooking';
import { useGetVendorBookings } from '@/hooks/user/useBooking';
import Pagination from '@/components/common/Pagination';
import VendorLayout from '@/components/layouts/VendorLayout';
import { TPagination } from '@/types/custom.types';
import { useHotelsByVendor } from '@/hooks/vendor/useHotel';

const VendorBookingListPage = () => {
    const [page, setPage] = useState(1);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const BOOKINGS_LIMIT = 10;

    const { data: bookingsRes, isLoading } = useGetVendorBookings(page, BOOKINGS_LIMIT, selectedHotelId, startDate, endDate);
    const { data: hotelsData } = useHotelsByVendor(page, 40);
    const hotels = hotelsData?.data;
    const bookings = bookingsRes?.data ?? [];
    const meta = bookingsRes?.meta as TPagination;

    return (
        <VendorLayout title='Vendor Bookings'>
            <>
                <div className="p-2 flex justify-end items-center gap-4 w-full">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                            type="date"
                            className="border border-[#0084ff] rounded-md py-2 px-2"
                            value={startDate}
                            onChange={(e) => {
                                const newStartDate = e.target.value;
                                setStartDate(newStartDate);

                                if (endDate && new Date(endDate) < new Date(newStartDate)) {
                                    setEndDate('');
                                }
                            }} />
                        <span className="text-gray-600">to</span>
                        <input
                            type="date"
                            className="border border-[#0084ff] rounded-md py-2 px-2"
                            value={endDate}
                            min={startDate || undefined}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <select
                        className="border border-[#0084ff] rounded-md py-2 w-1/4"
                        value={selectedHotelId}
                        onChange={(e) => setSelectedHotelId(e.target.value)}
                    >
                        <option value="">All Hotels</option>
                        {hotels?.map((h: any) => (
                            <option key={h.id} value={h.id}>
                                {h.name}
                            </option>
                        ))}
                    </select>
                </div>
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
