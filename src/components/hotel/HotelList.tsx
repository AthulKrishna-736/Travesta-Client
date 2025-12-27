import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/common/Table";
import { IHotel, TUpdateHotel } from "@/types/hotel.types";
import ShowHotelDetailsModal from "../hotel/ShowHotelDetails";
import { IHotelTableProps } from "@/types/hotel.types";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/common/Pagination";
import CreateHotelModal from "./CreateHotelModal";
import { useHotelsByVendor, useUpdateHotel } from "@/hooks/vendor/useHotel";
import { Edit, InfoIcon, LineChartIcon } from "lucide-react";

const columns = [
    { key: "name", label: "Hotel Name" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "address", label: "Address" },
];

const HotelTable: React.FC<Partial<IHotelTableProps>> = ({ onHotelsFetched }) => {
    const navigate = useNavigate();
    const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
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

    const handleHotelAnalytics = (hotel: IHotel) => {
        navigate(`/vendor/hotel-dashboard/${hotel.id}`)
    }

    const { mutate: updateHotelfn, isPending } = useUpdateHotel(handleEditClose);

    const handleEditHotel = (hotelData: TUpdateHotel) => {
        const formData = new FormData();
        if (hotelData.name) formData.append('name', hotelData.name.trim());
        if (hotelData.description) formData.append('description', hotelData.description.trim());
        if (hotelData.address) formData.append('address', hotelData.address.trim());
        if (hotelData.city) formData.append('city', hotelData.city.trim());
        if (hotelData.state) formData.append('state', hotelData.state.trim());
        if (hotelData.tags) formData.append('tags', JSON.stringify(Array.isArray(hotelData.tags) ? hotelData.tags : [hotelData.tags]));
        if (hotelData.amenities) formData.append('amenities', JSON.stringify(Array.isArray(hotelData.amenities) ? hotelData.amenities : [hotelData.amenities]));
        if (hotelData.geoLocation) formData.append('geoLocation', JSON.stringify(hotelData.geoLocation));

        const urls = hotelData.oldImages ? Array.isArray(hotelData.oldImages) ? hotelData.oldImages : [hotelData.oldImages] : [];
        formData.append('images', JSON.stringify(urls));

        if (hotelData.images && hotelData.images.length > 0) {
            hotelData.images.forEach((file) => {
                formData.append('imageFile', file);
            });
        }

        if (hotelData.checkInTime) formData.append('checkInTime', hotelData.checkInTime);
        if (hotelData.checkOutTime) formData.append('checkOutTime', hotelData.checkOutTime);
        if (hotelData.minGuestAge) formData.append('minGuestAge', hotelData.minGuestAge.toString());

        if (hotelData.petsAllowed) formData.append('petsAllowed', hotelData.petsAllowed === true ? 'true' : 'false');
        if (hotelData.outsideFoodAllowed) formData.append('outsideFoodAllowed', hotelData.outsideFoodAllowed === true ? 'true' : 'false');
        if (hotelData.idProofAccepted) formData.append('idProofAccepted', JSON.stringify(hotelData.idProofAccepted))
        if (hotelData.specialNotes) {
            formData.append('specialNotes', hotelData.specialNotes.trim());
        };

        updateHotelfn({ id: hotelData.id as string, data: formData })
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
        {
            label: "View Analytics",
            variant: "outline" as const,
            showLabel: false,
            icon: LineChartIcon,
            tooltip: 'hotel analytics',
            className: "bg-violet-50 text-violet-700 hover:bg-violet-100",
            onClick: handleHotelAnalytics,
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

                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-3 text-blue-600 font-medium">Loading hotels...</p>
                        </div>
                    </div>
                ) : hotels && hotels.length > 0 ? (
                    <div className="rounded-lg border overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={hotels}
                            actions={actions}
                            loading={isLoading}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="font-semibold text-2xl text-red-500 bg-red-100 w-full text-center py-5">
                            No hotels found. Please create one.
                        </p>
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
