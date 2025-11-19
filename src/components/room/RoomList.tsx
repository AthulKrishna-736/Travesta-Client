import React, { useEffect, useState } from 'react';
import DataTable from '@/components/common/Table';
import { IHotel } from '@/types/hotel.types';
import { IRoom } from '@/types/room.types';
import ShowRoomDetailsModal from './ShowRoomDetailsModal';
import CreateRoomModal from './CreateRoomModal';
import { IRoomTableProps } from '@/types/room.types';
import { useGetAllRooms } from '@/hooks/vendor/useRoom';
import { useUpdateRoom } from '@/hooks/vendor/useRoom';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/common/Pagination';
import { Edit, InfoIcon } from 'lucide-react';

const columns = [
    { key: 'name', label: 'Room Name' },
    { key: 'roomType', label: 'Room Type' },
    { key: 'hotelName', label: "Hotel" },
    { key: 'guest', label: 'Guests' },
    { key: 'bedType', label: 'Bed Type' },
    { key: 'roomCount', label: 'Room Count' },
];

const RoomTable: React.FC<Partial<IRoomTableProps>> = ({ hotels }) => {
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 7;

    const { data: roomsData, isLoading } = useGetAllRooms(page, limit, debouncedSearch, selectedHotelId);
    const rooms = roomsData?.data;
    const meta = roomsData?.meta;

    const mappedRooms = rooms ? rooms.map((r: any) => ({ ...r, hotelName: r.hotelId.name, })) : [];

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    // Handle Details modal open
    const handleDetails = (room: IRoom) => {
        setSelectedRoom(room);
        setDetailModalOpen(true);
    };

    // Handle Edit modal open
    const handleEdit = (room: IRoom) => {
        setSelectedRoom(room);
        setEditModalOpen(true);
    };

    // Close Edit modal
    const handleEditClose = () => {
        setSelectedRoom(null);
        setEditModalOpen(false);
    };

    // Update room mutation hook
    const { mutate: updateRoomFn, isPending } = useUpdateRoom(handleEditClose);

    // Submit handler for edit modal form
    const handleEditRoom = (roomData: FormData | { id: string, data: FormData }) => {
        if ('id' in roomData) {
            updateRoomFn({
                id: roomData.id,
                formData: roomData.data
            });
        } else {
            console.error('Invalid data format for edit operation');
        }
    };

    const actions = [
        {
            label: 'Edit',
            variant: 'default' as const,
            icon: Edit,
            showLabel: false,
            tooltip: 'edit room',
            className: "bg-blue-50 text-blue-700 hover:bg-blue-100",
            onClick: handleEdit,
        },
        {
            label: 'Details',
            variant: 'outline' as const,
            icon: InfoIcon,
            showLabel: false,
            tooltip: 'room details',
            className: "bg-green-50 text-green-700 hover:bg-green-100",
            onClick: handleDetails,
        },
    ];

    return (
        <>
            <div className="space-y-4">
                <div className='flex justify-center items-center gap-1'>
                    <Input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 rounded-md px-2 py-2 w-full md:w-1/3"
                        value={selectedHotelId}
                        onChange={(e) => {
                            setSelectedHotelId(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Hotels</option>
                        {hotels?.map((hotel: IHotel) => (
                            <option key={hotel.id} value={hotel.id}>
                                {hotel.name}
                            </option>
                        ))}
                    </select>
                </div>

                {isLoading ?
                    (
                        <div className="flex justify-center items-center py-10">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-3 text-blue-600 font-medium">Loading rooms...</p>
                            </div>
                        </div>
                    ) : mappedRooms && mappedRooms.length > 0 ? (
                        <div className="rounded-lg border-1 overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={mappedRooms}
                                actions={actions}
                                loading={isLoading}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center items-center">
                            <p className="text-semibold text-lg text-red-500">No rooms found. Please create one</p>
                        </div>
                    )}

                {meta && meta.totalPages > 0 && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>

            {selectedRoom && (
                <ShowRoomDetailsModal
                    open={detailModalOpen}
                    data={selectedRoom}
                    onClose={() => setDetailModalOpen(false)}
                />
            )}

            {editModalOpen && selectedRoom && (
                <CreateRoomModal
                    open={editModalOpen}
                    onClose={handleEditClose}
                    isLoading={isPending}
                    roomData={selectedRoom}
                    isEdit={true}
                    onSubmit={handleEditRoom}
                    hotelId={selectedRoom.hotelId}
                    hotels={hotels as IHotel[]}
                />
            )}
        </>
    );
};

export default RoomTable;
