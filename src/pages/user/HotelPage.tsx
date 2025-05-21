import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HotelCard from '@/components/user/Hotelslist';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { useGetAllUserHotels } from '@/hooks/user/useGetUserHotels';

const UserHotelPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const limit = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, isError } = useGetAllUserHotels(page, limit, debouncedValue);
    const hotels = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow py-10 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-6 text-traveste-700">
                        Explore Our Hotels
                    </h2>

                    <div className="max-w-md mx-auto mb-8">
                        <Input
                            type="text"
                            placeholder="Search hotels..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isLoading && <p className="text-center">Loading hotels...</p>}
                    {isError && <p className="text-center text-red-600">Failed to load hotels.</p>}

                    {!isLoading && hotels.length === 0 && (
                        <p className="text-center text-gray-500">No hotels found.</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hotels.map((hotel: any) => (
                            <HotelCard key={hotel._id} hotel={hotel} />
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
