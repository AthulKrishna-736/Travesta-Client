import React, { useState } from "react";
import DataTable from "../common/Table";
import { AmenityTableProps, IAmenity } from "@/types/component.types";
import { useBlockAmenity, useUpdateAmenity } from "@/hooks/admin/useAmenities";
import AmenitiesModal from "./AmenitiesModal";

const AmenityTable: React.FC<AmenityTableProps> = ({ amenities, loading, page, limit }) => {
    const { mutate: toggleBlock, isPending } = useBlockAmenity(page, limit);
    const { mutate: updateAmenity, isPending: isUpdating } = useUpdateAmenity(page, limit);

    const [editAmenity, setEditAmenity] = useState<IAmenity | null>(null);

    const columns = [
        { key: "name", label: "Name" },
        { key: "description", label: "Description", },
        { key: "isActive", label: "Active" },
        { key: "type", label: "Type" },
    ];

    const actions = [
        {
            label: "Toggle Block",
            variant: "ghost" as const,
            onClick: (amenity: IAmenity) => toggleBlock(amenity._id),
        },
        {
            label: "Edit",
            variant: "ghost" as const,
            onClick: (amenity: IAmenity) => setEditAmenity(amenity),
        },
    ];

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
        </>
    );
};

export default AmenityTable;
