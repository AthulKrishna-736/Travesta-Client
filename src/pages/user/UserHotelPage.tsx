import React, { useEffect, useState } from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import Pagination from '@/components/common/Pagination';
import { useSearchParams } from 'react-router-dom';
import CustomSearch from '@/components/common/CustomSearch';
import Breadcrumbs from '@/components/common/BreadCrumps';
import UserFilterSidebar from '@/components/sidebar/UserFilterSidebar';
import { Loader2 } from 'lucide-react';
import { useGetUserAmenities } from '@/hooks/admin/useAmenities';
import { useGetAllUserHotels } from '@/hooks/vendor/useHotel';
import HotelCard from '@/components/hotel/HotelCard';
import CustomSort from '@/components/common/CustomSort';

const breadCrumpItems = [
    { label: 'Home', path: '/user/home' },
    { label: 'Hotels', path: '/user/hotels' }
]

const UserHotelPage: React.FC = () => {
    const [params] = useSearchParams();

    const searchValue = params.get('searchTerm') || '';
    const checkInParam = params.get('checkIn') || '';
    const checkOutParam = params.get('checkOut') || '';
    const guestsParam = parseInt(params.get('guests') || '1', 10);
    const minPrice = parseInt(params.get('minPrice') as string, 10);
    const maxPrice = parseInt(params.get('maxPrice') as string, 10) || Infinity;

    const [searchTerm, setSearchTerm] = useState(searchValue);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [checkIn, setCheckIn] = useState(checkInParam);
    const [checkOut, setCheckOut] = useState(checkOutParam);
    const [guests, setGuests] = useState(guestsParam);
    const [page, setPage] = useState(1);
    const limit = 9;

    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [roomType, setRoomType] = useState<string[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading: isHotelLoading } = useGetAllUserHotels(page, limit, {
        search: debouncedSearchTerm,
        priceRange,
        selectedAmenities,
        roomType,
        checkIn,
        checkOut,
        guests,
    });

    const hotels = data?.data?.length ? data.data : [];
    const meta = data?.meta;

    const { data: amenities, isLoading: isAmenitiesLoading } = useGetUserAmenities();
    const amenitiesData = amenities?.data || [];

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
    };

    const sortOptions = [
        { name: 'Price: High to Low', tooltip: 'Sort price in descending order', onClickHandler: () => { } },
        { name: 'Price: Low to High', tooltip: 'Sort price in ascending order', onClickHandler: () => { } },
        { name: 'Name: A to Z', tooltip: 'Sort alphabetically (ascending)', onClickHandler: () => { } },
        { name: 'Name: Z to A', tooltip: 'Sort alphabetically (descending)', onClickHandler: () => { } }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <CustomSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                checkIn={checkIn}
                setCheckIn={setCheckIn}
                checkOut={checkOut}
                setCheckOut={setCheckOut}
                guests={guests}
                setGuests={setGuests}
                onSearch={handleSearch}
            />
            <main className="flex-grow py-10 bg-[#f2f2f2]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Filter Sidebar */}
                        <UserFilterSidebar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            selectedRoomTypes={roomType}
                            setRoomType={toggleRoomType}
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
                                <div className='mt-5 py-5'>
                                    {isHotelLoading ? (
                                        <div className='flex items-center justify-center gap-4'>
                                            <Loader2 className='w-10 h-10 animate-spin' />
                                            <p className="text-center text-2xl font-semibold">Loading Hotels...</p>
                                        </div>
                                    ) : hotels.length === 0 ? (
                                        <p className="text-center text-gray-500 text-2xl">No hotels found.</p>
                                    ) : (
                                        <div className='py-2'>
                                            {hotels.map((hotel: any) => (
                                                <HotelCard key={hotel.id} hotel={hotel} />
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
