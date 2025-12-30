import React, { RefObject } from 'react'
import { MapPin, Users } from 'lucide-react';
import { IRating } from '@/types/rating.types';
import { RATINGS } from './HotelCard';
import { IRoom } from '@/types/room.types';
import { IHotel } from '@/types/hotel.types';
import CollapsibleText from '../common/CollapseText';

interface IHotelWithRoom {
    hotel: IHotel;
    room: IRoom & { discountedPrice: number, appliedOffer: any };
    mapRef: RefObject<HTMLDivElement | null>;
    reviewRef: RefObject<HTMLDivElement | null>;
    roomsRef: RefObject<HTMLDivElement | null>;
    ratings: IRating[];
    roomSubmit: (room: IRoom & { discountedPrice: number, appliedOffer: any }) => void;
}

const HotelWithRoom: React.FC<IHotelWithRoom> = ({ hotel, room, mapRef, reviewRef, roomsRef, ratings, roomSubmit }) => {

    const totalRatings = ratings?.length || 0;
    const averages = totalRatings > 0
        ? {
            hospitality:
                ratings.reduce((acc, r) => acc + r.hospitality, 0) / totalRatings,
            cleanliness:
                ratings.reduce((acc, r) => acc + r.cleanliness, 0) / totalRatings,
            facilities:
                ratings.reduce((acc, r) => acc + r.facilities, 0) / totalRatings,
            room:
                ratings.reduce((acc, r) => acc + r.room, 0) / totalRatings,
            moneyValue:
                ratings.reduce((acc, r) => acc + r.moneyValue, 0) / totalRatings,
        }
        : {
            hospitality: 0,
            cleanliness: 0,
            facilities: 0,
            room: 0,
            moneyValue: 0,
        };

    const overallAvg = totalRatings > 0
        ? (
            (averages.hospitality +
                averages.cleanliness +
                averages.facilities +
                averages.room +
                averages.moneyValue) /
            5
        ).toFixed(1)
        : "0.0";


    const getRatingLabel = (rating: number): string => {
        const match = RATINGS.find(r => rating >= r.min);
        return match ? match.label : "Unrated";
    };


    return (
        <div className='bg-white p-5 rounded-md shadow-xs'>
            {/* Name */}
            <h1 className='text-xl font-bold'>{hotel.name}</h1>

            <div className='flex flex-col lg:flex-row w-full h-full my-4 gap-4'>
                <div className='space-y-6 w-full'>
                    {/* Images */}
                    <div className='flex flex-col md:flex-row gap-3'>
                        <div className='h-80 w-full md:w-3/4'>
                            {hotel.images.slice(0, 1).map((i, idx) => (
                                <img className='h-full w-full object-cover rounded-lg' key={idx} src={i} alt={`Image:${idx}`} />
                            ))}
                        </div>
                        <div className='flex md:flex-col gap-2 md:gap-0 overflow-hidden justify-around bg-amber-300'>
                            {hotel.images.slice(1, 3).map((i, idx) => (
                                <img className='h-15 sm:h-30 w-full md:h-39 object-cover rounded-lg' key={idx} src={i} alt={`Images:${idx}`} />
                            ))}
                        </div>
                    </div>

                    {/* location */}
                    <div className="flex items-center gap-2 text-muted-foreground text-md">
                        <MapPin className="w-5 h-5" />
                        <span>{hotel.city}, {hotel.state} – {hotel.address}</span>
                    </div>

                    {/* Description */}
                    <div className='space-y-2 w-full'>
                        <h1 className='text-lg font-bold'>
                            About Property
                        </h1>
                        <CollapsibleText text={hotel.description} limit={500}/>
                    </div>

                    {/* Amenities */}
                    <div className='space-y-2'>
                        <h1 className='text-lg font-semibold'>Amenities</h1>
                        <div className='flex gap-2'>
                            {hotel.amenities.map((a) => (
                                <span
                                    className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition"
                                    key={a._id}
                                >
                                    {a.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className='space-y-2 w-full overflow-hidden'>
                        <h1 className='text-lg font-semibold'>Tags</h1>
                        {hotel.tags.map((t, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 text-sm rounded-md mr-2 font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 transition"
                            >
                                #{t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Room details, Ratings & Location */}
                <div className='flex flex-col h-full w-full lg:w-1/2 gap-4'>
                    <div className='p-4 rounded-lg border-[1px] border-[#d8d8d8]'>
                        <div className='flex flex-col-reverse md:flex-row gap-4 mb-4'>
                            <div className='flex-1'>
                                <h1 className='text-lg font-bold mb-2'>{room.name}</h1>
                                <div className='flex items-center gap-2 mb-2'>
                                    <div className='bg-blue-50 p-1.5 rounded-sm'>
                                        <Users className='w-4 h-4 text-blue-600' />
                                    </div>
                                    <span className='text-sm font-medium text-gray-700'>
                                        Up to {room.guest} {room.guest === 1 ? 'Guest' : 'Guests'}
                                    </span>
                                </div>
                                <h3 className='inline-block bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 text-sm font-semibold px-3 py-1.5 rounded-sm border border-purple-200'>
                                    Room Type: {room.roomType}
                                </h3>
                            </div>
                            <div className='w-full h-60 md:h-40 md:w-60 lg:h-32 lg:w-32 flex-shrink-0'>
                                {room.images && room.images.length > 0 && (
                                    <img
                                        className='w-full h-full object-cover rounded-lg'
                                        src={room.images[0]}
                                        alt="roomImage"
                                    />
                                )}
                            </div>
                        </div>

                        <h6 className="text-sm text-[#4a4a4a] font-medium">Per Night:</h6>

                        {/* If offer exists */}
                        {room.discountedPrice ? (
                            <div className="mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl line-through text-gray-400 font-semibold">
                                        ₹ {room.basePrice}
                                    </span>

                                    <span className="text-xl font-bold text-green-600">
                                        ₹ {room.discountedPrice}
                                    </span>
                                </div>

                                {/* GST price */}
                                <div className="text-sm text-[#4a4a4a] font-medium mt-1">
                                    +₹ {room.gstPrice} taxes & fees
                                </div>
                            </div>
                        ) : (
                            <h1 className="text-3xl font-bold mb-4">
                                ₹ {room.basePrice}
                                <span className="ml-2 text-[14px] text-[#4a4a4a] font-medium">
                                    {room.gstPrice === 0
                                        ? "No taxes & fees"
                                        : `+₹ ${room.gstPrice} taxes & fees`}
                                </span>
                            </h1>
                        )}


                        <div className='flex w-full justify-between'>
                            <button
                                onClick={() => roomSubmit(room)}
                                className="uppercase text-[16px] font-bold leading-[19px] cursor-pointer px-4 py-1.5 rounded-[8px] bg-gradient-to-r from-[#53b2fe] to-[#065af3] shadow-sm text-white"
                            >
                                Book This Now
                            </button>
                            <button
                                onClick={() => {
                                    if (roomsRef.current) roomsRef.current.scrollIntoView({ behavior: "smooth" })
                                }}
                                className='text-[#038dff] font-semibold text-sm tracking-tight cursor-pointer'
                            >
                                See More Options
                            </button>
                        </div>
                    </div>

                    <div className='p-3 py-5 rounded-lg border-[1px] border-[#d8d8d8]'>

                        {/* Ratings */}
                        <div className='flex justify-between items-center'>
                            <div className='bg-[#2757ae] rounded-lg text-white mr-2 font-bold py-2 px-4'>
                                {overallAvg}
                            </div>
                            <div>
                                <span className='text-[#2757ae] font-bold'>{getRatingLabel(Number(overallAvg))}</span>
                                <span className='text-[#4a4a4a] text-sm ml-1.5'>{`(${totalRatings} ratings)`}</span>
                            </div>
                            <button
                                onClick={() => {
                                    if (reviewRef.current) reviewRef.current.scrollIntoView({ behavior: "smooth" })
                                }}
                                className='text-[#0d92ff] font-semibold cursor-pointer text-[14px]'>
                                All Reviews
                            </button>
                        </div>

                        {/* Separator */}
                        <div className='w-full h-[0.5px] bg-[#d8d8d8] my-4' />

                        {/* Location */}
                        <div className='flex justify-between items-center'>
                            <img className='h-10 w-15 rounded-lg object-cover' src={'https://imgak.mmtcdn.com/pwa_v3/pwa_hotel_assets/map-icon-dtls.png'} alt="mapImage" />
                            <h1 className='text-xl font-bold'>{hotel.city}</h1>
                            <button
                                onClick={() => {
                                    if (mapRef.current) mapRef.current.scrollIntoView({ behavior: "smooth" });
                                }}
                                className='text-[#0d92ff] font-semibold cursor-pointer text-[14px] tracking-tight'>
                                See on Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotelWithRoom