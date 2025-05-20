import React, { useState } from "react";
import DataTable from "../common/Table";

const dummyHotels = [
    {
        id: "1",
        name: "Ocean View Hotel",
        address: "Beach Road, Goa",
        phone: "9876543210",
        rooms: 35,
    },
    {
        id: "2",
        name: "Mountain Retreat",
        address: "Hilltop, Manali",
        phone: "9876543211",
        rooms: 22,
    },
];

const columns = [
    { key: "name", label: "Hotel Name" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "rooms", label: "Rooms" },
];

const HotelTable: React.FC = () => {
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleEdit = (hotel: any) => {
        console.log("Edit hotel:", hotel);
    };

    const handleDetails = (hotel: any) => {
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
            <DataTable columns={columns} data={dummyHotels} actions={actions} />
        </>
    );
};

export default HotelTable;
