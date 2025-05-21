import React, { useState } from "react";
import DataTable from "../common/Table";
import { IHotel } from "@/types/user.types";
import ShowHotelDetailsModal from "./ShowHotelDetails";

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

    const handleEdit = (hotel: IHotel) => {
        console.log("Edit hotel:", hotel);
    };

    const handleDetails = (hotel: IHotel) => {
        setSelectedHotel(hotel);
        setDetailModalOpen(true);
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
            <DataTable columns={columns} data={hotels} actions={actions} loading={loading} />
            <ShowHotelDetailsModal
                open={detailModalOpen}
                data={selectedHotel}
                onClose={() => setDetailModalOpen(false)}
            />
        </>
    );
};

export default HotelTable;
