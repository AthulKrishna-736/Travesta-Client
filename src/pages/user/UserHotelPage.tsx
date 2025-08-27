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
import HotelCard from '@/components/user/Hotelslist';

const UserHotelPage: React.FC = () => {
    const [params] = useSearchParams();

    const destination = params.get('destination') || '';
    const checkInParam = params.get('checkIn') || '';
    const checkOutParam = params.get('checkOut') || '';
    const guestsParam = parseInt(params.get('guests') || '1', 10);

    const [searchTerm, setSearchTerm] = useState(destination);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [checkIn, setCheckIn] = useState(checkInParam);
    const [checkOut, setCheckOut] = useState(checkOutParam);
    const [guests, setGuests] = useState(guestsParam);
    const [page, setPage] = useState(1);
    const limit = 9;

    const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
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
            <main className="flex-grow py-10 bg-gray-50">
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
                        <section className="w-full lg:w-3/4">
                            {isHotelLoading ? (
                                <div className='flex items-center justify-center gap-4'>
                                    <Loader2 className='w-10 h-10 animate-spin' />
                                    <p className="text-center text-2xl font-semibold">Loading Hotels...</p>
                                </div>
                            ) : hotels.length === 0 ? (
                                <p className="text-center text-gray-500 text-2xl">No hotels found.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {hotels.map((hotel: any) => (
                                        <HotelCard key={hotel.id} hotel={hotel} />
                                    ))}
                                </div>
                            )}

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
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserHotelPage;
