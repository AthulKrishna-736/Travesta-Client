import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import AmenitiesModal from "@/components/amenities/AmenitiesModal";
import AmenityTable from "@/components/amenities/AmenitiesTable";
import CustomSort from "@/components/common/CustomSort";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateAmentiy, useGetAllAmenities } from "@/hooks/admin/useAmenities";
import { TCreateAmenityData } from "@/types/amenities.types";
import { ArrowUpAZ, ArrowDownAZ, Clock } from "lucide-react";
import { TSortOption } from "@/types/custom.types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const AdminAmenities = () => {
    const LIMIT = 8;
    const [role, setRole] = useState<'hotel' | 'room'>('hotel');
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedValue, setDebouncedValue] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [sortOption, setSortOption] = useState<TSortOption>({ 'name': 'ascending' });
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { data, isLoading } = useGetAllAmenities(page, LIMIT, role, debouncedValue, sortOption);
    const { mutate: createAmenityfn, isPending } = useCreateAmentiy();

    useEffect(() => {
        const searchInput = setTimeout(() => {
            setDebouncedValue(searchTerm);
            setPage(1);
        }, 500);

        return () => clearTimeout(searchInput);
    }, [searchTerm]);

    const amenities = data?.data || [];
    const meta = data?.meta;

    const handleCreateAmenity = (data: TCreateAmenityData) => {
        createAmenityfn(data);
        setOpenModal(false);
    };

    const handleRoleChange = (val: string) => {
        if (val) {
            setRole(val as 'hotel' | 'room');
            setPage(1);
            setSearchTerm('');
            setDebouncedValue('');
        }
    };

    const sortOptions = [
        {
            name: "A to Z",
            tooltip: "Sort alphabetically ascending",
            onClickHandler: () => {
                setPage(1);
                setSortOption({ name: 'ascending' });
            },
            icon: ArrowUpAZ,
        },
        {
            name: "Z to A",
            tooltip: "Sort alphabetically descending",
            onClickHandler: () => {
                setPage(1);
                setSortOption({ name: 'descending' });
            },
            icon: ArrowDownAZ,
        },
        {
            name: "Recently Updated",
            tooltip: "Sort by last updated date",
            onClickHandler: () => {
                setPage(1);
                setSortOption({ updatedAt: 'ascending' })
            },
            icon: Clock,
        },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-slate-100 p-6">
                <div className='flex flex-col gap-5 max-w-7xl mx-auto'>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Amenities</h1>
                            <p className="text-muted-foreground">
                                Manage all amenities available in the platform.
                            </p>
                        </div>

                        <Button
                            className="bg-black text-white hover:bg-gray-600 rounded-md shadow-sm cursor-pointer"
                            onClick={() => setOpenModal(true)}
                        >
                            Add Amenity
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

                    <div className="flex justify-between">
                        <ToggleGroup
                            type="single"
                            value={role}
                            onValueChange={handleRoleChange}
                            className="w-fit gap-1 rounded-lg bg-white p-1"
                        >
                            <ToggleGroupItem
                                value="hotel"
                                className="rounded-md border-0 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:shadow-sm"
                            >
                                Hotels
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="room"
                                className="rounded-md border-0 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:shadow-sm"
                            >
                                Rooms
                            </ToggleGroupItem>
                        </ToggleGroup>

                        <Input
                            type="text"
                            placeholder="Search amenities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0"
                        />
                    </div>

                    <CustomSort data={sortOptions} />

                    <div className={`min-h-[70vh] flex ${amenities.length > 0 ? '' : 'items-center bg-white'} justify-center rounded-sm`}>
                        {amenities && amenities.length > 0 ? (
                            <AmenityTable amenities={amenities} loading={isLoading} />
                        ) : (
                            <EmptyState title="No amenities found" description="There are no amenities available yet. Add a new amenity to get started." />
                        )}
                    </div>

                    {meta && meta.totalPages > 0 && (
                        <Pagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </div>

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
