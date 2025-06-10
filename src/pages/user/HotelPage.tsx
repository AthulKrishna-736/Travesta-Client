import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { IRoom } from '@/types/user.types';
import RoomCard from '@/components/user/Hotelslist';
import { useGetAvailableRooms } from '@/hooks/vendor/useRoom';

const UserHotelPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedValue, setDebouncedSearchTerm] = useState('');
    const limit = 9;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 600);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, isError } = useGetAvailableRooms(page, limit, debouncedValue ? searchTerm : undefined);
    const rooms = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow py-10 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-6 text-travesty-700">
                        Explore Available Rooms
                    </h2>

                    <div className="max-w-md mx-auto mb-8">
                        <Input
                            type="text"
                            placeholder="Search rooms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isLoading && <p className="text-center">Loading rooms...</p>}
                    {isError && <p className="text-center text-red-600">Failed to load rooms.</p>}

                    {!isLoading && rooms.length === 0 && (
                        <p className="text-center text-gray-500">No rooms found.</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room: IRoom) => (
                            <RoomCard key={room._id} room={room} />
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
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserHotelPage;
