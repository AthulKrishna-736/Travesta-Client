import Header from '@/components/vendor/Header';
import Sidebar from '@/components/vendor/Sidebar';
import React, { useEffect, useState } from 'react';
import CreateHotelModal from '@/components/vendor/CreateHotelModal';
import HotelTable from '@/components/vendor/HotelList';
import { IHotel } from '@/types/user.types';
import { UseCreateHotel } from '@/hooks/vendor/useCreateHotel';
import Pagination from '@/components/common/Pagination';
import { useGetAllHotels } from '@/hooks/vendor/useGetAllHotels';
import { Input } from '@/components/ui/input';

const VendorHotelsPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const limit = 10;

    const { data, isLoading } = useGetAllHotels(page, limit, debouncedValue);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setDebouncedValue(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const hotels = data?.data ?? [];
    const meta = data?.meta;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const { mutate: createHotelfn, isPending } = UseCreateHotel(() => {
        handleModalClose()
    })

    const handleCreateHotel = async (hotelData: IHotel) => {
        const formData = new FormData();

        formData.append('name', hotelData.name);
        formData.append('description', hotelData.description);
        formData.append('address', hotelData.address);
        formData.append('city', hotelData.city);
        formData.append('state', hotelData.state);
        formData.append('tags', hotelData.tags);
        formData.append('amenities', hotelData.amenities);
        formData.append('services', hotelData.services);

        if (hotelData.geoLocation?.length === 2) {
            formData.append('geoLocation', JSON.stringify(hotelData.geoLocation));
        }

        if (hotelData.images && hotelData.images.length > 0) {
            hotelData.images.forEach((file) => {
                formData.append('imageFile', file);
            });
        }

        createHotelfn(formData);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} />
                <main
                    className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-13'}`}
                >
                    <div className="container mx-auto animate-fade-in space-y-6 mt-16">
                        <div className="mb-4 flex justify-between items-center">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                My Hotels
                            </h1>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                onClick={handleModalOpen}
                            >
                                Add Hotel
                            </button>
                        </div>
                        <p className="text-muted-foreground">
                            Manage your listed hotels. You can add, edit, or delete hotels from here.
                        </p>
                        <div className="overflow-x-auto space-y-4">
                            <Input
                                type="text"
                                placeholder="Search hotels..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <HotelTable hotels={hotels} loading={isLoading} />
                        </div>
                    </div>
                    {meta && meta.totalPages > 0 && (
                        <Pagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </main>
            </div>
            {isModalOpen && (
                <CreateHotelModal
                    open={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleCreateHotel}
                    isLoading={isPending}
                />
            )}

        </div>
    );
};

export default VendorHotelsPage;
