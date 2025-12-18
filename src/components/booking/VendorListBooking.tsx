import React, { useState } from "react";
import DataTable from "../common/Table";
import { IBooking, BookingTableProps } from "@/types/booking.types";
import BookingDetailModalVendor from "./BookingDetailVendor";

const VendorBookingTable: React.FC<BookingTableProps> = ({ bookings, loading }) => {
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    if (!Array.isArray(bookings)) return <div>No bookings available</div>;

    const flattenedBookings = bookings.map((booking: IBooking) => ({
        ...booking,
        roomName: booking.room ? booking.room.name : booking.roomId,
        basePrice: booking.room ? booking.room.basePrice : booking.roomId,
    }));


    const columns = [
        { key: 'roomName', label: 'Room' },
        { key: 'basePrice', label: 'Price' },
        { key: 'checkIn', label: 'Check-In' },
        { key: 'checkOut', label: 'Check-Out' },
        { key: 'guests', label: 'Guests' },
        { key: 'totalPrice', label: 'Total Price' },
        { key: 'status', label: 'Status' },
    ];


    const actions = [
        {
            label: "Details",
            variant: "outline" as const,
            onClick: (booking: IBooking) => {
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
                    <div className="rounded-lg border-1 overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={flattenedBookings}
                            actions={actions}
                            loading={loading}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="font-semibold text-2xl text-red-500 bg-red-100 w-full text-center py-5">No Bookings found!</p>
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
