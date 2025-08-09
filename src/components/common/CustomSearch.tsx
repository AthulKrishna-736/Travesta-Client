import React from 'react';

const CustomSearch: React.FC = () => {
    return (
        <div className="bg-white shadow-md p-4 m-4 flex flex-row items-center gap-2">
            {/* Location / Hotel Name */}
            <input
                type="text"
                placeholder="Location / Hotel Name"
                className="bg-gray-100 text-black font-bold rounded px-4 py-3 flex-1 placeholder-gray-500"
            />

            {/* Check-in */}
            <input
                type="date"
                onClick={(e) => {
                    const event = e.currentTarget;
                    event.showPicker?.()
                }}
                className="bg-gray-100 text-black font-bold rounded px-4 py-3 flex-1 placeholder-gray-500"
            />

            {/* Check-out */}
            <input
                type="date"
                onClick={(e) => {
                    const event = e.currentTarget;
                    event.showPicker?.()
                }}
                className="bg-gray-100 text-black font-bold rounded px-4 py-3 flex-1 placeholder-gray-500"
            />

            {/* Guests */}
            <input
                type="number"
                placeholder="Guests"
                min="1"
                className="bg-gray-100 text-black font-bold rounded px-4 py-3 w-24 placeholder-gray-500"
            />

            {/* Search Button */}
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition">
                Search
            </button>
        </div>
    );
};

export default CustomSearch;
