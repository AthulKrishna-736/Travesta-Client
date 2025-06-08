import React, { useEffect, useState } from 'react';
import DataTable from '@/components/common/Table';
import { IRoom } from '@/types/user.types';
import ShowRoomDetailsModal from './ShowRoomDetailsModal';
import { IRoomTableProps } from '@/types/component.types';
import { useGetAllRooms } from '@/hooks/vendor/useRoom';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/common/Pagination';

const columns = [
    { key: 'name', label: 'Room Name' },
    { key: 'basePrice', label: 'Price' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'bedType', label: 'Bed Type' },
    { key: 'isAvailable', label: 'Available' },
];

const RoomTable: React.FC<Partial<IRoomTableProps>> = () => {
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: roomsData, isLoading } = useGetAllRooms(page, limit, debouncedSearch);
    const rooms = roomsData?.data ?? [];
    const meta = roomsData?.meta;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const handleDetails = (room: IRoom) => {
        setSelectedRoom(room);
        setDetailModalOpen(true);
    };

    const handleEdit = (room: IRoom) => {
        if (onEdit) onEdit(room);
    };

    const actions = [
        {
            label: 'Edit',
            variant: 'default' as const,
            onClick: handleEdit,
        },
        {
            label: 'Details',
            variant: 'ghost' as const,
            className: 'text-blue-600 border-blue-600 hover:bg-blue-50',
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
        </>
    );
};

export default RoomTable;
