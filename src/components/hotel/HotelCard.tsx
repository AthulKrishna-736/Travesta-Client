import React, { useEffect, useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RATINGS } from "@/constants/constants";
import { HotelCardProps } from "@/types/hotel.types";


const HotelCard: React.FC<HotelCardProps> = ({ hotel, roomsCount, guests, geoSearch }) => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [imagePreview, setImagePreview] = useState<string>('');
    const [showBreakdown, setShowBreakdown] = useState(false);

    const checkIn = params.get('checkIn') || '';
    const checkOut = params.get('checkOut') || '';
    const rooms = Number(params.get('rooms')) || 1;
    const adults = Number(params.get('adults')) || 1;
    const children = Number(params.get('children')) || 0;

    const { id, name, description, images, amenities, state, rating, city, room } = hotel;

    const ratingMetrics = [
        { label: "Hospitality", value: rating.averages.hospitality },
        { label: "Cleanliness", value: rating.averages.cleanliness },
        { label: "Facilities", value: rating.averages.facilities },
        { label: "Room Quality", value: rating.averages.room },
        { label: "Value for Money", value: rating.averages.moneyValue }
    ];

    const getRatingLabel = (rating: number): string => {
        const match = RATINGS.find(r => rating >= r.min);
        return match ? match.label : "Unrated";
    };

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
    }, [images]);

    const handleCardClick = () => {
        const queryParams = new URLSearchParams({
            location: geoSearch,
            checkIn: checkIn,
            checkOut: checkOut,
            rooms: roomsCount ? roomsCount.toString() : rooms.toString(),
            adults: guests ? guests.toString() : adults.toString(),
            children: children.toString(),
        });
        navigate(`/user/hotels/${id}/${room.id}?${queryParams.toString()}`);
    }

    return (
        <div className="bg-white rounded-xs w-full flex flex-col lg:flex-row p-4 my-4 outline-1 outline-[#e1e1e1] hover:outline-[#0084ff] h-auto lg:h-55">
            {/* image section */}
            <div className="w-full lg:w-52 flex-shrink-0">
                <div className="w-full h-35 lg:h-33">
                    <img
                        src={imagePreview}
                        alt="HotelImage"
                        loading="lazy"
                        className="h-full w-full object-cover rounded-sm"
                    />
                </div>

                <div className="h-11 w-full flex my-1 gap-1 overflow-x-auto lg:overflow-visible">
                    {images && images.length > 0 && images.slice(0, 3).map((i, index) => (
                        <img key={i} src={i} alt={`${index} Image`} loading="lazy" className="h-full w-12 object-cover rounded-sm cursor-pointer flex-shrink-0" onMouseEnter={() => handleSetPreviewImage(i)} />
                    ))}

                    {images && images.length > 3 && (
                        <div className="relative h-full w-12 flex-shrink-0">
                            <img src={images[4]} loading="lazy" alt="extra images" className="h-full w-full object-cover rounded-sm blur-[0.5px]" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-sm cursor-pointer">
                                <span className="text-white text-[10px] font-semibold">
                                    View All
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* hotel details */}
            <div className="px-0 lg:px-4 mx-0 lg:mx-2 flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-400 mt-3 lg:mt-0">
                <div>
                    <h1 className="text-sm md:text-lg font-bold mb-2">{name}</h1>

                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-black" />
                        <h6 className="text-[#0084ff] text-xs md:text-sm font-semibold">
                            {city},
                            <span className="text-[#4a4a4a] font-light mx-1">
                                {state}
                            </span>
                        </h6>
                    </div>

                    <p className="text-[#8b572a] text-xs md:text-sm whitespace-normal break-words overflow-hidden">
                        {description.length > 100 ? description.slice(0, 115) + "..." : description}
                    </p>
                </div>

                {/* amenities */}
                <div className="flex gap-1 py-2 flex-wrap">
                    {amenities.slice(0, 3).map((a) => (
                        <h6 key={a._id} className="border border-[#1d64ec] rounded-2xl p-1 px-2 text-[10px] md:text-[14px] font-semibold text-[#1d64ec]">
                            {a.name}
                        </h6>
                    ))}
                </div>
            </div>

            {/* price, detail and rating */}
            <div className="px-0 lg:px-2 mt-4 lg:mt-0 flex flex-col justify-between items-start lg:items-end">
                {/* rating */}
                <div
                    className="relative flex flex-col items-start lg:items-end"
                    onMouseEnter={() => setShowBreakdown(true)}
                    onMouseLeave={() => setShowBreakdown(false)}
                >
                    <div className="flex gap-2 cursor-pointer">
                        <h3 className="text-[#0b58b4] font-bold">
                            {getRatingLabel(rating.averageRating)}
                        </h3>
                        <h6 className="bg-[#0b58b4] font-bold px-1 rounded-sm text-white">
                            {rating.averageRating.toFixed(1)}
                        </h6>
                    </div>

                    <p className="text-[#4a4a4a] text-sm">
                        ({rating.totalRatings} Ratings)
                    </p>

                    {/* hover popup rating */}
                    {showBreakdown && (
                        <div className="absolute top-full lg:top-10 xs:left-0 md:right-0 z-20 bg-white border shadow-lg rounded-lg p-4 w-70 text-xs">
                            <h3 className="font-semibold mb-3 text-sm text-black">
                                Hotel Rating Breakdown
                            </h3>

                            {ratingMetrics.map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex justify-between items-center mb-2"
                                >
                                    <span className="text-gray-600">
                                        {label}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#0d92ff]"
                                                style={{ width: `${(value / 5) * 100}%`, }}
                                            />
                                        </div>
                                        <span className="font-medium w-8 text-black">
                                            {value.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* pricing */}
                <div className="text-left lg:text-right mt-3 lg:mt-0">
                    {room.discountedPrice !== room.basePrice ? (
                        <>
                            <h1 className="text-lg text-gray-500 line-through">
                                ₹ {room.basePrice}
                            </h1>
                            <h1 className="font-bold text-2xl">
                                ₹ {room.discountedPrice}
                            </h1>
                        </>
                    ) : (
                        <h1 className="font-bold text-2xl">
                            ₹ {room.basePrice}
                        </h1>
                    )}

                    <p className="text-sm text-[#4a4a4a]">
                        {room.gstPrice === 0 ? "No taxes & fees" : `+₹ ${room.gstPrice} taxes & fees`}
                    </p>

                    <p className="text-sm text-[#4a4a4a]">Per Night</p>
                </div>

                {/* CTA */}
                <div className="flex gap-1 items-center mt-2">
                    <button
                        className="text-[#0084ff] rounded-sm font-semibold cursor-pointer"
                        onClick={handleCardClick}
                    >
                        View Details
                    </button>
                    <ArrowRight className="h-4 w-4 text-[#0a81f0]" />
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
