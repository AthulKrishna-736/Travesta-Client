import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface HotelData {
    _id: string;
    name: string;
    images: string[];
    city: string;
    state: string;
    room: {
        _id: string;
        name: string;
        basePrice: number;
        bedType: string;
        guest: number;
        roomType: string;
        availableRooms: number;
    };
}

interface TrendingHotelsProps {
    hotel: HotelData;
}

const TrendingHotels: React.FC<TrendingHotelsProps> = ({ hotel }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const checkIn = today.toISOString().split('T')[0];
        const checkOut = tomorrow.toISOString().split('T')[0];

        const queryParams = new URLSearchParams({
            location: hotel.city,
            checkIn: checkIn,
            checkOut: checkOut,
            rooms: '1',
            adults: '1',
            children: '0',
        });

        navigate(`/hotel/${hotel._id}?${queryParams.toString()}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer p-4 flex gap-4"
        >
            {/* Image Section */}
            <div className="w-64 h-48 flex-shrink-0">
                <img
                    src={hotel.images[0] || '/placeholder.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>

            {/* Hotel Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {hotel.name}
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.city}, {hotel.state}</span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-700">
                        <p><span className="font-semibold">Room:</span> {hotel.room.name}</p>
                        <p><span className="font-semibold">Bed Type:</span> {hotel.room.bedType}</p>
                        <p><span className="font-semibold">Guests:</span> Up to {hotel.room.guest}</p>
                        <p><span className="font-semibold">Available:</span> {hotel.room.availableRooms} rooms</p>
                    </div>
                </div>

                {/* Price Section */}
                <div className="flex items-end justify-between mt-4">
                    <div className="text-sm text-gray-500">
                        Price per night
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            ₹{hotel.room.basePrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                            + taxes & fees
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendingHotels;