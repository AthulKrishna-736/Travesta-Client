import Header from '@/components/vendor/Header';
import Sidebar from '@/components/vendor/Sidebar';
import React, { useState } from 'react';
import HotelTable from '@/components/vendor/hotel/HotelList';
import RoomTable from '@/components/vendor/room/RoomList';
import { IHotel } from '@/types/user.types';
import { UseCreateHotel } from '@/hooks/vendor/useCreateHotel';
import CreateHotelModal from '@/components/vendor/hotel/CreateHotelModal';
import CreateRoomModal from '@/components/vendor/room/CreateRoomModal';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCreateRoom } from '@/hooks/vendor/useRoom';

const VendorHotelsPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [view, setView] = useState<'hotel' | 'room'>('hotel');
    const [hotelsList, setHotelsList] = useState<IHotel[]>([]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // HOTEL MODAL HANDLERS
    const openHotelModalForCreate = () => {
        setIsHotelModalOpen(true);
    };

    const closeHotelModal = () => {
        setIsHotelModalOpen(false);
    };

    // ROOM MODAL HANDLERS
    const openRoomModalForCreate = () => {
        setIsRoomModalOpen(true);
    };

    const closeRoomModal = () => {
        setIsRoomModalOpen(false);
    };

    const { mutate: createHotelfn, isPending: isCreating } = UseCreateHotel(closeHotelModal);
    const { mutate: createRoomfn, isPending: isCreatingRoom } = useCreateRoom(closeRoomModal);

    //submit handlers
    const handleCreateHotel = async (hotelData: IHotel & { oldImages?: string[] }) => {
        const formData = new FormData();
        formData.append('name', hotelData.name);
        formData.append('description', hotelData.description);
        formData.append('address', hotelData.address);
        formData.append('city', hotelData.city);
        formData.append('state', hotelData.state);
        formData.append('tags', Array.isArray(hotelData.tags) ? hotelData.tags.join(',') : hotelData.tags);
        formData.append('amenities', Array.isArray(hotelData.amenities) ? hotelData.amenities.join(',') : hotelData.amenities);
        formData.append('services', Array.isArray(hotelData.services) ? hotelData.services.join(',') : hotelData.services);

        if (hotelData.geoLocation?.length === 2) {
            formData.append('geoLocation', JSON.stringify(hotelData.geoLocation));
        }

        const urls = hotelData.oldImages ?
            Array.isArray(hotelData.oldImages) ? hotelData.oldImages : [hotelData.oldImages] : [];

        formData.append('images', JSON.stringify(urls));

        if (hotelData.images && hotelData.images.length > 0) {
            hotelData.images.forEach((file) => {
                formData.append('imageFile', file);
            });
        }

        createHotelfn(formData);
    };

    const handleCreateRoom = (roomData: FormData | { id: string, data: FormData }) => {
        createRoomfn(roomData as FormData);
    };


    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} />
                <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'sm:ml-13'}`}>
                    <div className="container mx-auto animate-fade-in space-y-6 mt-16">
                        <div className="mb-4 flex justify-between items-center">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                My {view === 'hotel' ? 'Hotels' : 'Rooms'}
                            </h1>

                            {/* Add Hotel button only if viewing hotels */}
                            {view === 'hotel' && (
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    onClick={openHotelModalForCreate}
                                >
                                    Add Hotel
                                </button>
                            )}

                            {/* Add Room button only if viewing rooms */}
                            {view === 'room' && (
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    onClick={openRoomModalForCreate}
                                >
                                    Add Room
                                </button>
                            )}
                        </div>

                        <p className="text-muted-foreground">
                            Manage your listed {view === 'hotel' ? 'hotels' : 'rooms'}. You can add, edit, or delete {view}s from here.
                        </p>

                        <ToggleGroup type="single" className="w-fit"
                            value={view}
                            onValueChange={(val) => val && setView(val as 'hotel' | 'room')}
                        >
                            <ToggleGroupItem value="hotel">Hotels</ToggleGroupItem>
                            <ToggleGroupItem value="room">Rooms</ToggleGroupItem>
                        </ToggleGroup>

                        <div className="overflow-x-auto space-y-4">
                            {view === 'hotel' ? (
                                <HotelTable onHotelsFetched={setHotelsList} />
                            ) : (
                                <RoomTable hotels={hotelsList} />
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Hotel Create/Edit Modal */}
            {isHotelModalOpen && view === 'hotel' && (
                <CreateHotelModal
                    open={isHotelModalOpen}
                    onClose={closeHotelModal}
                    onSubmit={handleCreateHotel}
                    isLoading={isCreating}
                />
            )}

            {/* Room Create/Edit Modal */}
            {isRoomModalOpen && view === 'room' && (
                <CreateRoomModal
                    open={isRoomModalOpen}
                    onClose={closeRoomModal}
                    onSubmit={handleCreateRoom}
                    isLoading={isCreatingRoom}
                    hotels={hotelsList}
                />
            )}
        </div>
    );
};

export default VendorHotelsPage;
