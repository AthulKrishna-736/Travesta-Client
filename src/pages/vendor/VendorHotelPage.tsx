import Header from '@/components/vendor/Header';
import Sidebar from '@/components/vendor/Sidebar';
import React, { useEffect, useState } from 'react';
import HotelTable from '@/components/vendor/hotel/HotelList';
import RoomTable from '@/components/vendor/room/RoomList';
import { IHotel, IRoom } from '@/types/user.types';
import { UseCreateHotel, useUpdateHotel } from '@/hooks/vendor/useCreateHotel';
import { useGetAllHotels } from '@/hooks/vendor/useGetAllHotels';
import { Input } from '@/components/ui/input';
import CreateHotelModal from '@/components/vendor/hotel/CreateHotelModal';
import CreateRoomModal from '@/components/vendor/room/CreateRoomModal';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCreateRoom, useGetAllRooms, useUpdateRoom } from '@/hooks/vendor/useRoom';
import Pagination from '@/components/common/Pagination';

const VendorHotelsPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState<IHotel | null>(null);

    // State for Room Modal
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [view, setView] = useState<'hotel' | 'room'>('hotel');
    const limit = 10;

    const { data: hotelData, isLoading: isHotelLoading } = useGetAllHotels(page, limit, debouncedValue);
    const hotels = hotelData?.data ?? [];
    const hotelMeta = hotelData?.meta;

    const { data: roomsData, isLoading: isRoomsLoading } = useGetAllRooms();
    const rooms = roomsData?.data ?? [];
    const roomMeta = roomsData?.meta;


    // Debounce search input for performance
    useEffect(() => {
        const debounce = setTimeout(() => {
            setDebouncedValue(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    // Sidebar toggle handler
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // HOTEL MODAL HANDLERS
    const openHotelModalForCreate = () => {
        setEditingHotel(null);
        setIsHotelModalOpen(true);
    };

    const openHotelModalForEdit = (hotel: IHotel) => {
        setEditingHotel(hotel);
        setIsHotelModalOpen(true);
    };

    const closeHotelModal = () => {
        setIsHotelModalOpen(false);
    };

    // ROOM MODAL HANDLERS
    const openRoomModalForCreate = () => {
        setEditingRoom(null);
        setIsRoomModalOpen(true);
    };

    const openRoomModalForEdit = (room: IRoom) => {
        setEditingRoom(room);
        setIsRoomModalOpen(true);
    };

    const closeRoomModal = () => {
        setIsRoomModalOpen(false);
    };

    const { mutate: createHotelfn, isPending: isCreating } = UseCreateHotel(page, limit, closeHotelModal, debouncedValue);
    const { mutate: updateHotelfn, isPending: isUpdating } = useUpdateHotel(closeHotelModal, page, limit, debouncedValue);

    const { mutate: createRoomMutate, isPending: isCreatingRoom } = useCreateRoom(() => {
        closeRoomModal();
    });

    const { mutate: updateRoomMutate, isPending: isUpdatingRoom } = useUpdateRoom(() => {
        closeRoomModal();
    });

    //submit handlers
    const handleCreateOrEditHotel = async (hotelData: Omit<IHotel, 'images'> & { images: File[], oldImages?: string[] }) => {
        console.log('hotel data: ', hotelData)
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

        const urls = hotelData.oldImages
            ? Array.isArray(hotelData.oldImages)
                ? hotelData.oldImages
                : [hotelData.oldImages]
            : [];

        formData.append('images', JSON.stringify(urls));



        if (hotelData.images && hotelData.images.length > 0) {
            hotelData.images.forEach((file) => {
                formData.append('imageFile', file);
            });
        }

        if (editingHotel) {
            const hotelId = editingHotel._id as string ?? hotelData.id;
            if (!hotelId) {
                console.error('Hotel ID is missing during update.', editingHotel);
                return;
            }
            updateHotelfn({ id: hotelId, data: formData });
        } else {
            createHotelfn(formData);
        }
    };

    const handleCreateOrEditRoom = (roomData: FormData | { id: string; data: FormData }) => {
        if ('id' in roomData) {
            // Edit case
            updateRoomMutate({ id: roomData.id, formData: roomData.data });
        } else {
            // Create case
            createRoomMutate(roomData);
        }
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

                        <ToggleGroup
                            type="single"
                            value={view}
                            onValueChange={(val) => val && setView(val as 'hotel' | 'room')}
                            className="w-fit"
                        >
                            <ToggleGroupItem value="hotel">Hotels</ToggleGroupItem>
                            <ToggleGroupItem value="room">Rooms</ToggleGroupItem>
                        </ToggleGroup>

                        <div className="overflow-x-auto space-y-4">
                            <Input
                                type="text"
                                placeholder={`Search ${view}s...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {view === 'hotel' ? (
                                <HotelTable hotels={hotels} loading={isHotelLoading} onEdit={openHotelModalForEdit} />
                            ) : (
                                <RoomTable rooms={rooms} loading={isRoomsLoading} onEdit={openRoomModalForEdit} />
                            )}
                        </div>

                        {hotelMeta && hotelMeta.totalPages > 0 && (
                            <Pagination
                                currentPage={hotelMeta.currentPage}
                                totalPages={hotelMeta.totalPages}
                                onPageChange={setPage}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* Hotel Create/Edit Modal */}
            {isHotelModalOpen && view === 'hotel' && (
                <CreateHotelModal
                    open={isHotelModalOpen}
                    onClose={closeHotelModal}
                    onSubmit={handleCreateOrEditHotel}
                    isLoading={isCreating || isUpdating}
                    hotelData={editingHotel}
                    isEdit={!!editingHotel}
                />
            )}

            {/* Room Create/Edit Modal */}
            {isRoomModalOpen && view === 'room' && (
                <CreateRoomModal
                    open={isRoomModalOpen}
                    onClose={closeRoomModal}
                    onSubmit={handleCreateOrEditRoom}
                    isLoading={isCreatingRoom || isUpdatingRoom}
                    roomData={editingRoom}
                    isEdit={!!editingRoom}
                    hotelId={editingRoom ? editingRoom.hotelId : hotels[0]?._id ?? ''}
                    hotels={hotels}
                />

            )}
        </div>
    );
};

export default VendorHotelsPage;
