import React, { useState } from "react";
import Header from "@/components/common/Header";
import BookingTable from "@/components/booking/UserListBooking";
import Pagination from "@/components/common/Pagination";
import { useGetUserBookings } from "@/hooks/user/useBooking";
import UserSidebar from "@/components/common/UserSidebar";
import { Menu } from "lucide-react";

const UserBookingListPage: React.FC = () => {
    const limit = 6;
    const [page, setPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data: bookingsResponse, isLoading } = useGetUserBookings(page, limit);

    const bookings = bookingsResponse?.data || [];
    const meta = bookingsResponse?.meta || { currentPage: 1, totalPages: 1 };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {!sidebarOpen && (
                <button
                    className="fixed top-18 left-1 z-40 bg-yellow-200 p-2 rounded-md shadow-lg lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            <main className="flex-grow bg-background px-4 py-6 mt-4 lg:ml-64">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-6 text-3xl font-bold">Your Bookings</h1>

                    <BookingTable
                        bookings={bookings}
                        loading={isLoading}
                    />

                    {meta.totalPages > 0 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={meta.currentPage}
                                totalPages={meta.totalPages}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        </div>
                    )}
                </div>
            </main>


        </div>
    );
};

export default UserBookingListPage;
