import { useState } from 'react';
import Header from '@/components/header/vendor/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import VendorBookingTable from '@/components/booking/VendorListBooking';
import { useGetVendorBookings } from '@/hooks/user/useBooking';
import Pagination from '@/components/common/Pagination';

const VendorBookingListPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 10;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const { data: bookingsRes, isLoading } = useGetVendorBookings(page, limit);
    const bookings = bookingsRes?.data ?? [];
    const meta = bookingsRes?.meta;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} />
                <main
                    className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-13'}`}
                >
                    <div className="container mx-auto animate-fade-in">
                        <h2 className="text-2xl font-semibold mb-4">Vendor Bookings</h2>
                        <VendorBookingTable bookings={bookings || []} loading={isLoading} />
                        {meta && meta.totalPages > 0 && (
                            <Pagination
                                currentPage={meta.currentPage}
                                totalPages={meta.totalPages}
                                onPageChange={setPage}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VendorBookingListPage;
