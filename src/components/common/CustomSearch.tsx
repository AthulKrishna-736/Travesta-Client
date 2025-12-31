import { useGeoAutocomplete } from '@/hooks/admin/useService';
import { ICustomSearchProps, TAutoComplete } from '@/types/custom.types';
import { useDebounce } from '@/utils/helperFunctions';
import { MapPinIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const FloatingLabelDate: React.FC<{ label: string; value: string; onChange: (val: string) => void, min?: string, className?: string }> = ({ label, value, onChange, min, className }) => {
    return (
        <div className={`relative ${className}`}>
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

const FloatingLabelSelect: React.FC<{ label: string; value: number; onChange: (val: number) => void; options: number[]; className?: string; }> = ({ label, value, onChange, options, className }) => {
    return (
        <div className={`relative ${className}`}>
            <span className="absolute font-semibold top-1 left-3 text-[#757575] text-[10px] pointer-events-none">{label}</span>
            <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="bg-gray-100 text-black font-bold rounded px-2 pt-4 w-full border border-gray-300 focus:outline-none">
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
};


const CustomSearch: React.FC<ICustomSearchProps> = ({
    searchTerm, setSearchTerm,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    setLat, setLong,
    roomCount, setRoomCount,
    guests, setGuests,
    disabled, onSearch
}) => {
    const [geoSearch, setGeoSearch] = useState(searchTerm);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const debouncedSearch = useDebounce(geoSearch, 1500);

    const { data: suggestions = [] } = useGeoAutocomplete(debouncedSearch);

    useEffect(() => {
        if (!geoSearch.trim()) {
            setShowSuggestions(false);
        }
    }, [geoSearch]);


    const handleSelectSuggestion = (item: TAutoComplete["predictions"][number]) => {
        const mainText = item.structured_formatting?.main_text || '';
        const lat = item.geometry.location.lat ?? null;
        const lng = item.geometry.location.lng ?? null;

        if (lat !== null && lng !== null) {
            setLat(lat);
            setLong(lng);
        }

        setGeoSearch(mainText);
        setSearchTerm(mainText);
        setShowSuggestions(false);
    };


    return (
        <div className="bg-white shadow-sm flex justify-center items-center p-2 py-3 sticky top-0 z-40">
            <div className="flex flex-col lg:flex-row gap-2 w-full max-w-4xl">

                <div className="relative flex-1">
                    <input
                        id="searchTerm"
                        placeholder="Where you want to stay?"
                        className="bg-gray-100 text-black font-semibold rounded px-3 pt-2 pb-1 w-full lg:w-50 border border-gray-300 text-lg placeholder:font-normal focus:outline-none"
                        value={geoSearch}
                        onChange={(e) => {
                            setGeoSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        disabled={disabled}
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
                    className='w-full px-2 lg:px-0 lg:w-45'
                    value={checkIn}
                    onChange={setCheckIn} />

                <FloatingLabelDate
                    label="CHECK-OUT"
                    className='w-full px-2 lg:px-0 lg:w-45'
                    value={checkOut}
                    onChange={setCheckOut}
                    min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA")}
                />

                <FloatingLabelSelect
                    label="ROOMS"
                    className='w-full px-2 lg:px-0 lg:w-45'
                    value={roomCount}
                    onChange={setRoomCount}
                    options={[1, 2, 3, 4, 5]}
                />

                <FloatingLabelSelect
                    label="GUESTS"
                    className='w-full px-2 lg:px-0 lg:w-45'
                    value={guests}
                    onChange={setGuests}
                    options={Array.from({ length: 10 }, (_, i) => i + 1)}
                />

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
