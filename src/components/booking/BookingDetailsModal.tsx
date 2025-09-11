import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../ui/dialog";
import { Button } from "../ui/button";
import { BookingDetailProps } from "@/types/booking.types";


const BookingDetailDialog: React.FC<BookingDetailProps> = ({ open, onClose, booking, }) => {
    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl px-6 py-5">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Booking Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Review all details of your booking below.
                    </DialogDescription>
                </DialogHeader>

                <div className="pt-4 space-y-4 text-sm text-gray-800">
                    <h3 className="text-base font-medium text-gray-700 border-b pb-1">
                        Reservation Summary
                    </h3>

                    <div className="space-y-2">
                        <p>
                            <strong className="text-gray-600">Hotel:</strong>{" "}
                            <span className="font-medium">
                                {typeof booking.hotelId === "object" ? booking.hotelId.name : booking.hotelId}
                            </span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Room:</strong>{" "}
                            <span className="font-medium">
                                {typeof booking.roomId === "object" ? booking.roomId.name : booking.roomId}
                            </span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Room price:</strong>{" "}
                            <span className="font-medium">
                                {typeof booking.roomId === "object" ? `₹${booking.roomId.basePrice}` : "N/A"}
                            </span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Guests:</strong>{" "}
                            {booking.guests}
                        </p>
                        <p>
                            <strong className="text-gray-600">Check-in:</strong>{" "}
                            {booking.checkIn}
                        </p>
                        <p>
                            <strong className="text-gray-600">Check-out:</strong>{" "}
                            {booking.checkOut}
                        </p>
                        <p>
                            <strong className="text-gray-600">Status:</strong>{" "}
                            <span
                                className={`font-semibold ${booking.status === "confirmed"
                                    ? "text-green-600"
                                    : booking.status === "cancelled"
                                        ? "text-red-500"
                                        : "text-yellow-500"
                                    }`}
                            >
                                {booking.status}
                            </span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Payment Status:</strong>{" "}
                            <span className="capitalize">
                                {booking.payment ?? "N/A"}
                            </span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Booking ID:</strong>{" "}
                            <span className="text-gray-500 text-xs">{booking._id}</span>
                        </p>
                    </div>

                    <div className="border-t pt-3">
                        <p className="text-lg font-bold text-green-600">
                            Total Price: ₹{booking.totalPrice}
                        </p>
                    </div>
                </div>

                <DialogFooter className="pt-5">
                    <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BookingDetailDialog;
