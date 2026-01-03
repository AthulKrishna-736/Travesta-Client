import React, { useState } from 'react';
import HotelTable from '@/components/hotel/HotelList';
import RoomTable from '@/components/room/RoomList';
import { IHotel, TCreateHotel } from '@/types/hotel.types';
import { UseCreateHotel } from '@/hooks/vendor/useHotel';
import CreateHotelModal from '@/components/hotel/CreateHotelModal';
import CreateRoomModal from '@/components/room/CreateRoomModal';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCreateRoom } from '@/hooks/vendor/useRoom';
import VendorLayout from '@/components/layouts/VendorLayout';

const VendorHotelsPage: React.FC = () => {
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [view, setView] = useState<'hotel' | 'room'>('hotel');
    const [hotelsList, setHotelsList] = useState<IHotel[]>([]);

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
    const handleCreateHotel = async (hotelData: TCreateHotel) => {
        const formData = new FormData();
        formData.append('name', hotelData.name.trim());
        formData.append('description', hotelData.description.trim());
        formData.append('address', hotelData.address.trim());
        formData.append('city', hotelData.city.trim());
        formData.append('state', hotelData.state.trim());
        formData.append('tags', JSON.stringify(Array.isArray(hotelData.tags) ? hotelData.tags : [hotelData.tags]));
        formData.append('amenities', JSON.stringify(Array.isArray(hotelData.amenities) ? hotelData.amenities : [hotelData.amenities]));
        formData.append('geoLocation', JSON.stringify(hotelData.geoLocation));
        formData.append('images', JSON.stringify([]));

        if (hotelData.images && hotelData.images.length > 0) {
            hotelData.images.forEach((file) => {
                formData.append('imageFile', file);
            });
        }

        formData.append('checkInTime', hotelData.checkInTime);
        formData.append('checkOutTime', hotelData.checkOutTime);
        formData.append('minGuestAge', hotelData.minGuestAge.toString());

        formData.append('petsAllowed', hotelData.petsAllowed === true ? 'true' : 'false');
        formData.append('outsideFoodAllowed', hotelData.outsideFoodAllowed === true ? 'true' : 'false');
        formData.append('idProofAccepted', JSON.stringify(hotelData.idProofAccepted))
        if (hotelData.specialNotes) {
            formData.append('specialNotes', hotelData.specialNotes.trim());
        };

        createHotelfn(formData);
    };

    const handleCreateRoom = (roomData: FormData | { id: string, data: FormData }) => {
        createRoomfn(roomData as FormData);
    };


    return (
        <VendorLayout>
            <>
                <div className="flex justify-between items-center">
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            onClick={openRoomModalForCreate}
                        >
                            Add Room
                        </button>
                    )}
                </div>

                <p className="text-muted-foreground my-2">
                    Manage your listed {view === 'hotel' ? 'hotels' : 'rooms'}. You can add, edit {view}s from here.
                </p>

                <ToggleGroup type="single" className="w-fit my-4" value={view} onValueChange={(val) => val && setView(val as 'hotel' | 'room')}>
                    <ToggleGroupItem value="hotel" className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-blue-100 data-[state=on]:bg-blue-600 data-[state=on]:text-white">
                        Hotels
                    </ToggleGroupItem>
                    <ToggleGroupItem value="room" className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-blue-100 data-[state=on]:bg-blue-600 data-[state=on]:text-white">
                        Rooms
                    </ToggleGroupItem>
                </ToggleGroup>

                <div className="bg-yellow-100 my-2 border-l-4 border-yellow-500 p-3 rounded-sm">
                    <span className="text-yellow-800 font-medium">Note: </span>
                    <span className="text-yellow-700 text-sm">
                        Please create well-detailed and genuine hotel and room listings. Accurate
                        information helps guests trust your property and improves visibility.
                    </span>
                </div>

                <div className="overflow-x-auto my-4">
                    {view === 'hotel' ? (
                        <HotelTable onHotelsFetched={setHotelsList} />
                    ) : (
                        <RoomTable hotels={hotelsList} />
                    )}
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
            </>
        </VendorLayout >
    );
};

export default VendorHotelsPage;
