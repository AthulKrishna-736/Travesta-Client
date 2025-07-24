import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bed, CheckCircle, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IRoom } from '@/types/user.types';
import { Button } from '@/components/ui/button';

interface RoomCardProps {
    room: IRoom;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
    const navigate = useNavigate();
    const { name, capacity, bedType, amenities, images, basePrice, isAvailable } = room;

    return (
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border-0 group h-full flex flex-col" >
            {/* Image Section */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                    src={images[0] as string || 'https://source.unsplash.com/600x400/?hotel,room'}
                    alt={name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />

                {/* Badges */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">
                    <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        4.8
                    </span>
                    {isAvailable && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Available
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
                <CardHeader className="pb-3">
                    <CardTitle className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" />
                                New York, USA
                            </p>
                        </div>
                        <span className="text-lg font-bold text-primary">
                            ₹{basePrice.toFixed(2)}
                            <span className="text-sm font-normal text-gray-500">/night</span>
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                    {/* Room Specs */}
                    <div>
                        <div className="flex gap-4 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Bed className="w-4 h-4" />
                                {bedType}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                {capacity} {capacity === 1 ? 'Guest' : 'Guests'}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                                {amenities.slice(0, 4).map((item, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                        {item}
                                    </span>
                                ))}
                                {amenities.length > 4 && (
                                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                        +{amenities.length - 4} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-lg border-primary text-primary hover:bg-primary/10"
                            onClick={() => navigate(`/user/hotels/${room.hotelId}`)}
                        >
                            View Details
                        </Button>
                        <Button
                            className="flex-1 rounded-lg bg-primary hover:bg-primary/90"
                            onClick={() => navigate(`/user/booking/${room._id}`)}
                            disabled={!isAvailable}
                        >
                            Book Now
                        </Button>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
};

export default RoomCard;
