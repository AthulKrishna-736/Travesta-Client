import React, { useState } from "react";
import DataTable from "../common/Table";
import { Booking, BookingTableProps } from "@/types/booking.types";
import BookingDetailModalVendor from "./BookingDetailVendor";

const VendorBookingTable: React.FC<BookingTableProps> = ({ bookings, loading }) => {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    if (!Array.isArray(bookings)) return <div>No bookings available</div>;

    const flattenedBookings = bookings.map((booking: any) => ({
        ...booking,
        userName: booking.userId.firstName,
        hotelName: booking.hotelId.name,
        roomName: booking.roomId.name,
        basePrice: booking.roomId.basePrice,
    }));


    const columns = [
        { key: 'hotelName', label: 'Hotel' },
        { key: 'roomName', label: 'Room' },
        { key: 'basePrice', label: 'Base Price' },
        { key: 'checkIn', label: 'Check-In' },
        { key: 'checkOut', label: 'Check-Out' },
        { key: 'guests', label: 'Guests' },
        { key: 'totalPrice', label: 'Total Price' },
        { key: 'status', label: 'Status' },
        { key: 'userName', label: 'User' }
    ];


    const actions = [
        {
            label: "Details",
            variant: "outline" as const,
            onClick: (booking: Booking) => {
                setSelectedBooking(booking);
                setIsDetailsModalOpen(true);
            },
        },
    ];

    return (
        <>
            {loading ?
                (
                    <div className="flex justify-center items-center py-10">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-3 text-blue-600 font-medium">Loading rooms...</p>
                        </div>
                    </div>
                ) : flattenedBookings && flattenedBookings.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={flattenedBookings}
                        actions={actions}
                        loading={loading}
                    />
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="text-semibold text-lg text-red-500">No Bookings found</p>
                    </div>
                )}

            <BookingDetailModalVendor
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                booking={selectedBooking}
            />
        </>
    );
};

export default VendorBookingTable;
