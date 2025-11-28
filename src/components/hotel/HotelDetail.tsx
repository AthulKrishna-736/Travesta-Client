import React, { useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import RoomCard from '../room/RoomCard';
import Breadcrumbs from '../common/BreadCrumps';
import HotelWithRoom from './HotelWithRoom';
import MyOlaMap from '../maps/OlaMap';
import RatingDetails from './RatingDetails';
import NearbyAttractions from '../common/NearbyAttractions';
import WeatherDetails from '../common/WeatherDetails';
import PropertyRules from './PropertyRules';
import { showError } from '@/utils/customToast';
import { Lock, MapIcon } from 'lucide-react';
import { useGetUserActivePlan } from '@/hooks/admin/useSubscription';
import { useGetHotelRatings } from '@/hooks/vendor/useRating';
import { useGetHotelDetailsWithRoom } from '@/hooks/vendor/useHotel';
import { IRoom } from '@/types/room.types';


const HotelDetail: React.FC = () => {
    const { hotelId, roomId } = useParams();
    const [params] = useSearchParams();
    const mapRef = useRef<HTMLDivElement | null>(null);
    const reviewRef = useRef<HTMLDivElement | null>(null);
    const roomsRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const location = params.get('location');
    const checkInParam = params.get('checkIn') || '';
    const checkOutParam = params.get('checkOut') || '';
    const rooms = Number(params.get('rooms'));
    const adults = Number(params.get('adults')) || 1;
    const children = Number(params.get('children')) || 0;

    const { data: apiResponse, isLoading: hotelLoading, isError: hotelError } = useGetHotelDetailsWithRoom(hotelId!, roomId!, checkInParam, checkOutParam, rooms, adults, children);
    const { data: ratingResponse } = useGetHotelRatings(hotelId!);

    const hotel = apiResponse?.data.hotel;
    const room = apiResponse?.data.room;
    const otherRooms = apiResponse?.data.otherRooms;
    const ratings = ratingResponse?.data;

    const { data: planResponse } = useGetUserActivePlan();
    const planHistory = planResponse ? planResponse?.data : null;

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

    const BREADCRUMPS_ITEMS = [
        { label: 'Home', path: '/user/home' },
        { label: 'Hotels', path: '/user/hotels' },
        { label: `${location}` },
        { label: `${hotel.name}`, path: `/user/hotels/${hotelId}` }
    ]

    const handleBookingSubmit = async (room: IRoom) => {
        const checkInDate = new Date(checkInParam);
        const checkOutDate = new Date(checkOutParam);

        const checkInTime = hotel?.propertyRules?.checkInTime || "13:00";
        const checkOutTime = hotel?.propertyRules?.checkOutTime || "12:00";

        const [checkInHours, checkInMinutes] = checkInTime.split(":").map(Number);
        const [checkOutHours, checkOutMinutes] = checkOutTime.split(":").map(Number);

        checkInDate.setHours(checkInHours, checkInMinutes, 0, 0);
        checkOutDate.setHours(checkOutHours, checkOutMinutes, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkInDateOnly = new Date(checkInDate);
        checkInDateOnly.setHours(0, 0, 0, 0);

        if (checkInDateOnly < today) {
            showError('Check-in date cannot be in the past.');
            return;
        }

        // Validate check-out after check-in
        if (checkOutDate <= checkInDate) {
            showError('Check-out must be after check-in.');
            return;
        }

        // Calculate days difference
        const diffInTime = checkOutDate.getTime() - checkInDate.getTime();
        const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

        const days = Math.ceil(diffInDays);

        const totalPrice = room.basePrice * days;

        const queryParams = new URLSearchParams({
            hotelId: hotelId!,
            vendorId: hotel.vendorId!,
            roomId: room.id,
            rooms: rooms.toString(),
            adults: adults.toString(),
            children: children.toString(),
            checkIn: checkInDate.toISOString(),
            checkOut: checkOutDate.toISOString(),
            totalPrice: totalPrice.toString(),
            days: days.toString(),
        });
        navigate(`/user/checkout?${queryParams.toString()}`);
    };

    return (
        <main className="p-6 max-w-6xl mx-auto space-y-4">
            {/* BreadCrumps */}
            <Breadcrumbs items={BREADCRUMPS_ITEMS} />

            {/* Hotel with room Details */}
            <HotelWithRoom
                hotel={hotel}
                room={room!}
                mapRef={mapRef}
                roomsRef={roomsRef}
                reviewRef={reviewRef}
                ratings={ratings!}
                roomSubmit={handleBookingSubmit}
            />

            {/* Other related rooms */}
            <div ref={roomsRef} className="space-y-6 bg-white p-6 rounded-md shadow-xs border border-gray-200">
                {otherRooms && otherRooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        handleBookClick={handleBookingSubmit}
                    />
                ))}
            </div>

            <div className="space-y-6 bg-white p-6 rounded-md shadow-xs border border-gray-200">
                <PropertyRules propertyRules={hotel.propertyRules} />
            </div>

            {/* Weather Details */}
            <div className="space-y-6 bg-white p-6 rounded-md shadow-xs border border-gray-200">
                {planHistory && planHistory.isActive ? (
                    <WeatherDetails
                        latitude={hotel.geoLocation.coordinates[1]}
                        longitude={hotel.geoLocation.coordinates[0]}
                        checkIn={checkInParam}
                        checkOut={checkOutParam}
                    />
                ) : (
                    <div className="text-center text-gray-500 flex flex-col items-center justify-center py-10">
                        <Lock className="mb-2 w-8 h-8 text-gray-400" />
                        <p className="text-lg mb-4">Unlock this feature to access weather details</p>
                        <button
                            onClick={() => navigate('/user/subscription')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Go to Subscription
                        </button>
                    </div>
                )}
            </div>

            {/* Map Section */}
            <div ref={mapRef} className="space-y-6 bg-white p-6 rounded-md shadow-xs border border-gray-200">
                <div className='flex justify-between '>
                    <h1 className='text-xl font-semibold mb-2'>Location</h1>
                    <button className='px-4 py-1.5 bg-gradient-to-r from-[#53b2fe] to-[#065af3] text-white font-semibold text-lg rounded-md shadow-md cursor-pointer' onClick={() => {
                        window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${hotel.geoLocation.coordinates[1]},${hotel.geoLocation.coordinates[0]}`,
                            "_blank",
                            "noopener,noreferrer"
                        );
                    }}>
                        <span className='flex justify-center items-center gap-2'>
                            <MapIcon className='text-white w-5 h-5 ' />
                            Get Direction
                        </span>
                    </button>
                </div>
                <div>
                    <MyOlaMap
                        lat={hotel.geoLocation.coordinates[1]}
                        long={hotel.geoLocation.coordinates[0]}
                    />
                </div>
            </div>

            <div className="space-y-6 bg-white p-4 rounded-md shadow-xs border border-gray-200">
                {planHistory && planHistory.isActive && planHistory.subscriptionId.type === 'vip' ? (
                    <NearbyAttractions
                        lat={hotel.geoLocation.coordinates[1]}
                        long={hotel.geoLocation.coordinates[0]}
                    />
                ) : (
                    <div className="text-center text-gray-500 flex flex-col items-center justify-center py-10">
                        <Lock className="mb-2 w-8 h-8 text-gray-400" />
                        <p className="text-lg mb-4">Unlock this feature to access Nearby Attractions</p>
                        <button
                            onClick={() => navigate('/user/subscription')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Go to Subscription
                        </button>
                    </div>
                )}
            </div>

            {/* Reviews section */}
            <div ref={reviewRef} className="space-y-6 bg-white p-6 rounded-md shadow-xs border border-gray-200">
                {ratings && ratings.length > 0 ? (
                    <RatingDetails ratings={ratings} />
                ) : (
                    <div className='text-lg font-semibold'>
                        No Ratings Found.
                    </div>
                )}
            </div>

        </main>
    );
};

export default HotelDetail;
