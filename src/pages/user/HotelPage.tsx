import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import RoomCard from '@/components/user/Hotelslist';
import { useGetAvailableRooms } from '@/hooks/vendor/useRoom';
import { IRoom } from '@/types/user.types';
import { useGetActiveAmenities } from '@/hooks/admin/useAmenities';

const UserHotelPage: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedValue, setDebouncedSearchTerm] = useState<string>('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const limit = 9;
    const { data: amenities, isLoading: isAmenitiesLoading } = useGetActiveAmenities();
    const amenitiesData = amenities?.data || [];
    const { data, isLoading, isError } = useGetAvailableRooms(page, limit, priceRange, selectedAmenities, debouncedValue,);

    const rooms = data?.data || [];
    const meta = data?.meta;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
        );
        setPage(1);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setPriceRange([0, 10000]);
        setSelectedAmenities([]);
        setPage(1);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow py-10 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-6 text-travesty-700">
                        Explore Available Rooms
                    </h2>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Filter Sidebar */}
                        <aside className="w-full lg:w-1/4 bg-white p-4 rounded-xl shadow-md">
                            <div className="mb-6">
                                <Input
                                    type="text"
                                    placeholder="Search rooms..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="font-semibold block mb-2">Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
                                <Slider
                                    min={0}
                                    max={10000}
                                    step={10}
                                    value={priceRange}
                                    onValueChange={(value: any) => {
                                        if (value.length === 2) setPriceRange([value[0], value[1]]);
                                    }}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="font-semibold block mb-2">Amenities</label>
                                {isAmenitiesLoading ? (
                                    <p>Loading amenities...</p>
                                ) : (
                                    amenitiesData.map((amenity: any) => (
                                        <div key={amenity._id} className="flex items-center gap-2 mb-2">
                                            <Checkbox
                                                checked={selectedAmenities.includes(amenity._id)}
                                                onCheckedChange={() => toggleAmenity(amenity._id)}
                                            />
                                            <span>{amenity.name}</span>
                                        </div>
                                    ))
                                )}

                            </div>

                            <Button variant="outline" className="w-full" onClick={resetFilters}>
                                Reset Filters
                            </Button>
                        </aside>

                        {/* Rooms Listing */}
                        <section className="w-full lg:w-3/4">
                            {isLoading && <p className="text-center">Loading rooms...</p>}
                            {isError && <p className="text-center text-red-600">Failed to load rooms.</p>}

                            {!isLoading && rooms.length === 0 && (
                                <p className="text-center text-gray-500">No rooms found.</p>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {rooms.map((room: IRoom) => (
                                    <RoomCard key={room.id} room={room} />
                                ))}
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
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserHotelPage;
