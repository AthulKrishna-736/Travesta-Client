import React, { useEffect, useState } from "react";
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
    room: { _id: string, basePrice: number, name: string };
    isBlocked: boolean;
}

interface HotelCardProps {
    hotel: IHotel;
    checkIn: string;
    checkOut: string;
    guests: number;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, checkIn, checkOut, guests }) => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string>('');

    const { id, name, description, images, amenities, rating, state, city, room } = hotel;

    const handleSetPreviewImage = (img: string) => {
        setImagePreview(img);
    }

    useEffect(() => {
        if (images && images.length > 0) {
            setImagePreview(images[0]);
        } else {
            console.error('No images found or count does not met', images);
        }
        return () => setImagePreview('');
    }, []);


    return (
        <div className="bg-white rounded-xs w-full h-55 flex p-4 my-4 outline-1 outline-[#e1e1e1] hover:outline-[#0084ff]">

            {/* image section */}
            <div className="w-52 h-33">
                <img src={imagePreview} alt='HotelImage' className="h-full w-full object-cover rounded-sm" />
                <div className="h-11 w-full flex my-1 justify-between ">
                    {images && images.length > 0 && images.slice(0, 3).map((i, index) => {
                        return <img className="h-full w-12 object-cover rounded-sm cursor-pointer" key={i} src={i} alt={`${index} Image`} onMouseEnter={() => handleSetPreviewImage(i)} />
                    })}
                    {images && images.length > 3 && (
                        <div className="relative h-full w-12">
                            <img
                                className="h-full w-full object-cover rounded-sm blur-[0.5px]"
                                src={images[4]}
                                alt="extra images"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-sm cursor-pointer">
                                <span className="text-white text-[10px] font-semibold">View All</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* hotel details */}
            <div className="px-4 mx-2 flex-1 flex flex-col border-r border-gray-400">
                <h1 className="text-lg font-bold mb-2">{name}</h1>

                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#000000]" />
                    <h6 className="text-[#0084ff] text-sm font-semibold">
                        {city},
                        <span className="text-[#4a4a4a] font-light mx-1">{state}</span>
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
            <div className="px-2 ml-4 flex flex-col justify-between items-end">
                {/* rating */}
                <div className="flex flex-col items-end">
                    <div className="flex gap-2">
                        <h3 className="text-[#0b58b4] font-bold">Excellent</h3>
                        <h6 className="bg-[#0b58b4] font-bold px-1 rounded-sm text-white">{rating}</h6>
                    </div>
                    <p className="text-[#4a4a4a] text-sm">{`(${rating} Ratings)`}</p>
                </div>

                <div>
                    <h1 className="font-bold text-xl text-right">
                        ₹ {room.basePrice}
                    </h1>
                    <p className="text-sm text-[#4a4a4a] text-right">+₹ 1234 taxes & fees</p>
                    <p className="text-sm text-[#4a4a4a] text-right">Per Night</p>
                </div>

                <div className="flex gap-1">
                    <button
                        className="text-[#0084ff] py-1 rounded-sm font-semibold cursor-pointer"
                        onClick={() => navigate(`/user/hotels/${id}?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guests)}`)}
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
