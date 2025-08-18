import { useEffect, useState } from "react";
import AmenityTable from "@/components/amenities/AmenitiesTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useCreateAmentiy, useGetAllAmenities } from "@/hooks/admin/useAmenities";
import Pagination from "@/components/common/Pagination";
import { AdminLayout } from "@/components/header/admin/AdminLayout";
import AmenitiesModal from "@/components/amenities/AmenitiesModal";
import { TCreateAmenityData } from "@/types/component.types";
import CustomSort from "@/components/common/CustomSort";
import { ArrowUpAZ, ArrowDownAZ, Clock } from "lucide-react";


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


    const sortOptions = [
        {
            name: "Name (A → Z)",
            tooltip: "Sort alphabetically ascending",
            onClickHandler: () => {
                console.log(`Sorting by  ascending`);
                // call API here with field
            },
            icon: ArrowUpAZ,
        },
        {
            name: "Name (Z → A)",
            tooltip: "Sort alphabetically descending",
            onClickHandler: () => {
                console.log(`Sorting by descending`);
                // call API here with field
            },
            icon: ArrowDownAZ,
        },
        {
            name: "Recently Updated",
            tooltip: "Sort by last updated date",
            onClickHandler: () => {
                console.log(`Sorting by latest`);
                // call API here with field
            },
            icon: Clock,
        },
    ];

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

                    <Button variant="ghost" className="bg-gray-600 text-white hover:border hover:border-black" onClick={() => setOpenModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Amenity
                    </Button>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm mt-3">
                    <span className="text-yellow-800 font-semibold mb-1">Note: </span>
                    <span className="text-yellow-700 text-sm leading-relaxed">
                        Amenities help describe the features available in your hotels. Make sure to{" "}
                        <span className="font-medium">add clear and relevant amenities</span> so guests
                        can easily understand what your property offers.
                    </span>
                </div>

                <div className="space-y-4 overflow-x-auto">

                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-800" />
                        <Input
                            placeholder="Search amenities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 text-gray-800 placeholder:text-gray-800 placeholder:italic"
                        />
                    </div>

                    <CustomSort data={sortOptions} />

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
