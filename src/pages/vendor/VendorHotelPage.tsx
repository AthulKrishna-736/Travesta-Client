import Header from '@/components/vendor/Header';
import Sidebar from '@/components/vendor/Sidebar';
import React, { useState } from 'react';
import CreateHotelModal from '@/components/vendor/CreateHotelModal';
import HotelTable from '@/components/vendor/HotelList';

const VendorHotelsPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleCreateHotel = async () => {
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
                            <HotelTable />
                        </div>
                    </div>
                </main>
            </div>

            {isModalOpen && (
                <CreateHotelModal
                    open={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleCreateHotel}
                />
            )}

        </div>
    );
};

export default VendorHotelsPage;
