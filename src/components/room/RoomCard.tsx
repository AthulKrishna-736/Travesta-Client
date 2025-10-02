import React from "react";
import { Users, BedDouble } from "lucide-react";
import { RoomCardLayoutProps } from "@/types/component.types";


const RoomCardLayout: React.FC<RoomCardLayoutProps> = ({ room, handleBookClick }) => {
    return (
        <div
            key={room.id}
            className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col"
        >
            {/* Main Room Image */}
            {room.images?.[0] && (
                <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-52 object-cover rounded-lg mb-4"
                />
            )}

            {/* Thumbnails */}
            {room.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto mb-3">
                    {room.images.slice(0, 4).map((img: string, idx: number) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Thumb ${idx}`}
                            className="w-16 h-16 object-cover rounded-md border shadow-sm"
                        />
                    ))}
                </div>
            )}

            {/* Room Info */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
                <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                    ₹{room.basePrice}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{room.guest} Guests</span>
                </div>
                <div className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4 text-purple-500" />
                    <span>{room.bedType}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-medium">Room Type: {room.roomType}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-medium">Room Count: {room.roomCount}</span>
                </div>
            </div>

            {/* Amenities */}
            {room.amenities?.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-800 mb-1">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                        {room.amenities.map((item: any) => (
                            <span
                                key={item._id}
                                className="text-xs bg-accent text-muted-foreground px-2 py-1 rounded-full border"
                            >
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Booking Section */}
            <button
                onClick={() => handleBookClick(room.id)}
                className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Book this room
            </button>
        </div>
    );
};

export default RoomCardLayout;
