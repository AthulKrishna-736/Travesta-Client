import React, { useState } from "react";
import DataTable from "../common/Table";
import ConfirmationModal from "../common/ConfirmationModa";
import { Booking, BookingTableProps } from "@/types/booking.types";
import { useCancelBooking } from "@/hooks/user/useBooking";
import BookingDetailDialog from "./BookingDetailsModal";

const BookingTable: React.FC<BookingTableProps> = ({ bookings, loading }) => {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleCancel = () => {
        setIsCancelModalOpen(false);
        setSelectedBooking(null);
    };

    const { mutate: cancelBookingMutate, isPending: isCancelling } = useCancelBooking();

    const handleConfirmCancel = () => {
        if (selectedBooking) {
            cancelBookingMutate(selectedBooking._id, {
                onSettled: () => {
                    handleCancel();
                }
            });
        }
    };

    const flattenedBookings = bookings.map((booking) => ({
        ...booking,
        hotelName: typeof booking.hotelId === "object" ? booking.hotelId.name : booking.hotelId,
        roomName: typeof booking.roomId === "object" ? booking.roomId.name : booking.roomId,
        basePrice: typeof booking.roomId === "object" ? booking.roomId.basePrice : undefined,
    }));

    const columns = [
        { key: "roomName", label: "Room" },
        { key: "basePrice", label: "Base Price" },
        { key: "checkIn", label: "Check-In" },
        { key: "checkOut", label: "Check-Out" },
        { key: "guests", label: "Guests" },
        { key: "totalPrice", label: "Total Price" },
        { key: "status", label: "Status" }
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
        {
            label: "Cancel",
            variant: "destructive" as const,
            onClick: (booking: Booking) => {
                setSelectedBooking(booking);
                setIsCancelModalOpen(true);
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

            <ConfirmationModal
                open={isCancelModalOpen}
                title="Cancel Booking"
                description="Are you sure you want to cancel this booking?"
                extraNote={
                    <div className="mt-4 rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-800 border border-yellow-300">
                        <strong>Note:</strong> Cancelling this booking will result in a <strong>10%</strong> deduction from your refund.<br />
                    </div>
                }
                showInput={false}
                onConfirm={handleConfirmCancel}
                onCancel={handleCancel}
                isLoading={isCancelling}
            />
            
            <BookingDetailDialog
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                booking={selectedBooking}
            />
        </>
    );
};

export default BookingTable;
