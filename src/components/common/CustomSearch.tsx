import { env } from '@/config/config';
import { useDebounce } from '@/utils/helperFunctions';
import { MapPinIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const FloatingLabelDate: React.FC<{ label: string; value: string; onChange: (val: string) => void, min?: string }> = ({ label, value, onChange, min }) => {
    return (
        <div className="relative flex-1 max-w-45">
            <span className="absolute font-semibold top-1 left-4 text-[#757575] text-[10px] pointer-events-none">{label}</span>
            <input
                type="date"
                value={value}
                min={min || new Date().toLocaleDateString("en-CA")}
                onChange={(e) => onChange(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="bg-gray-100 text-black font-semibold rounded px-3 pt-4 w-full border border-gray-300"
            />
        </div>
    )
};

interface CustomSearchProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    checkIn: string;
    setCheckIn: (val: string) => void;
    checkOut: string;
    setCheckOut: (val: string) => void;
    setLat: (val: number) => void;
    setLong: (val: number) => void;
    roomCount: number;
    setRoomCount: (val: number) => void;
    guests: number;
    setGuests: (val: number) => void;
    onSearch: () => void;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
    searchTerm, setSearchTerm,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    setLat, setLong,
    roomCount, setRoomCount,
    guests, setGuests,
    onSearch
}) => {
    const [geoSearch, setGeoSearch] = useState(searchTerm);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const debouncedSearch = useDebounce(geoSearch, 1500);

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const response = await fetch(
                    `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
                        debouncedSearch
                    )}&language=en&api_key=${env.OLA_API_SECRET}`
                );
                const data = await response.json();
                setSuggestions(data.predictions || []);
            } catch (err) {
                console.error("Location autocomplete failed:", err);
            }
        };

        fetchSuggestions();
    }, [debouncedSearch]);

    const handleSelectSuggestion = (item: any) => {
        const mainText = item.structured_formatting?.main_text || '';
        const lat = item.geometry.location.lat || null;
        const lng = item.geometry.location.lng || null;

        setLat(lat);
        setLong(lng);
        setGeoSearch(mainText);
        setSearchTerm(mainText);
        setShowSuggestions(false);
        setSuggestions([]);
    };


    return (
        <div className="bg-white shadow-sm flex justify-center items-center p-2 py-3 sticky top-0 z-40">
            <div className="flex flex-row gap-2 w-full max-w-4xl">

                <div className="relative flex-1">
                    <input
                        id="searchTerm"
                        placeholder="Where you want to stay?"
                        className="bg-gray-100 text-black font-semibold rounded px-3 pt-2.5 pb-1 w-full border border-gray-300 text-lg placeholder:font-normal focus:outline-none"
                        value={geoSearch}
                        onChange={(e) => {
                            setGeoSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md rounded-b-sm z-20 max-h-52 overflow-y-auto">
                            {suggestions.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-[#333]"
                                    onClick={() => handleSelectSuggestion(item)}
                                >
                                    <div className="flex gap-1 items-center text-sm font-semibold overflow-hidden">
                                        <MapPinIcon className="h-4 w-4 text-blue-500 shrink-0" />
                                        <span className="truncate block max-w-full">
                                            {item.structured_formatting.main_text}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <FloatingLabelDate
                    label="CHECK-IN"
                    value={checkIn}
                    onChange={setCheckIn} />

                <FloatingLabelDate
                    label="CHECK-OUT"
                    value={checkOut}
                    onChange={setCheckOut}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA")}
                />

                <select
                    aria-placeholder='Rooms'
                    value={roomCount}
                    onChange={(e) => setRoomCount(Number(e.target.value))}
                    className="bg-gray-100 text-black font-bold rounded px-2 w-20 border border-gray-300"
                >
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>

                <select
                    aria-placeholder='Guests'
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="bg-gray-100 text-black font-bold rounded px-2 w-20 border border-gray-300"
                >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>

                <button
                    onClick={onSearch}
                    className="bg-gradient-to-r from-blue-400 to-blue-700 text-white px-6 ml-1 rounded-sm font-bold hover:from-blue-600 hover:to-blue-800 transition uppercase"
                >
                    Search
                </button>
            </div>
        </div>
    );
}


export default CustomSearch;
