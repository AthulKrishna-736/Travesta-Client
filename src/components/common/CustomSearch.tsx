import React from 'react';


const FloatingLabelDate: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div className="relative flex-1">
        <span className="absolute top-1 left-4 text-gray-400 text-xs pointer-events-none">{label}</span>
        <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="bg-gray-100 text-black font-bold rounded px-4 pt-5 pb-2 w-full border border-gray-300"
        />
    </div>
);

// CustomSearch.tsx
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
    <div className="bg-white shadow-lg flex justify-center p-3 sticky top-0 z-10">
        <div className="flex flex-row gap-2 w-full">
            <input
                type="text"
                placeholder="Location / Hotel Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 text-black font-bold rounded px-4 py-3 flex-1 placeholder-gray-400 border border-gray-300"
            />
            <FloatingLabelDate label="CHECK-IN" value={checkIn} onChange={setCheckIn} />
            <FloatingLabelDate label="CHECK-OUT" value={checkOut} onChange={setCheckOut} />
            <input
                type="number"
                placeholder="Guests"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-gray-100 text-black font-bold rounded px-4 py-3 w-24 placeholder-gray-500 border border-gray-300"
            />
            <button
                onClick={onSearch}
                className="bg-gradient-to-r from-blue-400 to-blue-700 text-white px-15 ml-4 rounded-lg font-bold hover:from-blue-600 hover:to-blue-800 transition uppercase"
            >
                Search
            </button>
        </div>
    </div>
);


export default CustomSearch;
