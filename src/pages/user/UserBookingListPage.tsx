import React, { useState } from "react";
import Header from "@/components/common/Header";
import BookingTable from "@/components/booking/UserListBooking";
import Pagination from "@/components/common/Pagination";
import { useGetUserBookings } from "@/hooks/user/useBooking";

const UserBookingListPage: React.FC = () => {
    const limit = 10;
    const [page, setPage] = useState(1);

    const { data: bookingsResponse, isLoading } = useGetUserBookings(page, limit);

    const bookings = bookingsResponse?.data || [];
    const meta = bookingsResponse?.meta || { currentPage: 1, totalPages: 1 };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-background px-4 py-6 mt-4">
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
