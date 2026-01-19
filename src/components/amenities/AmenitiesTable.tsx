import React, { useState } from "react";
import DataTable from "../common/Table";
import { AmenityTableProps, IAmenity } from "@/types/amenities.types";
import { useBlockAmenity, useUpdateAmenity } from "@/hooks/admin/useAmenities";
import AmenitiesModal from "./AmenitiesModal";
import ConfirmationModal from "../common/ConfirmationModa";
import { Ban, Edit, Unlock } from "lucide-react";
import { Column } from "@/types/custom.types";

const AmenityTable: React.FC<AmenityTableProps> = ({ amenities, loading }) => {
    const [editAmenity, setEditAmenity] = useState<IAmenity | null>(null);
    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState<IAmenity | null>(null);

    const { mutate: toggleBlock, isPending } = useBlockAmenity(() => {
        setIsToggleModalOpen(false);
        setSelectedAmenity(null);
    });
    const { mutate: updateAmenity, isPending: isUpdating } = useUpdateAmenity();

    const columns: Column<IAmenity>[] = [
        { key: "name", label: "Name", render: (value) => (<span className="font-semibold">{value as string}</span>) },
        { key: "description", label: "Description" },
        {
            key: "isActive", label: "Active", render: (value) => value ? (
                <span className="px-4 py-2 rounded-sm bg-green-100 text-green-700 text-xs font-medium">
                    Active
                </span>
            ) : (
                <span className="px-4 py-2 rounded-sm bg-red-100 text-red-700 text-xs font-medium">
                    Inactive
                </span>
            ),
        },
        {
            key: "type", label: "Type", render: (value) =>
            (
                <span className="px-4 py-2 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium">
                    {value as string}
                </span>
            ),
        },
    ];

    const actions = [
        {
            label: (amenity: IAmenity) => (amenity.isActive ? "Block" : "Unblock"),
            variant: "ghost" as const,
            icon: (amenity: IAmenity) => (amenity.isActive ? Ban : Unlock),
            showLabel: false,
            tooltip: (amenity: IAmenity) => (amenity.isActive ? "Block Amenity" : "Unblock Amenity"),
            className: (amenity: IAmenity) => amenity.isActive ? "cursor-pointer text-red-700 hover:bg-red-100 mx-2" : "cursor-pointer text-green-700 hover:bg-green-100 mx-2",
            onClick: (amenity: IAmenity) => {
                setSelectedAmenity(amenity);
                setIsToggleModalOpen(true);
            },
        },
        {
            label: "Edit",
            variant: "ghost" as const,
            tooltip: 'Edit Amenity',
            icon: Edit,
            showLabel: false,
            className: "cursor-pointer text-blue-700 hover:bg-blue-100 mx-2",
            onClick: (amenity: IAmenity) => setEditAmenity(amenity),
        },
    ];


    const handleToggleConfirm = () => {
        if (selectedAmenity) {
            toggleBlock(selectedAmenity.id);
        }
    };

    const handleToggleCancel = () => {
        setIsToggleModalOpen(false);
        setSelectedAmenity(null);
    };

    return (
        <>
            <div className="rounded-lg border-1 overflow-hidden">
                <DataTable<IAmenity>
                    columns={columns}
                    data={amenities}
                    actions={actions}
                    loading={loading || isPending}
                />
            </div>
            <AmenitiesModal
                open={!!editAmenity}
                title="Edit Amenity"
                initialData={
                    editAmenity
                        ? {
                            name: editAmenity.name,
                            description: editAmenity.description,
                            type: editAmenity.type,
                        } : undefined
                }
                onCancel={() => setEditAmenity(null)}
                onSubmit={(data) => {
                    if (editAmenity) {
                        updateAmenity({ ...data, id: editAmenity.id });
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
