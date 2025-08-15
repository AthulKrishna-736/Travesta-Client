import React, { useState } from 'react';

const FloatingLabelDate: React.FC<{ label: string }> = ({ label }) => {
    const [value, setValue] = useState("");

    return (
        <div className="relative flex-1">
            <span className="absolute top-1 left-4 text-gray-400 text-xs pointer-events-none">
                {label}
            </span>
            <input
                type="date"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="bg-gray-100 text-black font-bold rounded px-4 pt-5 pb-2 w-full border border-gray-300"
            />
        </div>
    );
};

const CustomSearch: React.FC = () => {
    return (
        <div className='bg-white shadow-lg flex justify-center p-3 sticky top-0 z-10'>
            <div className="flex flex-row gap-2">
                {/* Location / Hotel Name */}
                <input
                    type="text"
                    placeholder="Location / Hotel Name"
                    className="bg-gray-100 text-black font-bold rounded px-4 py-3 flex-1 placeholder-gray-400 border border-gray-300"
                />

                {/* Check-in */}
                <FloatingLabelDate label="CHECK-IN" />

                {/* Check-out */}
                <FloatingLabelDate label="CHECK-OUT" />

                {/* Guests */}
                <input
                    type="number"
                    placeholder="Guests"
                    min="1"
                    className="bg-gray-100 text-black font-bold rounded px-4 py-3 w-24 placeholder-gray-500 border border-gray-300"
                />

                {/* Search Button */}
                <button className="bg-gradient-to-r from-blue-400 to-blue-700 text-white px-15 ml-4 rounded-lg font-bold hover:from-blue-600 hover:to-blue-800 transition uppercase">
                    Search
                </button>
            </div>
        </div>
    );
};

export default CustomSearch;
