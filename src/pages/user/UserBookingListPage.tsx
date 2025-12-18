import React, { useEffect, useState } from "react";
import BookingTable from "@/components/booking/UserListBooking";
import Pagination from "@/components/common/Pagination";
import { useGetUserBookings } from "@/hooks/user/useBooking";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CustomSort from "@/components/common/CustomSort";
import UserLayout from "@/components/layouts/UserLayout";

const UserBookingListPage: React.FC = () => {
    const limit = 6;
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedValue, setDebouncedValue] = useState<string>("");
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(searchTerm);
            setPage(1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: bookingsResponse, isLoading } = useGetUserBookings(
        page,
        limit,
        debouncedValue,
        sortOption
    );

    const bookings = bookingsResponse?.data || [];
    const meta = bookingsResponse?.meta || { currentPage: 1, totalPages: 1 };

    const sortOptions = [
        {
            name: "Recent Bookings",
            tooltip: "Sort by newest booking",
            onClickHandler: () => {
                setPage(1);
                setSortOption("recent");
            },
        },
        {
            name: "Name A to Z",
            tooltip: "Sort by guest name ascending",
            onClickHandler: () => {
                setPage(1);
                setSortOption("name_asc");
            },
        },
        {
            name: "Name Z to A",
            tooltip: "Sort by guest name descending",
            onClickHandler: () => {
                setPage(1);
                setSortOption("name_desc");
            },
        },
        {
            name: "Price: Low to High",
            tooltip: "Sort by total price ascending",
            onClickHandler: () => {
                setPage(1);
                setSortOption("price_asc");
            },
        },
        {
            name: "Price: High to Low",
            tooltip: "Sort by total price descending",
            onClickHandler: () => {
                setPage(1);
                setSortOption("price_desc");
            },
        },
    ];


    return (
        <UserLayout>
            <>
                <div className="mx-auto max-w-6xl space-y-6 bg-white p-6 rounded-md">
                    <h1 className="text-3xl font-bold">Your Bookings</h1>

                    {/* search box */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-800" />
                        <Input
                            type="text"
                            placeholder="Search bookings..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            className="pl-10 text-gray-800 placeholder:text-gray-800 placeholder:italic"
                        />
                    </div>

                    {/* sorting */}
                    <div className="p-2 bg-blue-50">
                        <CustomSort data={sortOptions} />
                    </div>

                    {/* table */}
                    <BookingTable bookings={bookings} loading={isLoading} />

                    {/* pagination */}
                    {meta.totalPages > 0 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={meta.currentPage}
                                totalPages={meta.totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </div>
            </>
        </UserLayout>
    );
};

export default UserBookingListPage;
