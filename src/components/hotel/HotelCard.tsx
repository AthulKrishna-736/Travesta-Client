import React from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IHotel {
    id: string;
    name: string;
    description: string;
    images: string[];
    rating: number;
    amenities: { _id: string; name: string }[];
    city: string;
    state: string;
    address: string;
    startingPrice: number;
    isBlocked: boolean;
}

interface HotelCardProps {
    hotel: IHotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
    const navigate = useNavigate();
    const { id, name, description, images, amenities, rating, state, city, startingPrice } = hotel;

    return (
        <div className="bg-white rounded-sm w-full h-45 flex p-4 hover:outline-1 outline-[#0084ff]">

            {/* image section */}
            <div className="w-40 shadow-md">
                <img src={images[0]} alt='HotelImage' className="h-full w-full object-cover rounded-xs" />
            </div>

            {/* hotel details */}
            <div className="px-4 mx-2 flex-1 flex flex-col border-r border-gray-400">
                <h1 className="text-xl font-bold mb-2">{name}</h1>

                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0a81f0]" />
                    <h6 className="text-[#4a4a4a] text-sm font-semibold">
                        {state},
                        <span className="text-[#4a4a4a] font-light mx-1">{city}</span>
                    </h6>
                </div>

                <p className="text-[#8b572a] text-sm truncate">  {description.length > 50 ? description.slice(0, 50) + "..." : description}</p>

                {/* amenities */}
                <div className="mt-auto flex gap-4 py-2">
                    {amenities.map((a) => (
                        <h6
                            key={a._id}
                            className="border border-[#1d64ec] rounded-2xl p-1 px-2 text-sm text-[#1d64ec]"
                        >
                            #{a.name}
                        </h6>
                    ))}
                </div>
            </div>

            {/* price, detail and rating */}
            <div className="px-2 mx-1 flex flex-col justify-between items-end">
                {/* rating */}
                <div className="flex gap-2">
                    <h3 className="text-[#0b58b4] font-bold">Excellent</h3>
                    <h6 className="bg-[#0b58b4] font-bold px-1 rounded-sm text-white">{rating}</h6>
                </div>

                <div>
                    <h1 className="font-bold text-2xl">
                        ₹{startingPrice}
                    </h1>
                    <p className="text-sm font-semibold text-[#4a4a4a] text-right">Per Night</p>
                </div>

                <div className="flex gap-1">
                    <button
                        className="text-[#0084ff] py-1 rounded-sm font-semibold cursor-pointer"
                        onClick={() => navigate(`/user/hotels/${id}`)}
                    >
                        View Details
                    </button>
                    <ArrowRight className="h-4 w-4 mt-[8px] text-[#0a81f0]" />
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
