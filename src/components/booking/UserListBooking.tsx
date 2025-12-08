import React, { useState } from "react";
import DataTable from "../common/Table";
import ConfirmationModal from "../common/ConfirmationModa";
import { IBooking, BookingTableProps } from "@/types/booking.types";
import { useCancelBooking } from "@/hooks/user/useBooking";
import BookingDetailDialog from "./BookingDetailsModal";
import { FileText, Info, Star, XCircle } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import fileDownload from "js-file-download";
import InvoiceDoc from "../common/InvoiceDoc";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import RatingModal, { TRatingFormData } from "../hotel/RatingModal";
import { useCreateRating } from "@/hooks/vendor/useRating";
import { showError } from "@/utils/customToast";

const BookingTable: React.FC<BookingTableProps> = ({ bookings, loading }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    const { mutate: cancelBookingMutate, isPending: isCancelling } = useCancelBooking();
    const { mutate: createRatingMutate } = useCreateRating(() => { setIsRatingModalOpen(false); });

    const handleRatingSubmit = (data: TRatingFormData) => {
        const hotelId = selectedBooking?.hotelId;
        if (!hotelId) {
            showError("Hotel ID missing");
            return;

        }
        createRatingMutate({ ...data, hotelId });
    };

    const handleCancel = () => {
        setIsCancelModalOpen(false);
        setSelectedBooking(null);
    };

    const handleConfirmCancel = () => {
        if (selectedBooking) {
            cancelBookingMutate(selectedBooking.id, {
                onSettled: () => {
                    handleCancel();
                }
            });
        }
    };

    const flattenedBookings = bookings.map((booking) => ({
        ...booking,
        roomName: typeof booking.room === "object" ? booking.room.name : booking.roomId,
        basePrice: typeof booking.room === "object" ? booking.room.basePrice : undefined,
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
            onClick: (booking: IBooking) => {
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
            onClick: (booking: IBooking) => {
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
            onClick: async (booking: IBooking) => {
                const blob = await pdf(<InvoiceDoc booking={booking} user={user!} />).toBlob();
                fileDownload(blob, `Invoice_${booking.bookingId ? booking.bookingId : booking.id.slice(-8)}.pdf`);
            },
        },
        {
            label: "Review",
            variant: "ghost" as const,
            showLabel: false,
            tooltip: "Rate hotel",
            icon: Star,
            className: "text-yellow-600",
            onClick: (booking: IBooking) => {
                setSelectedBooking(booking);
                setIsRatingModalOpen(true);
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
                            <strong>Note:</strong> Refunds depend on how close your cancellation is to the check-in time.
                        </div>
                        <div className="rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-800 border border-yellow-300">
                            <strong>Cancellation Policy:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li><strong>48+ hours before check-in:</strong> Full refund (0% charge)</li>
                                <li><strong>24–48 hours:</strong> 5% charge (95% refund)</li>
                                <li><strong>5–24 hours:</strong> 15% charge (85% refund)</li>
                                <li><strong>3–5 hours:</strong> 30% charge (70% refund)</li>
                                <li><strong>1–3 hours:</strong> 50% charge (50% refund)</li>
                                <li><strong>Less than 1 hour:</strong> 75% charge (25% refund)</li>
                            </ul>
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

            <RatingModal
                open={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                onSubmit={handleRatingSubmit}
            />
        </>
    );
};

export default BookingTable;
