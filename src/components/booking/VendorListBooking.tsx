import React, { useState } from "react";
import DataTable from "../common/Table";
import BookingDetailDialog from "./BookingDetailsModal";
import { Booking, BookingTableProps } from "@/types/booking.types";

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
            variant: "default" as const,
            onClick: (booking: Booking) => {
                setSelectedBooking(booking);
                setIsDetailsModalOpen(true);
            },
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={flattenedBookings}
                actions={actions}
                loading={loading}
            />

            <BookingDetailDialog
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                booking={selectedBooking}
            />
        </>
    );
};

export default VendorBookingTable;
