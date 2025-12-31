import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { IBooking } from "@/types/booking.types";

interface BookingDetailVendorProps {
    open: boolean;
    onClose: () => void;
    booking: IBooking | null;
}

const BookingDetailModalVendor: React.FC<BookingDetailVendorProps> = ({ open, onClose, booking, }) => {
    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-2xl">
                <DialogHeader className="border-b border-gray-200 pb-4">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Booking Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-1">
                        Complete information about this reservation
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {/* Status Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Booking Status
                                </p>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${booking.status === "confirmed"
                                        ? "bg-green-100 text-green-700"
                                        : booking.status === "cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Payment
                                </p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 capitalize">
                                    {booking.payment ?? "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Hotel & Room Information */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-3">
                            <h3 className="text-base font-semibold text-white">
                                Accommodation Details
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Hotel
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {typeof booking.hotel === "object" ? booking.hotel.name : booking.hotelId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Room Type
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {typeof booking.room === "object" ? booking.room.name : booking.roomId}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Room Price
                                    </p>
                                    <p className="text-lg font-bold text-indigo-600">
                                        {typeof booking.room === "object" ? `₹${booking.room.basePrice}` : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Guests
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stay Duration */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3">
                            <h3 className="text-base font-semibold text-white">Stay Duration</h3>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                                        Check-in
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {booking.checkIn}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                                        Check-out
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {booking.checkOut}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3">
                            <h3 className="text-base font-semibold text-white">
                                Customer Information
                            </h3>
                        </div>
                        <div className="p-5 space-y-3">
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                    Full Name
                                </p>
                                <p className="text-base font-semibold text-gray-900">
                                    {booking.user ? booking.user.firstName : 'N/A'} {booking.user ? booking.user.lastName : 'N/A'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Email Address
                                    </p>
                                    <p className="text-sm text-gray-700 break-all">
                                        {booking.user ? booking.user.email : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Phone Number
                                    </p>
                                    <p className="text-sm text-gray-700">{booking.user ? booking.user.phone : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Total Amount
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                    ₹{booking.totalPrice}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                                <p className="text-xs font-mono text-gray-700 break-all max-w-[200px]">
                                    {booking.bookingId}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t border-gray-200 pt-4">
                    <Button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BookingDetailModalVendor;
