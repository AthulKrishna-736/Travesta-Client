import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { HotelWithRoom } from '../home/TrendingProperties';


interface TrendingHotelsProps {
    hotel: HotelWithRoom;
}

const TrendingHotels: React.FC<TrendingHotelsProps> = ({ hotel }) => {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (hotel.images && hotel.images.length > 0) {
            setPreviewImage(hotel.images[0]);
        }

        return () => setPreviewImage(null);
    }, [hotel.images])

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
            children: '0'
        });

        navigate(`/user/hotels/${hotel._id}/${hotel.room._id}?${queryParams.toString()}`);
    };

    return (
        <div className="bg-white w-full h-full rounded-lg overflow-hidden relative">
            {/* Image */}
            {previewImage && (
                <img
                    src={previewImage || "/placeholder.jpg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                />
            )}

            <div className='bg-white absolute top-2 left-2 text-sm shadow-md px-2 rounded-2xl font-semibold'>
                ₹{hotel.room.basePrice}
            </div>

            <div className='bg-white absolute bottom-2 left-2 p-2 rounded-4xl px-4 flex items-center justify-center gap-1'>
                <MapPin className="w-4 h-4 text-gray-800" />
                <div className='text-sm font-medium'>
                    <span>{hotel.city}, </span>
                    <span>{hotel.state}</span>
                </div>
            </div>

            {/* Overlay Button */}
            <button onClick={handleCardClick} className="absolute cursor-pointer bottom-2 right-2 bg-white rounded-full p-2 shadow-md" aria-label="View hotel">
                <ArrowUpRight className="w-6 h-6 text-gray-800" />
            </button>
        </div>
    );
};

export default TrendingHotels;