import React, { useEffect, useState } from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import Pagination from '@/components/common/Pagination';
import { useSearchParams } from 'react-router-dom';
import CustomSearch from '@/components/common/CustomSearch';
import Breadcrumbs from '@/components/common/BreadCrumps';
import UserFilterSidebar from '@/components/sidebar/UserFilterSidebar';
import { useGetUserAmenities } from '@/hooks/admin/useAmenities';
import { useGetAllUserHotels } from '@/hooks/vendor/useHotel';
import HotelCard from '@/components/hotel/HotelCard';
import CustomSort from '@/components/common/CustomSort';
import HotelCardSkelton from '@/components/hotel/HotelCardSkelton';
import { useQueryClient } from '@tanstack/react-query';
import { IHotel } from '@/types/hotel.types';
import { IRoom } from '@/types/room.types';


const UserHotelPage: React.FC = () => {
    const [params] = useSearchParams();
    const queryClient = useQueryClient()

    //Query Parmas
    const searchValue = params.get('searchTerm') || '';
    const checkInParam = params.get('checkIn') || '';
    const checkOutParam = params.get('checkOut') || '';
    const latitude = Number(params.get('lat'));
    const longitude = Number(params.get('long'));
    const rooms = Number(params.get('rooms')) || 1;
    const adults = Number(params.get('adults') || 1);
    const children = Number(params.get('children')) || 0;
    const minPrice = Number(params.get('minPrice') as string);
    const maxPrice = Number(params.get('maxPrice') as string) || Infinity;

    //states
    const [geoSearch, setGeoSearch] = useState(searchValue);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [checkIn, setCheckIn] = useState(checkInParam);
    const [checkOut, setCheckOut] = useState(checkOutParam);
    const [roomsCount, setRoomCount] = useState(rooms);
    const [lat, setLat] = useState(latitude);
    const [long, setLong] = useState(longitude);
    const [guests, setGuests] = useState(adults + children);
    const [page, setPage] = useState(1);

    //filter states
    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [roomType, setRoomType] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<string>('');
    const [rating, setRating] = useState<number>();
    const HOTEL_LIMIT = 6;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: hotelResponseData, isLoading: isHotelLoading } = useGetAllUserHotels(page, HOTEL_LIMIT, lat, long, roomsCount, {
        search: debouncedSearchTerm,
        priceRange,
        selectedAmenities,
        roomType,
        rating,
        checkIn,
        checkOut,
        guests,
        sort: sortOption,
    });

    const hotels = hotelResponseData?.data?.length ? hotelResponseData.data : [];
    const meta = hotelResponseData?.meta;

    const mapHotelWithLocations = hotels.map((h: IHotel & { room?: IRoom }) => {
        return {
            hotelName: h.name,
            price: h.room?.basePrice ?? 0,
            coordinates: h.geoLocation.coordinates,
        }
    })

    const { data: amenities, isLoading: isAmenitiesLoading } = useGetUserAmenities();
    const amenitiesData = amenities?.data || [];

    //functions
    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
        );
        setPage(1);
    };

    const toggleRoomType = (type: string) => {
        setRoomType((prev: string[]) => {
            return prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
        })
        setPage(1);
    }

    const resetFilters = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setPriceRange([0, Infinity]);
        setSelectedAmenities([]);
        setRoomType([]);
        setPage(1);
    };

    const handleSearch = () => {
        setPage(1);
        queryClient.invalidateQueries({ queryKey: ['user-hotels'] });
    };

    const breadCrumpItems = [
        { label: 'Home', path: '/user/home' },
        { label: 'Hotels', path: '/user/hotels' },
        { label: geoSearch }
    ]

    const sortOptions = [
        { name: 'Price: High to Low', tooltip: 'Sort price in descending order', onClickHandler: () => setSortOption('price_desc') },
        { name: 'Price: Low to High', tooltip: 'Sort price in ascending order', onClickHandler: () => setSortOption('price_asc') },
        { name: 'Name: A to Z', tooltip: 'Sort alphabetically (ascending)', onClickHandler: () => setSortOption('name_asc') },
        { name: 'Name: Z to A', tooltip: 'Sort alphabetically (descending)', onClickHandler: () => setSortOption('name_desc') }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
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
            />
            <main className="flex-grow py-4 bg-[#f2f2f2]">
                <div className="container mx-auto px-4 lg:max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-2">
                        {/* Filter Sidebar */}
                        <UserFilterSidebar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            selectedRoomTypes={roomType}
                            setRoomType={toggleRoomType}
                            selectedRating={rating}
                            setRating={setRating}
                            latitude={latitude}
                            longitude={longitude}
                            hotels={mapHotelWithLocations}
                            selectedAmenities={selectedAmenities}
                            toggleAmenity={toggleAmenity}
                            resetFilters={resetFilters}
                            amenitiesData={amenitiesData}
                            isAmenitiesLoading={isAmenitiesLoading}
                        />

                        {/* Hotels Listing */}
                        <section className="w-full rounded-sm lg:w-3/4 p-2">
                            <Breadcrumbs items={breadCrumpItems} />
                            <div>
                                {isHotelLoading ? null : meta && meta.totalData > 0 ? (
                                    <h1 className='text-black text-2xl font-bold mt-4 mb-3'>
                                        {meta.totalData} {meta.totalData <= 1 ? 'Property' : 'Properties'} Found
                                    </h1>
                                ) : (
                                    <h1 className='text-black text-2xl font-bold mt-4 mb-3'>
                                        No Properties Found
                                    </h1>
                                )}

                                {/* sort options */}
                                <div>
                                    <CustomSort data={sortOptions} />
                                </div>

                                {/* hotel list */}
                                <div className='mt-3 py-4'>
                                    {isHotelLoading ? (
                                        <HotelCardSkelton />
                                    ) : hotels.length === 0 ? (
                                        <p className="text-center text-gray-500 text-2xl">No hotels found.</p>
                                    ) : (
                                        <div>
                                            {hotels.map((hotel: any) => (
                                                <HotelCard key={hotel.id} hotel={hotel} roomsCount={roomsCount} guests={guests} geoSearch={geoSearch} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {meta && meta.totalPages > 0 && (
                                <div className="mt-10 flex justify-center">
                                    <Pagination
                                        currentPage={meta.currentPage}
                                        totalPages={meta.totalPages}
                                        onPageChange={setPage}
                                    />
                                </div>
                            )}
                        </section>
                    </div>
                </div >
            </main >

            <Footer />
        </div >
    );
};

export default UserHotelPage;
