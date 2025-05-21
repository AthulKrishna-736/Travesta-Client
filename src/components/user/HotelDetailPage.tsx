import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetUserHotel } from '@/hooks/user/useGetUserHotels';

const HotelDetail: React.FC = () => {
    const { hotelId } = useParams();
    const { data: response, isLoading, isError } = useGetUserHotel(hotelId || '');
    const hotel = response?.data;

    if (isLoading) return <p className="text-center mt-10">Loading hotel details...</p>;
    if (isError || !hotel) return <p className="text-center mt-10 text-red-600">Hotel not found.</p>;


    return (
        <>
            <main className="p-6 max-w-5xl mx-auto">
                <div className="h-80 w-full overflow-hidden">
                    {hotel.images && hotel.images.length > 0 ? (
                        <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600 text-sm">
                            No Image Available
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">{hotel.name}</h1>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            <Star className="w-5 h-5 fill-yellow-500" />
                            {hotel.rating}
                        </div>
                    </div>

                    <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {hotel.city}, {hotel.state} - {hotel.address}
                    </p>

                    <p className="text-gray-700 text-base">{hotel.description}</p>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                            {hotel?.tags?.map((tag: any, idx: any) => (
                                <Badge key={idx} variant="outline" className="rounded-full px-3 py-1 text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">Amenities</h2>
                        <ul className="list-disc ml-6 text-muted-foreground">
                            {hotel?.amenities?.map((item: any, idx: any) => <li key={idx}>{item}</li>)}
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg mb-2">Services</h2>
                        <div className="flex flex-wrap gap-2">
                            {hotel?.services?.map((service: any, idx: any) => (
                                <div key={idx} className="flex items-center gap-1 text-muted-foreground text-sm bg-accent px-3 py-1 rounded-md">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    {service}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default HotelDetail;
