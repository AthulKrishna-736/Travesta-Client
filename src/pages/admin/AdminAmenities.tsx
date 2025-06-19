import { useEffect, useState } from "react";
import AmenityTable from "@/components/amenities/AmenitiesTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useCreateAmentiy, useGetAllAmenities } from "@/hooks/admin/useAmenities";
import Pagination from "@/components/common/Pagination";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import AmenitiesModal from "@/components/amenities/AmenitiesModal";
import { TCreateAmenityData } from "@/types/component.types";

const AdminAmenities = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedValue, setDebouncedValue] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const limit = 8;

    useEffect(() => {
        const searchInput = setTimeout(() => {
            setDebouncedValue(searchTerm);
            setPage(1);
        }, 500);

        return () => clearTimeout(searchInput);
    }, [searchTerm]);

    const { data, isLoading } = useGetAllAmenities(page, limit, debouncedValue);
    const { mutate: createAmenityfn, isPending } = useCreateAmentiy(page, limit);

    const amenities = data?.data || [];
    const meta = data?.meta;

    const handleCreateAmenity = (data: TCreateAmenityData) => {
        console.log("Creating amenity:", data);
        createAmenityfn(data);
        setOpenModal(false);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Amenities</h1>
                        <p className="text-muted-foreground">
                            Manage all amenities available in the platform.
                        </p>
                    </div>

                    <Button variant="ghost" onClick={() => setOpenModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Amenity
                    </Button>
                </div>

                <div className="space-y-4 overflow-x-auto">
                    <Input
                        placeholder="Search amenities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {amenities && amenities.length > 0 ? (
                        <AmenityTable
                            amenities={amenities}
                            loading={isLoading}
                            page={page}
                            limit={limit}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                            <p className="mb-2 text-lg font-medium">No amenities found</p>
                            <p className="mb-4">You can add a new amenity to get started.</p>
                        </div>
                    )}
                </div>

                {meta && meta.totalPages > 0 && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                    />
                )}

                <AmenitiesModal
                    open={openModal}
                    title="Create New Amenity"
                    onCancel={() => setOpenModal(false)}
                    onSubmit={handleCreateAmenity}
                    loading={isPending}
                />

            </div>
        </AdminLayout>
    );
};

export default AdminAmenities;
