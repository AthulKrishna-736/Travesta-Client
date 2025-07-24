import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, CheckCircle, BedDouble, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetRoomsByHotel } from '@/hooks/vendor/useRoom';
import { showSuccess } from '@/utils/customToast';

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

    const currentUserId = '1234567890abcdef12345678';

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

    const handleBookingSubmit = (roomId: string) => {
        if (!formData.checkIn || !formData.checkOut || formData.guests < 1) {
            alert('Please fill all fields correctly.');
            return;
        }
        if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
            alert('Check-out date must be after check-in date.');
            return;
        }

        const room = rooms.find((r: any) => r._id === roomId);
        if (!room) return;

        const nights = (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24);
        const totalPrice = room.basePrice * nights;

        const bookingPayload = {
            userId: currentUserId,
            hotelId: hotel._id,
            roomId,
            checkIn: new Date(formData.checkIn),
            checkOut: new Date(formData.checkOut),
            guests: formData.guests,
            totalPrice,
        };

        console.log('Booking payload:', bookingPayload);
        showSuccess('Booking submitted! Check console for payload.');
        return;
        setBookingRoomId(null);
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

                {/* Amenities */}
                {hotel.amenities?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Amenities</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 list-disc ml-4 gap-y-1 text-sm text-muted-foreground">
                            {hotel.amenities.map((item: any, idx: any) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
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
                    <div
                        key={room._id}
                        className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col"
                    >
                        {/* Main Room Image */}
                        {room.images?.[0] && (
                            <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-full h-52 object-cover rounded-lg mb-4"
                            />
                        )}

                        {/* Thumbnails */}
                        {room.images?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto mb-3">
                                {room.images.slice(0, 4).map((img: string, idx: number) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Thumb ${idx}`}
                                        className="w-16 h-16 object-cover rounded-md border shadow-sm"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Room Info */}
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
                            <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                                ₹{room.basePrice}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span>{room.capacity} Guests</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <BedDouble className="w-4 h-4 text-purple-500" />
                                <span>{room.bedType}</span>
                            </div>
                        </div>

                        {/* Amenities */}
                        {room.amenities?.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-medium text-sm text-gray-800 mb-1">Amenities</h4>
                                <div className="flex flex-wrap gap-2">
                                    {room.amenities.map((item: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-accent text-muted-foreground px-2 py-1 rounded-full border"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Booking Section */}
                        {bookingRoomId === room._id ? (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-medium mb-2 text-sm text-gray-800">Book this room</h4>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleBookingSubmit(room._id);
                                }}
                                    className="space-y-3 text-sm"
                                >
                                    <div>
                                        <label className="block mb-1 font-medium" htmlFor="checkIn">Check-In</label>
                                        <input
                                            type="date"
                                            id="checkIn"
                                            name="checkIn"
                                            value={formData.checkIn}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border rounded-md px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium" htmlFor="checkOut">Check-Out</label>
                                        <input
                                            type="date"
                                            id="checkOut"
                                            name="checkOut"
                                            value={formData.checkOut}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border rounded-md px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium" htmlFor="guests">Guests</label>
                                        <input
                                            type="number"
                                            id="guests"
                                            name="guests"
                                            min={1}
                                            max={room.capacity}
                                            value={formData.guests}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border rounded-md px-3 py-2"
                                        />
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                            Confirm Booking
                                        </button>
                                        <button type="button" onClick={() => setBookingRoomId(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleBookClick(room._id)}
                                className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Book this room
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default HotelDetail;
