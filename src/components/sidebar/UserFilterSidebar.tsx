import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";
import UserHotelListMap from "../maps/UserHotelListMap";
import { PRICE_RANGES, RATING_RANGE, ROOM_TYPES } from "@/constants/constants";

export interface IUserFilterSidebarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;

    longitude: number;
    latitude: number;
    hotels: { hotelName: string, price: number, coordinates: [number, number] }[];

    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;

    selectedAmenities: string[];
    toggleAmenity: (amenityId: string) => void;
    resetFilters: () => void;

    amenitiesData: { id: string; name: string }[];
    isAmenitiesLoading: boolean;

    selectedRoomTypes: string[];
    setRoomType: (type: string) => void;

    selectedRating?: number;
    setRating: (type: number) => void;
}

const UserFilterSidebar: React.FC<IUserFilterSidebarProps> = ({
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    longitude,
    latitude,
    hotels,
    selectedAmenities,
    toggleAmenity,
    resetFilters,
    amenitiesData,
    isAmenitiesLoading,
    selectedRoomTypes,
    setRoomType,
    selectedRating,
    setRating
}) => {
    const mapModalRef = useRef<HTMLDialogElement | null>(null);
    const isPriceSelected = (range: [number, number]) => priceRange[0] === range[0] && priceRange[1] === range[1];
    const isRatingSelected = (value: number) => selectedRating == value;

    const handleCloseModal = () => {
        mapModalRef.current?.close();
    }

    const handleOpenModal = () => {
        mapModalRef.current?.showModal();
    }

    return (
        <aside className="w-full lg:w-[250px] bg-white p-3 rounded-xs shadow-md">
            {/* Map implementation */}
            <div
                className="py-2 mb-4 rounded-sm h-27 flex items-end justify-center w-full shadow-sm bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("https://imgak.mmtcdn.com/pwa_v3/pwa_hotel_assets/mapEntry.png")' }}
            >
                <div className="flex justify-center border-1 border-[#0c8cec] py-1.5 rounded-md w-[90%] gap-1 bg-white cursor-pointer" onClick={handleOpenModal}>
                    <h6 className="uppercase text-[#0c8cec] text-xs font-bold" >Explore on maps </h6>
                    <MapPin className="w-3 h-4 text-[#0c8cec]" />
                </div>

                <UserHotelListMap
                    mapModalRef={mapModalRef}
                    longitude={longitude}
                    latitude={latitude}
                    hotels={hotels}
                    handleCloseModal={handleCloseModal}
                />
            </div>

            {/* Search */}
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search hotels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Price Range */}
            <div>
                <label className="font-bold block mb-1">Price Range</label>
                <div className="grid grid-cols-1">
                    {PRICE_RANGES.map((price, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={isPriceSelected(price.range)}
                                onChange={() => setPriceRange(price.range)}
                            />
                            <span className='text-[#4a4a4a] text-[17px]'>{price.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-4 bg-[#d8d8d8] h-[0.5px]" />

            {/* Room Type */}
            <div>
                <label className="font-bold block mb-1">Room Type</label>
                <div className="grid grid-cols-1 gap-1">
                    {ROOM_TYPES.map((type, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={selectedRoomTypes.includes(type)}
                                onChange={() => setRoomType(type)}
                            />
                            <span className='text-[#4a4a4a] text-[17px]'>{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-4 bg-[#d8d8d8] h-[0.5px]" />

            {/* Rating */}
            <div className="mb-6">
                <label className="font-bold block mb-1">User Rating</label>
                <div className="grid grid-cols-1 gap-1">
                    {RATING_RANGE.map((r) => (
                        <div key={r.label} className="flex items-center gap-2">
                            <input type="checkbox"
                                className="w-4 h-4"
                                checked={isRatingSelected(r.value)}
                                onChange={() => setRating(r.value)}
                            />
                            <span className='text-[#4a4a4a] text-[17px]'>{r.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-4 bg-[#d8d8d8] h-[0.5px]" />

            {/* Amenities */}
            <div className="mb-6">
                <label className="font-bold block mb-1">Amenities</label>
                {isAmenitiesLoading ? (
                    <div className="flex items-center gap-2">
                        <span>Loading amenities...</span>
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                ) : (
                    amenitiesData.map((amenity) => (
                        <div key={amenity.id} className="flex items-center gap-2 mb-2">
                            <input
                                type='checkbox'
                                className="w-4 h-4"
                                checked={selectedAmenities.includes(amenity.id)}
                                onChange={() => toggleAmenity(amenity.id)}
                            />
                            <span className='text-[#4a4a4a] text-[17px]'>{amenity.name}</span>
                        </div>
                    ))
                )}
            </div>

            <div className="my-4 bg-[#d8d8d8] h-[0.5px]" />

            {/* Reset Button */}
            <button className="w-full cursor-pointer outline-1 hover:outline-none hover:bg-blue-500 py-1 hover:text-white rounded-md" onClick={resetFilters}>
                Reset Filters
            </button>
        </aside>
    );
};

export default UserFilterSidebar;
