import React, { useState } from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode";
import fileDownload from "js-file-download";
import { pdf } from "@react-pdf/renderer";
import { FileText, Info, Star, XCircle } from "lucide-react";
import DataTable from "../common/Table";
import ConfirmationModal from "../common/ConfirmationModal";
import InvoiceDoc from "../common/InvoiceDoc";
import BookingDetailDialog from "./BookingDetailsModal";
import RatingModal from "../hotel/RatingModal";
import { useCancelBooking } from "@/hooks/user/useBooking";
import { RootState } from "@/store/store";
import { useCreateRating } from "@/hooks/vendor/useRating";
import { IBooking, BookingTableProps, BookingRow } from "@/types/booking.types";
import { showError } from "@/utils/customToast";
import { TRatingForm } from "@/types/rating.types";
import { Column } from "@/types/custom.types";

const BookingTable: React.FC<BookingTableProps> = ({ bookings, loading }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

    const { mutate: cancelBookingMutate, isPending: isCancelling } = useCancelBooking();
    const { mutate: createRatingMutate, isPending: isCreatingRating } = useCreateRating(() => { setIsRatingModalOpen(false); });

    const handleRatingSubmit = (data: TRatingForm & { images: File[], oldImages: string[] }) => {
        const hotelId = selectedBooking?.hotelId;
        const bookingId = selectedBooking?.id;
        if (!hotelId) {
            showError("Cannot review now. Hotel ID missing");
            return;
        }

        if (!bookingId) {
            showError('Cannot review now. Booking ID missing');
            return;
        }

        const formData = new FormData();
        formData.append('hotelId', hotelId);
        formData.append('bookingId', bookingId);
        formData.append('hospitality', data.hospitality.toString());
        formData.append('cleanliness', data.cleanliness.toString());
        formData.append('facilities', data.facilities.toString());
        formData.append('room', data.room.toString());
        formData.append('moneyValue', data.moneyValue.toString());
        formData.append('review', data.review.trim());

        if (data.images && data.images.length > 0) {
            data.images.forEach((f) => {
                formData.append('images', f);
            })
        }

        if (data.oldImages && data.oldImages.length > 0) {
            formData.append('oldImages', JSON.stringify(data.oldImages))
        }

        createRatingMutate(formData);
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

    const columns: Column<BookingRow>[] = [
        { key: "roomName", label: "Room", render: (value) => typeof value === "string" ? (<span className="font-semibold">{value}</span>) : null },
        { key: "checkIn", label: "Check-In", render: (value) => value ? `${value}` : 'N/A' },
        { key: "checkOut", label: "Check-Out", render: (value) => value ? `${value}` : 'N/A' },
        { key: "guests", label: "Guests", render: (value) => typeof value === "number" ? value : null },
        { key: "totalPrice", label: "Total Price", render: (value) => typeof value === "number" ? `₹${value.toFixed(2)}` : null },
        {
            key: "status", label: "Status", render: (value) => typeof value === "string" ? (
                <span className="px-3 py-1 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium">
                    {value}
                </span>
            ) : null,
        },
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
                const qrImageUrl = await generateBookingQR(booking);
                const blob = await pdf(<InvoiceDoc booking={booking} user={user!} qrImageUrl={qrImageUrl} />).toBlob();
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

    const generateBookingQR = async (booking: IBooking) => {
        const payload = {
            bookingId: booking.bookingId,
            hotelName: booking.hotel?.name,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests,
            amount: booking.totalPrice,
        }
        return await QRCode.toDataURL(JSON.stringify(payload));
    }

    return (
        <>
            <div className="rounded-lg border-1 overflow-hidden">
                {flattenedBookings && flattenedBookings.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={flattenedBookings}
                        actions={actions}
                        loading={loading}
                    />
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="font-semibold text-2xl text-blue-400 bg-blue-50 w-full text-center py-5">No Bookings found!</p>
                    </div>
                )}
            </div>

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
                isLoading={isCreatingRating}
            />
        </>
    );
};

export default BookingTable;
