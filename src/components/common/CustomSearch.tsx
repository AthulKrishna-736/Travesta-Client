import React from 'react';

const FloatingLabelDate: React.FC<{ label: string; value: string; onChange: (val: string) => void, min?: string }> = ({ label, value, onChange, min }) => (
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
);

interface CustomSearchProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    checkIn: string;
    setCheckIn: (val: string) => void;
    checkOut: string;
    setCheckOut: (val: string) => void;
    guests: number;
    setGuests: (val: number) => void;
    onSearch: () => void;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
    searchTerm, setSearchTerm,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    guests, setGuests,
    onSearch
}) => (
    <div className="bg-white shadow-sm flex justify-center items-center p-2 py-3 sticky top-0 z-40">
        <div className="flex flex-row gap-2 w-full max-w-4xl">
            <div className="relative flex">
                <span className="absolute font-semibold top-1 left-4 text-[#757575] text-[10px] pointer-events-none">
                    Location / Hotel Name
                </span>
                <input
                    type="text"
                    placeholder="Enter someting here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-100 text-black font-semibold rounded px-3 pt-4 w-full border border-gray-300"
                />
            </div>
            <FloatingLabelDate label="CHECK-IN" value={checkIn} onChange={setCheckIn} />
            <FloatingLabelDate label="CHECK-OUT" value={checkOut} onChange={setCheckOut}
                min={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-CA") : new Date().toLocaleDateString("en-CA")}
            />
            
            <input
                type="number"
                placeholder="Guests"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-gray-100 text-black font-bold rounded px-2 w-20 placeholder-gray-500 border border-gray-300"
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


export default CustomSearch;
