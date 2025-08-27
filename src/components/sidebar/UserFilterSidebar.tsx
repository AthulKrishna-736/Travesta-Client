import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface IUserFilterSidebarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;

    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;

    selectedAmenities: string[];
    toggleAmenity: (amenityId: string) => void;
    resetFilters: () => void;

    amenitiesData: { _id: string; name: string }[];
    isAmenitiesLoading: boolean;

    selectedRoomTypes: string[];
    setRoomType: (type: string) => void;
}

const PRICE_RANGES: { label: string; range: [number, number] }[] = [
    { label: "₹0 - ₹2,000", range: [0, 2000] },
    { label: "₹2,001 - ₹4,000", range: [2001, 4000] },
    { label: "₹4,001 - ₹6,000", range: [4001, 6000] },
    { label: "₹6,001 - ₹8,000", range: [6001, 8000] },
    { label: "₹8,001 - ₹10,000", range: [8001, 10000] },
    { label: "₹10,000+", range: [10001, Infinity] },
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
        <aside className="w-full lg:w-[350px] bg-white p-4 rounded-xl shadow-md">
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
                <div className="grid grid-cols-2 gap-2.4">
                    {PRICE_RANGES.map((price, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                            <Checkbox
                                checked={isPriceSelected(price.range)}
                                onCheckedChange={() => setPriceRange(price.range)}
                            />
                            <span>{price.label}</span>
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
                            <Checkbox
                                checked={selectedRoomTypes.includes(type)}
                                onCheckedChange={() => setRoomType(type)}
                            />
                            <span>{type}</span>
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
                        <div key={amenity._id} className="flex items-center gap-2 mb-2">
                            <Checkbox
                                checked={selectedAmenities.includes(amenity._id)}
                                onCheckedChange={() => toggleAmenity(amenity._id)}
                            />
                            <span>{amenity.name}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Reset Button */}
            <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset Filters
            </Button>
        </aside>
    );
};

export default UserFilterSidebar;
