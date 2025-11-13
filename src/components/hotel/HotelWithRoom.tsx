import React, { RefObject } from 'react'
import { MapPin, Users } from 'lucide-react';
import { THotelResponse, TRoomResponse } from '@/types/response.types';

interface IHotelWithRoom {
    hotel: THotelResponse;
    rooms: TRoomResponse[];
    mapRef: RefObject<HTMLDivElement | null>;
    reviewRef: RefObject<HTMLDivElement | null>;
    roomsRef: RefObject<HTMLDivElement | null>;
    roomSubmit: (roomId: string) => void;
}

const HotelWithRoom: React.FC<IHotelWithRoom> = ({ hotel, rooms, mapRef, reviewRef, roomsRef, roomSubmit }) => {
    return (
        <div className='bg-white p-5 rounded-md shadow-xs'>
            {/* Name */}
            <h1 className='text-xl font-bold'>{hotel.name}</h1>

            <div className='flex w-full h-full my-4 gap-4'>
                <div className='space-y-6 w-175'>
                    {/* Images */}
                    <div className='flex gap-3'>
                        <div className='h-80 w-115'>
                            {hotel.images.slice(0, 1).map((i, idx) => (
                                <img className='h-full w-full object-cover rounded-lg' key={idx} src={i} alt={`Image:${idx}`} />
                            ))}
                        </div>
                        <div className='flex flex-col justify-between'>
                            {hotel.images.slice(1, 3).map((i, idx) => (
                                <img className='h-39 w-60 object-cover rounded-lg' key={idx} src={i} alt={`Images:${idx}`} />
                            ))}
                        </div>
                    </div>

                    {/* location */}
                    <div className="flex items-center gap-2 text-muted-foreground text-md">
                        <MapPin className="w-5 h-5" />
                        <span>{hotel.city}, {hotel.state} – {hotel.address}</span>
                    </div>

                    {/* Description */}
                    <div className='space-y-2 w-175'>
                        <h1 className='text-lg font-bold'>
                            About Property
                        </h1>
                        <p className='whitespace-pre-line font-semibold text-sm text-[#4a4a4a]'>
                            {hotel.description}
                        </p>
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
                    <div className='space-y-2'>
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
                <div className='flex flex-col h-full w-full gap-4'>
                    <div className='p-4 rounded-lg border-[1px] border-[#d8d8d8]'>
                        <div className='flex gap-4 mb-4'>
                            <div className='flex-1'>
                                <h1 className='text-lg font-bold mb-2'>{rooms[0].name}</h1>
                                <div className='flex items-center gap-2 mb-2'>
                                    <div className='bg-blue-50 p-1.5 rounded-sm'>
                                        <Users className='w-4 h-4 text-blue-600' />
                                    </div>
                                    <span className='text-sm font-medium text-gray-700'>
                                        Up to {rooms[0].guest} {rooms[0].guest === 1 ? 'Guest' : 'Guests'}
                                    </span>
                                </div>
                                <h3 className='inline-block bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 text-sm font-semibold px-3 py-1.5 rounded-sm border border-purple-200'>
                                    Room Type: {rooms[0].roomType}
                                </h3>
                            </div>
                            <div className='w-32 h-32 flex-shrink-0'>
                                {rooms[0].images && rooms[0].images.length > 0 && (
                                    <img
                                        className='w-full h-full object-cover rounded-lg'
                                        src={rooms[0].images[0]}
                                        alt="roomImage"
                                    />
                                )}
                            </div>
                        </div>
                        <h6 className='text-sm text-[#4a4a4a] font-medium'>Per Night:</h6>
                        <h1 className="text-3xl font-bold mb-4">
                            ₹ {rooms[0].basePrice}
                            <span className="ml-2 text-[14px] text-[#4a4a4a] font-medium">
                                {rooms[0].gstPrice === 0 ? "No taxes & fees" : `+₹ ${rooms[0].gstPrice} taxes & fees`}
                            </span>
                        </h1>

                        <div className='flex w-full justify-between'>
                            <button
                                onClick={() => roomSubmit(rooms[0].id)}
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
                                1.1
                            </div>
                            <div>
                                <span className='text-[#2757ae] font-bold'>Excellent</span>
                                <span className='text-[#4a4a4a] text-sm ml-1.5'>{`(1234 ratings)`}</span>
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