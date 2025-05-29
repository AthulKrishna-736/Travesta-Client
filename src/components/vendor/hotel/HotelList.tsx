import React, { useState } from "react";
import DataTable from "../../common/Table";
import { IHotel } from "@/types/user.types";
import ShowHotelDetailsModal from "./ShowHotelDetails";
import { IHotelTableProps } from "@/types/component.types";

const columns = [
    { key: "name", label: "Hotel Name" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "address", label: "Address" },
];

const HotelTable: React.FC<IHotelTableProps> = ({ hotels, loading, onEdit }) => {
    const [selectedHotel, setSelectedHotel] = useState<IHotel | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);


    const handleDetails = (hotel: IHotel) => {
        console.log('check edit: ', hotel)
        setSelectedHotel(hotel);
        setDetailModalOpen(true);
    };

    const handleEdit = (hotel: IHotel) => {
        if (onEdit) {
            onEdit(hotel)
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
                data={hotels}
                actions={actions}
                loading={loading}
            />
            {selectedHotel && (
                <ShowHotelDetailsModal
                    open={detailModalOpen}
                    data={selectedHotel}
                    onClose={() => { setDetailModalOpen(false) }}
                />
            )}
        </>
    );
};

export default HotelTable;
