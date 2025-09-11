import React, { useEffect, useState } from "react";
import DataTable from "@/components/common/Table";
import { IHotel } from "@/types/hotel.types";
import ShowHotelDetailsModal from "../hotel/ShowHotelDetails";
import { IHotelTableProps } from "@/types/component.types";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/common/Pagination";
import CreateHotelModal from "./CreateHotelModal";
import { useHotelsByVendor, useUpdateHotel } from "@/hooks/vendor/useHotel";
import { Edit, InfoIcon } from "lucide-react";

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

    const { data: hotelsData, isLoading } = useHotelsByVendor(page, limit, debouncedSearch);
    const hotels = hotelsData?.data;
    const meta = hotelsData?.meta;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (hotels && typeof onHotelsFetched === 'function') {
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
        formData.append('tags', JSON.stringify(Array.isArray(hotelData.tags) ? hotelData.tags : [hotelData.tags]));
        formData.append('amenities', JSON.stringify(Array.isArray(hotelData.amenities) ? hotelData.amenities : [hotelData.amenities]));

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
            showLabel: false,
            tooltip: 'edit hotel',
            icon: Edit,
            className: "bg-blue-50 text-blue-700 hover:bg-blue-100",
            onClick: handleEdit,
        },
        {
            label: "Details",
            variant: "outline" as const,
            showLabel: false,
            icon: InfoIcon,
            tooltip: 'hotel details',
            className: "bg-green-50 text-green-700 hover:bg-green-100",
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

                {hotels ? (
                    <div className="rounded-lg border-1 overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={hotels}
                            actions={actions}
                            loading={isLoading}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="text-semibold text-lg text-red-500">No hotels found. Please create one</p>
                    </div>
                )}

                {meta && meta.totalPages > 0 && (
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
