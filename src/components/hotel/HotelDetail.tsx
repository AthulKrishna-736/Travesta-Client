import React, { useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import RoomCard from '../room/RoomCard';
import Breadcrumbs from '../common/BreadCrumps';
import HotelWithRoom from './HotelWithRoom';
import NearbyAttractions from '../common/NearbyAttractions';
import WeatherDetails from '../common/WeatherDetails';
import PropertyRules from './PropertyRules';
import { showError } from '@/utils/customToast';
import { ArrowUpRight } from 'lucide-react';
import { useGetUserActivePlan } from '@/hooks/admin/useSubscription';
import { useGetHotelRatings } from '@/hooks/vendor/useRating';
import { useGetHotelDetailsWithRoom } from '@/hooks/vendor/useHotel';
import { IRoom } from '@/types/room.types';
import CustomSearch from '../common/CustomSearch';
import StaticMap from '../maps/StaticMap';
import GuestReviewImages from '../reviews/GuestReviewImages';
import ReviewList from '../reviews/ReviewList';
import SubscriptionLock from '../subscription/SubscriptionLock';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


const HotelDetail: React.FC = () => {
    const { hotelSlug, roomSlug } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const location = params.get('location');
    const checkInParam = params.get('checkIn') || '';
    const checkOutParam = params.get('checkOut') || '';
    const rooms = Number(params.get('rooms'));
    const adults = Number(params.get('adults')) || 1;
    const children = Number(params.get('children')) || 0;

    const mapRef = useRef<HTMLDivElement | null>(null);
    const reviewRef = useRef<HTMLDivElement | null>(null);
    const roomsRef = useRef<HTMLDivElement | null>(null);
    const [page, setPage] = useState(1);
    const [geoSearch, setGeoSearch] = useState<string>(location!);
    const [lat, setLat] = useState<number | null>(null);
    const [long, setLong] = useState<number | null>(null);
    const [checkIn, setCheckIn] = useState(checkInParam);
    const [checkOut, setCheckOut] = useState(checkOutParam);
    const [roomsCount, setRoomCount] = useState(rooms);
    const [guests, setGuests] = useState(adults + children);

    const isAuthenticated = Boolean(useSelector((state: RootState) => state.user.user?.id));
    const RATING_LIMT = 5;

    const { data: apiResponse, isLoading: hotelLoading, isError: hotelError, error } = useGetHotelDetailsWithRoom(hotelSlug!, roomSlug!, checkIn, checkOut, roomsCount, guests, children);
    const { data: ratingResponse } = useGetHotelRatings(hotelSlug!, page, RATING_LIMT);

    const hotel = apiResponse?.data.hotel;
    const room = apiResponse?.data.room as IRoom & { discountedPrice: number, appliedOffer: any };

    const otherRooms = apiResponse?.data.otherRooms as (IRoom & { discountedPrice: number, appliedOffer: any })[];
    const ratings = ratingResponse?.data;
    const meta = ratingResponse?.meta;

    const ratingImages = hotel?.ratings?.flatMap(r => (r && Array.isArray(r.images) ? r.images : [])) || [];

    const { data: planResponse } = useGetUserActivePlan(isAuthenticated);
    const planHistory = planResponse ? planResponse?.data : null;

    if (hotelLoading)
        return (
            <div className="mt-16 mx-auto max-w-xl px-6 py-10 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl text-center shadow-sm animate-pulse">
                <h2 className="text-xl font-semibold mb-2">Loading Hotel Details...</h2>
                <p className="text-base">Please wait while we fetch the hotel information.</p>
            </div>
        );

    if (hotelError || !hotel) {
        const err = error?.message
        return (
            <div className="mt-16 mx-auto max-w-xl px-6 py-10 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Hotel Not Found</h2>
                <p className="text-base">We couldn’t fetch the hotel details.</p>
                <p className="text-base">{err}</p>
            </div>
        );
    }

    const BREADCRUMPS_ITEMS = [
        { label: 'Home', path: '/user/home' },
        { label: 'Hotels', path: '/user/hotels' },
        { label: `${location}` },
        { label: `${hotel.name}`, path: `/user/hotels/${hotelSlug}` }
    ]

    const handleBookingSubmit = async (room: IRoom & { discountedPrice: number, appliedOffer: any }) => {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

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

        const effectivePrice = room.discountedPrice ?? room.basePrice;
        const totalPrice = effectivePrice * days;

        const queryParams = new URLSearchParams({
            rooms: roomsCount.toString(),
            adults: guests.toString(),
            children: children.toString(),
            checkIn: checkIn,
            checkOut: checkOut,
            totalPrice: totalPrice.toString(),
            days: days.toString(),
        });
        navigate(`/user/checkout/${hotel.slug}/${room.slug}?${queryParams.toString()}`);
    };

    const handleSearch = () => {
        console.log('Searching with:', { geoSearch, lat, long, checkIn, checkOut, roomsCount, guests });
    };

    return (
        <main className="p-6 max-w-6xl mx-auto space-y-4">
            {/* Custom search */}
            <CustomSearch
                searchTerm={geoSearch}
                setSearchTerm={setGeoSearch}
                setLat={setLat}
                setLong={setLong}
                checkIn={checkIn}
                setCheckIn={setCheckIn}
                checkOut={checkOut}
                setCheckOut={setCheckOut}
                roomCount={roomsCount}
                setRoomCount={setRoomCount}
                guests={guests}
                setGuests={setGuests}
                onSearch={handleSearch}
                disabled={true}
            />

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

            {/* Property rules */}
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
                    <SubscriptionLock title={`Unlock this feature to access weather details`} />
                )}
            </div>

            {/* Map Section */}
            <div ref={mapRef} className="space-y-6 bg-white p-6 rounded-md shadow-xs border border-gray-200">
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-semibold mb-2'>Location</h1>
                    <button
                        className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline cursor-pointer"
                        title="Get Directions"
                        onClick={() => {
                            window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${hotel.geoLocation.coordinates[1]},${hotel.geoLocation.coordinates[0]}`,
                                "_blank",
                                "noopener,noreferrer"
                            );
                        }}>
                        <span className='flex justify-center items-center gap-1'>
                            <span>Get Direction</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </span>
                    </button>
                </div>

                <div>
                    <StaticMap
                        lat={hotel.geoLocation.coordinates[1]}
                        long={hotel.geoLocation.coordinates[0]}
                        zoom={15}
                        width={1280}
                        height={700}
                        format="png"
                    />
                </div>
            </div>

            {/* Nearby attractions */}
            <div className="space-y-6 bg-white p-4 rounded-md shadow-xs border border-gray-200">
                {planHistory && planHistory.isActive && planHistory.subscriptionId.type === 'vip' ? (
                    <NearbyAttractions
                        lat={hotel.geoLocation.coordinates[1]}
                        long={hotel.geoLocation.coordinates[0]}
                    />
                ) : (
                    <SubscriptionLock title={`Unlock this feature to access Nearby Attractions`} />
                )}
            </div>

            {/* Guest Photos */}
            <div className="space-y-6 bg-white p-4 rounded-md shadow-xs border border-gray-200">
                <h1 className='text-xl font-semibold mb-2'>Guest Photos <span className='text-sm'>(Recent)</span></h1>
                <GuestReviewImages images={ratingImages} />
            </div>

            {/* Reviews section */}
            <div ref={reviewRef} className="space-y-6 bg-white p-6 rounded-md shadow-xs border border-gray-200">
                <ReviewList ratings={ratings} currentPage={page} totalPages={meta?.totalPages} setPage={setPage} />
            </div>
        </main>
    );
};

export default HotelDetail;
