import React, { useState } from "react";
import DataTable from "../common/Table";
import { AmenityTableProps, IAmenity } from "@/types/component.types";
import { useBlockAmenity, useUpdateAmenity } from "@/hooks/admin/useAmenities";
import AmenitiesModal from "./AmenitiesModal";
import ConfirmationModal from "../common/ConfirmationModa";

const AmenityTable: React.FC<AmenityTableProps> = ({ amenities, loading, page, limit }) => {
    const [editAmenity, setEditAmenity] = useState<IAmenity | null>(null);
    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState<IAmenity | null>(null);

    const { mutate: toggleBlock, isPending } = useBlockAmenity(page, limit, () => {
        setIsToggleModalOpen(false);
        setSelectedAmenity(null);
    });
    const { mutate: updateAmenity, isPending: isUpdating } = useUpdateAmenity(page, limit);

    const columns = [
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "isActive", label: "Active" },
        { key: "type", label: "Type" },
    ];

    const actions = [
        {
            label: "Toggle Block",
            variant: "ghost" as const,
            onClick: (amenity: IAmenity) => {
                setSelectedAmenity(amenity);
                setIsToggleModalOpen(true);
            },
        },
        {
            label: "Edit",
            variant: "ghost" as const,
            onClick: (amenity: IAmenity) => setEditAmenity(amenity),
        },
    ];

    const handleToggleConfirm = () => {
        if (selectedAmenity) {
            toggleBlock(selectedAmenity._id);
        }
    };

    const handleToggleCancel = () => {
        setIsToggleModalOpen(false);
        setSelectedAmenity(null);
    };

    return (
        <>
            <DataTable
                columns={columns}
                data={amenities}
                actions={actions}
                loading={loading || isPending}
            />

            <AmenitiesModal
                open={!!editAmenity}
                title="Edit Amenity"
                initialData={
                    editAmenity
                        ? {
                            name: editAmenity.name,
                            description: editAmenity.description,
                            type: editAmenity.type,
                        }
                        : undefined
                }
                onCancel={() => setEditAmenity(null)}
                onSubmit={(data) => {
                    if (editAmenity) {
                        updateAmenity({ ...data, id: editAmenity._id });
                    }
                    setEditAmenity(null);
                }}
                loading={isUpdating}
            />

            <ConfirmationModal
                open={isToggleModalOpen}
                title="Toggle Block Amenity"
                description="Are you sure you want to block/unblock this amenity?"
                showInput={false}
                onConfirm={handleToggleConfirm}
                onCancel={handleToggleCancel}
                isLoading={isPending}
            />
        </>
    );
};

export default AmenityTable;
