import React, { useState } from "react";
import DataTable from "../../common/Table";
import { IRoom } from "@/types/user.types";
import ShowRoomDetailsModal from "./ShowRoomDetailsModal";
import { IRoomTableProps } from "@/types/component.types";


const columns = [
    { key: 'name', label: 'Room Name' },
    { key: 'basePrice', label: 'Price' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'bedType', label: 'Bed Type' },
    { key: 'isAvailable', label: 'Available' },  
];

const RoomTable: React.FC<IRoomTableProps> = ({ rooms, loading, onEdit }) => {
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleDetails = (room: IRoom) => {
        setSelectedRoom(room);
        setDetailModalOpen(true);
    };

    const handleEdit = (room: IRoom) => {
        if (onEdit) {
            onEdit(room);
        }
    };

    const actions = [
        {
            label: "Edit",
            variant: "default" as const,
            onClick: handleEdit,
        },
        {
            label: "Details",
            variant: "ghost" as const,
            className: "text-blue-600 border-blue-600 hover:bg-blue-50",
            onClick: handleDetails,
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={rooms}
                actions={actions}
                loading={loading}
            />
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
