import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetRoomsByHotel } from '@/hooks/vendor/useRoom';
import { showError } from '@/utils/customToast';
import { useCreateBooking } from '@/hooks/user/useBooking';
import RoomCardLayout from '../room/RoomCard';

interface BookingFormData {
    checkIn: string;
    checkOut: string;
    guests: number;
}

const HotelDetail: React.FC = () => {
    const { hotelId } = useParams();
    const { data: hotelResponse, isLoading: hotelLoading, isError: hotelError } = useGetRoomsByHotel(hotelId || '');
    const hotel = hotelResponse?.data?.[0]?.hotelId;

    const rooms = hotelResponse?.data || [];

    const [bookingRoomId, setBookingRoomId] = useState<string | null>(null);
    const [formData, setFormData] = useState<BookingFormData>({
        checkIn: '',
        checkOut: '',
        guests: 1,
    });

    const { mutate: createBookingMutate } = useCreateBooking();

    if (hotelLoading)
        return (
            <div className="mt-16 mx-auto max-w-xl px-6 py-10 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl text-center shadow-sm animate-pulse">
                <h2 className="text-xl font-semibold mb-2">Loading Hotel Details...</h2>
                <p className="text-base">Please wait while we fetch the hotel information.</p>
            </div>
        );
    if (hotelError || !hotel)
        return (
            <div className="mt-16 mx-auto max-w-xl px-6 py-10 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Hotel Not Found</h2>
                <p className="text-base">
                    We couldn’t find the hotel you're looking for. Please try again later or check the URL.
                </p>
            </div>
        );

    const handleBookClick = (roomId: string) => {
        setBookingRoomId(roomId);
        setFormData({ checkIn: '', checkOut: '', guests: 1 });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'guests' ? parseInt(value) : value,
        }));
    };

    const handleBookingSubmit = async (roomId: string) => {
        if (!formData.checkIn || !formData.checkOut || formData.guests < 1) {
            showError('Please fill all fields correctly.');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);

        if (checkInDate < today || checkOutDate < today) {
            showError('Check-in and Check-out dates cannot be in the past.');
            return;
        }

        const diffInTime = checkOutDate.getTime() - checkInDate.getTime();
        const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

        if (diffInDays < 1) {
            showError('Check-out date must be at least one day after check-in.');
            return;
        }

        const room = rooms.find((r: any) => r._id === roomId);
        if (!room) {
            showError('Room not found.');
            return;
        }

        const totalPrice = room.basePrice * diffInDays;

        const bookingPayload = {
            hotelId: hotel._id,
            roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: formData.guests,
            totalPrice,
        };

        createBookingMutate(bookingPayload, {
            onSuccess: () => {
                setBookingRoomId(null);
            }
        });
    };

    return (
        <main className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Hotel Main Image and Thumbnails */}
            <div>
                <div className="h-80 w-full overflow-hidden rounded-lg shadow-md mb-2">
                    {hotel.images && hotel.images.length > 0 ? (
                        <img src={hotel.images[0]} alt={hotel.name} className="object-cover w-full h-full" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600 text-sm">
                            No Image Available
                        </div>
                    )}
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {hotel.images?.slice(0, 4).map((img: string, idx: number) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Hotel Preview ${idx}`}
                            className="w-20 h-20 object-cover rounded border shadow-sm"
                        />
                    ))}
                </div>
            </div>

            {/* Hotel Details */}
            <div className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h1 className="text-3xl font-bold text-primary">{hotel.name}</h1>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        <Star className="w-5 h-5 fill-yellow-500" />
                        <span className="font-medium">{hotel.rating?.toFixed(1)}</span>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.city}, {hotel.state} – {hotel.address}</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-base leading-relaxed">{hotel.description}</p>

                {/* Tags */}
                {hotel.tags?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                            {hotel.tags.map((tag: any, idx: any) => (
                                <Badge key={idx} variant="outline" className="rounded-full px-3 py-1 text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services */}
                {hotel.services?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Services</h2>
                        <div className="flex flex-wrap gap-2">
                            {hotel.services.map((service: any, idx: any) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-1 text-muted-foreground text-sm bg-accent px-3 py-1 rounded-md"
                                >
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    {service}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room: any) => (
                    <RoomCardLayout
                        key={room._id}
                        room={room}
                        bookingRoomId={bookingRoomId}
                        setBookingRoomId={setBookingRoomId}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleBookingSubmit={handleBookingSubmit}
                        handleBookClick={handleBookClick}
                    />
                ))}
            </div>

        </main>
    );
};

export default HotelDetail;
