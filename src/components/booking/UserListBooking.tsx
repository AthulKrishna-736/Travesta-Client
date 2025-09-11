import React, { useState } from "react";
import DataTable from "../common/Table";
import ConfirmationModal from "../common/ConfirmationModa";
import { Booking, BookingTableProps } from "@/types/booking.types";
import { useCancelBooking } from "@/hooks/user/useBooking";
import BookingDetailDialog from "./BookingDetailsModal";
import { FileText, Info, XCircle } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import fileDownload from "js-file-download";
import InvoiceDoc from "../common/InvoiceDoc";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


const BookingTable: React.FC<BookingTableProps> = ({ bookings, loading }) => {
    const user = useSelector((state: RootState) => state.user.user);
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
        { key: "checkIn", label: "Check-In" },
        { key: "checkOut", label: "Check-Out" },
        { key: "guests", label: "Guests" },
        { key: "totalPrice", label: "Total Price" },
        { key: "status", label: "Status" }
    ];


    const actions = [
        {
            label: "Details",
            variant: "ghost" as const,
            icon: Info,
            showLabel: false,
            tooltip: 'Show Details',
            className: 'text-black',
            onClick: (booking: Booking) => {
                setSelectedBooking(booking);
                setIsDetailsModalOpen(true);
            },
        },
        {
            label: "Cancel",
            variant: "ghost" as const,
            showLabel: false,
            tooltip: 'Cancel booking',
            icon: XCircle,
            className: 'text-red-500',
            onClick: (booking: Booking) => {
                setSelectedBooking(booking);
                setIsCancelModalOpen(true);
            },
        },
        {
            label: "Invoice",
            variant: "ghost" as const,
            tooltip: 'Download invoice',
            className: 'text-blue-500',
            icon: FileText,
            onClick: async (booking: Booking) => {
                const blob = await pdf(<InvoiceDoc booking={booking} user={user} />).toBlob();
                fileDownload(blob, `invoice_${booking._id}.pdf`);
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
                    <div className="mt-4 space-y-2">
                        <div className="rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-800 border border-yellow-300">
                            <strong>Note:</strong> Cancelling this booking will result in a <strong>10%</strong> deduction from your refund.
                        </div>
                        <div className="rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-800 border border-yellow-300">
                            <strong>Policy:</strong> Bookings can only be cancelled within <strong>3 hours</strong> of making the reservation. After that, cancellations are no longer allowed.
                        </div>
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
