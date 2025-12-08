import React, { useState } from "react";
import { IOffer, OfferTableProps } from "@/types/offer.types";
import DataTable from "../common/Table";
import ConfirmationModal from "../common/ConfirmationModa";
import { Eye, Edit, Ban, Unlock } from "lucide-react";
import ShowOfferDetailsModal from "./ShowOfferDetails";


const OfferTable: React.FC<OfferTableProps> = ({ offers, loading, onToggleBlock, onEdit, }) => {
    const [selectedOffer, setSelectedOffer] = useState<IOffer | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [viewOffer, setViewOffer] = useState<IOffer | null>(null);

    const columns = [
        { key: "name", label: "Name" },
        { key: "roomType", label: "Room Type" },
        { key: "discountType", label: "Discount Type" },
        { key: "discountValue", label: "Value" },
        { key: "startDate", label: "Start Date" },
        { key: "expiryDate", label: "End Date" },
        { key: "isBlocked", label: "Blocked" },
    ];

    const actions = [
        {
            label: "View",
            tooltip: "View Offer Details",
            icon: Eye,
            variant: "ghost" as const,
            showLabel: false,
            className: "cursor-pointer text-gray-700 hover:bg-gray-200 mx-1",
            onClick: (offer: IOffer) => setViewOffer(offer),
        },
        {
            label: "Edit",
            tooltip: "Edit Offer",
            icon: Edit,
            variant: "ghost" as const,
            showLabel: false,
            className: "cursor-pointer text-blue-700 hover:bg-blue-100 mx-1",
            onClick: (offer: IOffer) => onEdit(offer),
        },
        {
            label: (o: IOffer) => (o.isBlocked ? "Unblock" : "Block"),
            tooltip: (o: IOffer) => (o.isBlocked ? "Unblock Offer" : "Block Offer"),
            icon: (o: IOffer) => (o.isBlocked ? Unlock : Ban),
            variant: "ghost" as const,
            showLabel: false,
            className: (o: IOffer) =>
                o.isBlocked
                    ? "cursor-pointer text-green-700 hover:bg-green-100 mx-1"
                    : "cursor-pointer text-red-700 hover:bg-red-100 mx-1",
            onClick: (offer: IOffer) => {
                setSelectedOffer(offer);
                setIsConfirmOpen(true);
            },
        },
    ];

    const handleConfirmToggle = () => {
        if (selectedOffer) {
            onToggleBlock(selectedOffer.id);
        }
        setIsConfirmOpen(false);
        setSelectedOffer(null);
    };

    return (
        <>
            <div className="rounded-lg border overflow-hidden">
                {offers && offers.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={offers}
                        actions={actions}
                        loading={loading}
                    />
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="font-semibold text-2xl text-red-500 bg-red-100 w-full text-center py-5">
                            No offers found. Please create one.
                        </p>
                    </div>
                )}
            </div>

            {/* Confirm Block/Unblock */}
            <ConfirmationModal
                open={isConfirmOpen}
                title={
                    selectedOffer?.isBlocked ? "Unblock Offer" : "Block Offer"
                }
                description="Are you sure you want to change block status for this offer?"
                onConfirm={handleConfirmToggle}
                onCancel={() => {
                    setIsConfirmOpen(false);
                    setSelectedOffer(null);
                }}
                showInput={false}
                isLoading={false}
            />

            {/* Show Offer Details Modal */}
            <ShowOfferDetailsModal
                open={!!viewOffer}
                offer={viewOffer}
                onClose={() => setViewOffer(null)}
            />
        </>
    );
};

export default OfferTable;
