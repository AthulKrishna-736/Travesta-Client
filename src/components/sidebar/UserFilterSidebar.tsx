import React from "react";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";

export interface IUserFilterSidebarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;

    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;

    selectedAmenities: string[];
    toggleAmenity: (amenityId: string) => void;
    resetFilters: () => void;

    amenitiesData: { id: string; name: string }[];
    isAmenitiesLoading: boolean;

    selectedRoomTypes: string[];
    setRoomType: (type: string) => void;
}

export const PRICE_RANGES: { label: string; range: [number, number] }[] = [
    { label: "₹0 - ₹1500", range: [0, 1500] },
    { label: "₹1500 - ₹2500", range: [1500, 2500] },
    { label: "₹2500 - ₹5000", range: [2500, 5000] },
    { label: "₹5000+", range: [5000, Infinity] },
];

const ROOM_TYPES: string[] = [
    "AC",
    "Non-AC",
    "Deluxe",
    "Suite",
    "Standard",
    "Penthouse",
];

const UserFilterSidebar: React.FC<IUserFilterSidebarProps> = ({
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    selectedAmenities,
    toggleAmenity,
    resetFilters,
    amenitiesData,
    isAmenitiesLoading,
    selectedRoomTypes,
    setRoomType,
}) => {
    const isPriceSelected = (range: [number, number]) =>
        priceRange[0] === range[0] && priceRange[1] === range[1];

    return (
        <aside className="w-full lg:w-[250px] bg-white p-3 rounded-xs shadow-md">
            {/* Map implementation */}
            <div
                className="py-2 mb-4 rounded-sm h-27 flex items-end justify-center w-full shadow-sm bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("https://imgak.mmtcdn.com/pwa_v3/pwa_hotel_assets/mapEntry.png")' }}
            >
                <div className="flex justify-center border-1 border-[#0c8cec] py-1.5 rounded-md w-[90%] gap-1 bg-white">
                    <button className="uppercase text-[#0c8cec] text-xs font-bold">Explore on maps </button>
                    <MapPin className="w-3 h-4 text-[#0c8cec]" />
                </div>
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
            <div className="mb-6">
                <label className="font-semibold block mb-2">Price Range</label>
                <div className="grid grid-cols-1">
                    {PRICE_RANGES.map((price, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={isPriceSelected(price.range)}
                                onClick={() => setPriceRange(price.range)}
                            />
                            <span className='text-[#4a4a4a]'>{price.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Room Type */}
            <div className="mb-6">
                <label className="font-semibold block mb-2">Room Type</label>
                <div className="grid grid-cols-2 gap-1">
                    {ROOM_TYPES.map((type, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={selectedRoomTypes.includes(type)}
                                onClick={() => setRoomType(type)}
                            />
                            <span className='text-[#4a4a4a]'>{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
                <label className="font-semibold block mb-2">Amenities</label>
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
                                onClick={() => toggleAmenity(amenity.id)}
                            />
                            <span className='text-[#4a4a4a]'>{amenity.name}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Reset Button */}
            <button className="w-full cursor-pointer hover:bg-blue-500 py-1 hover:text-white rounded-md" onClick={resetFilters}>
                Reset Filters
            </button>
        </aside>
    );
};

export default UserFilterSidebar;
