import React, { useEffect, useState } from 'react';
import DataTable from '@/components/common/Table';
import { IHotel, IRoom } from '@/types/user.types';
import ShowRoomDetailsModal from './ShowRoomDetailsModal';
import CreateRoomModal from './CreateRoomModal';
import { IRoomTableProps } from '@/types/component.types';
import { useGetAllRooms } from '@/hooks/vendor/useRoom';
import { useUpdateRoom } from '@/hooks/vendor/useRoom';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/common/Pagination';

const columns = [
    { key: 'name', label: 'Room Name' },
    { key: 'basePrice', label: 'Price' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'bedType', label: 'Bed Type' },
    { key: 'isAvailable', label: 'Available' },
];

const RoomTable: React.FC<Partial<IRoomTableProps>> = ({ hotels }) => {
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: roomsData, isLoading } = useGetAllRooms(page, limit, debouncedSearch);
    const rooms = roomsData?.data ?? [];
    const meta = roomsData?.meta;

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
            className: "bg-blue-50 text-blue-700 hover:bg-blue-100",
            onClick: handleEdit,
        },
        {
            label: 'Details',
            variant: 'outline' as const,
            className: "bg-green-50 text-green-700 hover:bg-green-100",
            onClick: handleDetails,
        },
    ];

    return (
        <>
            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <DataTable
                    columns={columns}
                    data={rooms}
                    actions={actions}
                    loading={isLoading}
                />

                {meta && meta.totalPages > 1 && (
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
