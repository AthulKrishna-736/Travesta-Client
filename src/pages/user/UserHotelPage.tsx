import React, { useEffect, useState } from 'react';
import Header from '@/components/header/user/Header';
import Footer from '@/components/footer/Footer';
import Pagination from '@/components/common/Pagination';
import RoomCard from '@/components/user/Hotelslist';
import { useGetAvailableRooms } from '@/hooks/vendor/useRoom';
import { IRoom } from '@/types/room.types';
import { useSearchParams } from 'react-router-dom';
import CustomSearch from '@/components/common/CustomSearch';
import Breadcrumbs from '@/components/common/BreadCrumps';
import UserFilterSidebar from '@/components/sidebar/UserFilterSidebar';
import { Loader2 } from 'lucide-react';
import { useGetUsedActiveAmenities } from '@/hooks/admin/useAmenities';

const UserHotelPage: React.FC = () => {
    const [params] = useSearchParams();

    const destination = params.get('destination') || '';
    const checkIn = params.get('checkIn') || '';
    const checkOut = params.get('checkOut') || '';
    const guests = parseInt(params.get('guests') || '1', 10);

    const [searchTerm, setSearchTerm] = useState(destination);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [page, setPage] = useState(1);
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

    const limit = 9;
    const { data, isLoading: isRoomLoading } = useGetAvailableRooms(
        page,
        limit,
        priceRange,
        selectedAmenities,
        roomType,
        debouncedSearchTerm,
        checkIn,
        checkOut,
        guests
    );
    const rooms = data?.data || [];
    const meta = data?.meta;

    const { data: amenities, isLoading: isAmenitiesLoading } = useGetUsedActiveAmenities();
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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <CustomSearch />

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

                        {/* Rooms Listing */}
                        <section className="w-full lg:w-3/4">
                            {isRoomLoading ? (
                                <div className='flex items-center justify-center gap-4'>
                                    <Loader2 className='w-10 h-10 animate-spin' />
                                    <p className="text-center text-2xl font-semibold">Loading rooms...</p>
                                </div>
                            ) : rooms.length === 0 ? (
                                <p className="text-center text-gray-500 text-2xl">No rooms found.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {rooms.map((room: IRoom) => (
                                        <RoomCard key={room.id} room={room} />
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
