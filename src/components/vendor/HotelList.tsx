import React, { useState } from "react";
import DataTable from "../common/Table";
import { IHotel } from "@/types/user.types";
import ShowHotelDetailsModal from "./ShowHotelDetails";
import { useUpdateHotel } from "@/hooks/vendor/useCreateHotel";

const columns = [
    { key: "name", label: "Hotel Name" },
    { key: "description", label: "Description" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "address", label: "Address" },
];

interface IHotelTableProps {
    hotels: IHotel[];
    loading: boolean;
}

const HotelTable: React.FC<IHotelTableProps> = ({ hotels, loading }) => {
    const [selectedHotel, setSelectedHotel] = useState<IHotel | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    // New state for edit modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [hotelToEdit, setHotelToEdit] = useState<IHotel | null>(null);

    const { mutate: updateHotel, isPending } = useUpdateHotel()


    const handleSubmitEdit = (data: any) => {
        console.log('submit eidt: ', data)
        updateHotel(data)
    }

    // Show details modal
    const handleDetails = (hotel: any) => {
        console.log('check edit: ', hotel)
        setSelectedHotel(hotel);
        setDetailModalOpen(true);
    };

    // Show edit modal
    const handleEdit = (hotel: any) => {
        setHotelToEdit(hotel);
        setEditModalOpen(true);
    };

    // Close details modal
    const handleCloseDetailsModal = () => {
        setDetailModalOpen(false);
        setSelectedHotel(null);
    };

    // Close edit modal
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setHotelToEdit(null);
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
                data={hotels}
                actions={actions}
                loading={loading}
            />

            {/* Details modal */}
            {selectedHotel && (
                <ShowHotelDetailsModal
                    open={detailModalOpen}
                    data={selectedHotel}
                    onClose={handleCloseDetailsModal}
                />
            )}

            {/* Edit modal */}
            {/* {hotelToEdit && (
                <EditHotelModal
                    open={editModalOpen}
                    hotel={hotelToEdit}
                    onClose={handleCloseEditModal}
                    onSubmit={handleSubmitEdit}
                    isLoading={isPending}
                />
            )} */}
        </>
    );
};

export default HotelTable;
