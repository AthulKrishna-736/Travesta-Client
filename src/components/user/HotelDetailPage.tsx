import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, CheckCircle, BedDouble, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetRoomsByHotel } from '@/hooks/vendor/useRoom';
import { useGetUserHotel } from '@/hooks/vendor/useHotel';

interface BookingFormData {
    checkIn: string;
    checkOut: string;
    guests: number;
}

const HotelDetail: React.FC = () => {
    const { hotelId } = useParams();
    const { data: hotelResponse, isLoading: hotelLoading, isError: hotelError } = useGetUserHotel(hotelId || '');
    const hotel = hotelResponse?.data;

    const { data: roomsResponse, isLoading: roomsLoading, isError: roomsError } = useGetRoomsByHotel(hotelId || '');
    const rooms = roomsResponse?.data || [];

    // Track which room is currently booking
    const [bookingRoomId, setBookingRoomId] = useState<string | null>(null);
    // Booking form state
    const [formData, setFormData] = useState<BookingFormData>({
        checkIn: '',
        checkOut: '',
        guests: 1,
    });

    if (hotelLoading) return <p className="text-center mt-10">Loading hotel details...</p>;
    if (hotelError || !hotel) return <p className="text-center mt-10 text-red-600">Hotel not found.</p>;

    // Mock current user ID (replace with auth user ID in real app)
    const currentUserId = '1234567890abcdef12345678';

    const handleBookClick = (roomId: string) => {
        setBookingRoomId(roomId);
        setFormData({
            checkIn: '',
            checkOut: '',
            guests: 1,
        });
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

        // Calculate total price = basePrice * number of nights
        const room = rooms.find((r: any) => r._id === roomId);
        if (!room) return;

        const nights = (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24);
        const totalPrice = room.basePrice * nights;

        // Build booking data to send to backend
        const bookingPayload = {
            userId: currentUserId,
            hotelId: hotel.id,
            roomId: roomId,
            checkIn: new Date(formData.checkIn),
            checkOut: new Date(formData.checkOut),
            guests: formData.guests,
            totalPrice,
        };

        console.log('Booking payload:', bookingPayload);
        // TODO: Call your booking API with bookingPayload here

        alert('Booking submitted! Check console for payload.');
        setBookingRoomId(null);
    };

    return (
        <>
            <main className="p-6 max-w-5xl mx-auto space-y-6">
                {/* Hotel Images and Info */}
                <div className="h-80 w-full overflow-hidden rounded-lg shadow-md">
                    {hotel.images && hotel.images.length > 0 ? (
                        <img src={hotel.images[0]} alt={hotel.name} className="object-cover w-full h-full" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600 text-sm">
                            No Image Available
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">{hotel.name}</h1>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            <Star className="w-5 h-5 fill-yellow-500" />
                            {hotel.rating?.toFixed(1)}
                        </div>
                    </div>

                    <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {hotel.city}, {hotel.state} - {hotel.address}
                    </p>

                    <p className="text-gray-700 text-base">{hotel.description}</p>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                            {hotel.tags?.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="rounded-full px-3 py-1 text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">Amenities</h2>
                        <ul className="list-disc ml-6 text-muted-foreground">
                            {hotel.amenities?.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">Services</h2>
                        <div className="flex flex-wrap gap-2">
                            {hotel.services?.map((service: string, idx: number) => (
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
                </div>

                {/* Rooms Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-6">Rooms</h2>
                    {roomsLoading && <p>Loading rooms...</p>}
                    {roomsError && <p className="text-red-600">Failed to load rooms.</p>}
                    {!roomsLoading && rooms.length === 0 && <p>No rooms found for this hotel.</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rooms.map((room: any) => (
                            <div
                                key={room._id}
                                className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
                            >
                                {room.images && room.images.length > 0 && (
                                    <img
                                        src={room.images[0]}
                                        alt={room.name}
                                        className="rounded-md w-full h-48 object-cover mb-4"
                                    />
                                )}
                                <h3 className="text-2xl font-semibold mb-2">{room.name}</h3>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <span>Capacity: {room.capacity}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <BedDouble className="w-5 h-5 text-purple-500" />
                                        <span>Bed Type: {room.bedType}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                        <span>Price: ${room.basePrice}</span>
                                    </div>
                                </div>

                                {room.amenities && room.amenities.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-1">Amenities:</h4>
                                        <ul className="list-disc list-inside text-gray-600 text-sm">
                                            {room.amenities.map((amenity: string, idx: number) => (
                                                <li key={idx}>{amenity}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Book button and form */}
                                {bookingRoomId === room._id ? (
                                    <div className="mt-4 border-t pt-4">
                                        <h4 className="font-semibold mb-2">Book this room</h4>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleBookingSubmit(room._id);
                                            }}
                                            className="space-y-3"
                                        >
                                            <div>
                                                <label className="block mb-1 font-medium" htmlFor="checkIn">
                                                    Check-In Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="checkIn"
                                                    name="checkIn"
                                                    value={formData.checkIn}
                                                    onChange={handleInputChange}
                                                    className="border rounded px-3 py-1 w-full"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-1 font-medium" htmlFor="checkOut">
                                                    Check-Out Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="checkOut"
                                                    name="checkOut"
                                                    value={formData.checkOut}
                                                    onChange={handleInputChange}
                                                    className="border rounded px-3 py-1 w-full"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-1 font-medium" htmlFor="guests">
                                                    Guests
                                                </label>
                                                <input
                                                    type="number"
                                                    id="guests"
                                                    name="guests"
                                                    min={1}
                                                    max={room.capacity}
                                                    value={formData.guests}
                                                    onChange={handleInputChange}
                                                    className="border rounded px-3 py-1 w-full"
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            >
                                                Confirm Booking
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBookingRoomId(null)}
                                                className="ml-2 mt-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleBookClick(room._id)}
                                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Book this room
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
};

export default HotelDetail;
