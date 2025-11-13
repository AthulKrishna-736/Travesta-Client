import React, { useEffect, useState } from "react";
import { Users, BedDouble, Check } from "lucide-react";
import { RoomCardProps } from "@/types/component.types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


const RoomCard: React.FC<RoomCardProps> = ({ room, handleBookClick }) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user?.id);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (room.images && room.images.length > 0) {
            setImagePreview(room.images[0]);
        } else {
            console.error('No images found or count does not met', room.images);
        }
        return () => setImagePreview('');
    }, []);

    return (
        <div className="bg-white border border-[#d9d9d9] rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Side - Images (40%) */}
                <div className="md:w-2/5 p-4">
                    <div className="flex flex-col gap-3 h-full">
                        {/* Main Image */}
                        {imagePreview && (
                            <div className="flex-1 h-[200px] md:h-[280px]">
                                <img
                                    src={imagePreview}
                                    alt={room.name}
                                    className="w-full h-full object-cover rounded-lg shadow-sm"
                                />
                            </div>
                        )}

                        {/* Thumbnail Images */}
                        {room.images?.length > 1 && (
                            <div className="flex gap-2">
                                {room.images.slice(0, 4).map((img, idx) => (
                                    <div key={idx} className="flex-1">
                                        <img
                                            onMouseEnter={() => setImagePreview(img)}
                                            src={img}
                                            alt={`View ${idx + 2}`}
                                            className="w-full h-20 md:h-24 object-cover rounded-md shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-[0.5px] bg-[#d9d9d9]"></div>

                {/* Right Side - Details (60%) */}
                <div className="md:w-3/5 p-6 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">
                                {room.name}
                            </h3>
                            <span className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                                {room.roomType}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">Starting from</div>
                            <div className="text-3xl font-bold text-blue-600">
                                ₹{room.basePrice}
                            </div>
                            <h6 className="text-xs text-gray-500">Per night</h6>
                            <h6 className="text-xs text-gray-500">{room.gstPrice === 0 ? "No taxes & fees" : `+₹ ${room.gstPrice} taxes & fees`}</h6>
                        </div>
                    </div>

                    {/* Room Features */}
                    <div className="grid grid-cols-2 gap-4 mb-5 py-4 border-y border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Guests</div>
                                <div className="text-sm font-semibold text-gray-800">
                                    Up to {room.guest}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="bg-purple-50 p-2 rounded-lg">
                                <BedDouble className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Bed Type</div>
                                <div className="text-sm font-semibold text-gray-800">
                                    {room.bedType}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                            <div className="bg-amber-50 p-2 rounded-lg">
                                <div className="w-5 h-5 text-amber-600 font-bold text-center leading-5">
                                    {room.roomCount}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Available Rooms</div>
                                <div className="text-sm font-semibold text-gray-800">
                                    {room.roomCount} {room.roomCount === 1 ? 'Room' : 'Rooms'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    {room.amenities?.length > 0 && (
                        <div className="mb-5">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Amenities & Services
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {room.amenities.map((item: any) => (
                                    <span
                                        key={item._id}
                                        className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors"
                                    >
                                        <Check className="w-4 h-4 text-green-500"/>
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Book Button */}
                    <div className="flex justify-between items-center w-full gap-3">
                        {user ? (
                            <button
                                onClick={() => handleBookClick(room.id)}
                                className="w-full bg-gradient-to-r from-[#53b2fe] to-[#065af3] text-white text-xl font-bold px-6 py-3 rounded-lg shadow-sm cursor-pointer"
                            >
                                Book This Room
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/user/login")}
                                    className="text-[#028dff] font-bold cursor-pointer outline outline-[#028dff] rounded-lg py-2 px-4"
                                >
                                    Login Now
                                </button>
                                <button
                                    onClick={() => handleBookClick(room.id)}
                                    className="bg-gradient-to-r from-[#53b2fe] to-[#065af3] text-white text-xl font-bold px-6 py-2 rounded-lg shadow-sm cursor-pointer"
                                >
                                    Book This Room
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RoomCard;
