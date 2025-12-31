import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../ui/dialog";
import { Button } from "../ui/button";
import { BookingDetailProps } from "@/types/booking.types";
import { Calendar, Users, MapPin, CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react';
import StaticMap from "../maps/StaticMap";


const BookingDetailDialog: React.FC<BookingDetailProps> = ({ open, onClose, booking, }) => {
    if (!booking) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-white h-[90%] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900">
                        Booking Details
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Your reservation details and information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="text-sm font-medium capitalize">{booking.status}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500">Booking ID</div>
                            <div className="text-xs font-mono text-gray-700">{booking.bookingId ? booking.bookingId : booking.id.slice(-8)}</div>
                        </div>
                    </div>

                    {/* Property Info */}
                    <div className="bg-gray-100 rounded-xl p-4 space-y-3">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Property</div>
                            <div className="text-lg font-semibold text-gray-900">
                                {typeof booking.hotel === "object" ? booking.hotel.name : booking.hotelId}
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-600">
                                {typeof booking.hotel === "object" && `${booking.hotel.city}, ${booking.hotel.state}`}
                            </div>
                        </div>

                        <div className="w-full h-70">
                            {booking.hotel && booking.hotel.images && booking.hotel.images.length > 0 && (
                                <img className="w-full h-full object-cover rounded-sm" src={booking.hotel.images[0]} alt="HotelImage" />
                            )}
                        </div>
                    </div>


                    <div className="bg-green-50 rounded-xl p-4 space-y-3">
                        {booking.hotel && booking.hotel.geoLocation && booking.hotel.geoLocation.coordinates.length > 0 && (
                            <StaticMap
                                long={booking.hotel.geoLocation.coordinates[0]}
                                lat={booking.hotel.geoLocation.coordinates[1]}
                                zoom={17}
                                height={720}
                                width={1280}
                                format="png"
                            />
                        )}
                    </div>

                    {/* Room Details */}
                    <div className="space-y-3">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Room Details</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-xs text-gray-500">Room Type</div>
                                <div className="text-sm font-medium text-gray-900">
                                    {typeof booking.room === "object" ? booking.room.name : booking.roomId}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-gray-500">Base Price</div>
                                <div className="text-sm font-medium text-gray-900">
                                    {typeof booking.room === "object" ? `₹${booking.room.basePrice}` : "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stay Information */}
                    <div className="space-y-3">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Stay Information</div>
                        <div className="grid gap-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-blue-600 mb-0.5">Check-in</div>
                                    <div className="text-sm font-medium text-gray-900 truncate">{booking.checkIn}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-purple-600 mb-0.5">Check-out</div>
                                    <div className="text-sm font-medium text-gray-900 truncate">{booking.checkOut}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Users className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500 mb-0.5">Guests</div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">Payment Status</span>
                            </div>
                            <span className={`text-sm font-medium capitalize ${booking.payment === 'success' ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                {booking.payment ?? "N/A"}
                            </span>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                            <div className="flex items-baseline justify-between">
                                <div className="text-lg text-green-700 font-medium">Total Amount</div>
                                <div className="text-2xl font-bold text-green-700">₹{booking.totalPrice}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={onClose}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg transition-colors"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BookingDetailDialog;
