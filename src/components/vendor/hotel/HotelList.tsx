import React, { useEffect, useState } from "react";
import DataTable from "@/components/common/Table";
import { IHotel } from "@/types/user.types";
import ShowHotelDetailsModal from "./ShowHotelDetails";
import { IHotelTableProps } from "@/types/component.types";
import { useGetAllHotels } from "@/hooks/vendor/useGetAllHotels";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/common/Pagination";
import CreateHotelModal from "./CreateHotelModal";
import { useUpdateHotel } from "@/hooks/vendor/useCreateHotel";

const columns = [
    { key: "name", label: "Hotel Name" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "address", label: "Address" },
];

const HotelTable: React.FC<Partial<IHotelTableProps>> = ({ onHotelsFetched }) => {
    const [selectedHotel, setSelectedHotel] = useState<IHotel | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: hotelsData, isLoading } = useGetAllHotels(page, limit, debouncedSearch);
    const hotels = hotelsData?.data ?? [];
    const meta = hotelsData?.meta;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (hotels.length > 0 && typeof onHotelsFetched === 'function') {
            onHotelsFetched(hotels);
        }
    }, [hotels, onHotelsFetched]);


    const handleDetails = (hotel: IHotel) => {
        setSelectedHotel(hotel);
        setDetailModalOpen(true);
    };

    const handleEdit = (hotel: IHotel) => {
        setSelectedHotel(hotel);
        setIsEdit(true);
    };

    const handleEditClose = () => {
        setSelectedHotel(null);
        setIsEdit(false);
    }

    const { mutate: updateHotelfn, isPending } = useUpdateHotel(handleEditClose);

    const handleEditHotel = (hotelData: IHotel & { oldImages: string[] }) => {
        const formData = new FormData();
        formData.append('name', hotelData.name);
        formData.append('description', hotelData.description);
        formData.append('address', hotelData.address);
        formData.append('city', hotelData.city);
        formData.append('state', hotelData.state);
        formData.append('tags', Array.isArray(hotelData.tags) ? hotelData.tags.join(',') : hotelData.tags);
        formData.append('amenities', Array.isArray(hotelData.amenities) ? hotelData.amenities.join(',') : hotelData.amenities);
        formData.append('services', Array.isArray(hotelData.services) ? hotelData.services.join(',') : hotelData.services);

        if (hotelData.geoLocation?.length === 2) {
            formData.append('geoLocation', JSON.stringify(hotelData.geoLocation));
        }

        const urls = hotelData.oldImages ?
            Array.isArray(hotelData.oldImages) ? hotelData.oldImages : [hotelData.oldImages] : [];

        formData.append('images', JSON.stringify(urls));

        if (hotelData.images && hotelData.images.length > 0) {
            hotelData.images.forEach((file) => {
                formData.append('imageFile', file);
            });
        }

        updateHotelfn({ id: hotelData._id as string, data: formData })
    }

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
            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Search hotels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <DataTable
                    columns={columns}
                    data={hotels}
                    actions={actions}
                    loading={isLoading}
                />

                {meta && meta.totalPages > 1 && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>

            {selectedHotel && (
                <ShowHotelDetailsModal
                    open={detailModalOpen}
                    data={selectedHotel}
                    onClose={() => setDetailModalOpen(false)}
                />
            )}
            {isEdit && selectedHotel && (
                <CreateHotelModal
                    open={isEdit}
                    onClose={handleEditClose}
                    isLoading={isPending}
                    hotelData={selectedHotel}
                    isEdit={isEdit}
                    onSubmit={handleEditHotel}
                />
            )}
        </>
    );
};

export default HotelTable;
