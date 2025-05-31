import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HotelCardProps {
    hotel: {
        _id: string
        id: string;
        name: string;
        description: string;
        images: string[];
        rating: number;
        services: string[];
        amenities: string[];
        tags: string[];
        state: string;
        city: string;
        address: string;
    };
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
    const navigate = useNavigate();


    const { name, description, images, rating, city, state, tags, amenities, services } = hotel;

    return (
        <Card className="shadow-md hover:shadow-lg transition duration-300 rounded-2xl overflow-hidden" onClick={() => navigate(`/user/hotels/${hotel._id as string}`)}>
            {/* Image Section */}
            <div className="h-48 w-full overflow-hidden">
                <img
                    src={images[0] || 'https://source.unsplash.com/400x300/?hotel,resort'}
                    alt={name}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Info Section */}
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{name}</span>
                    <span className="flex items-center gap-1 text-yellow-500 text-sm">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        {rating.toFixed(1)}
                    </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {city}, {state}
                </p>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
                <p className="line-clamp-2 text-muted-foreground">{description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="rounded-full px-3 py-1 text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {tags.length > 3 && <span className="text-xs text-muted-foreground">+{tags.length - 3} more</span>}
                </div>

                {/* Amenities */}
                <div>
                    <p className="font-semibold">Amenities:</p>
                    <ul className="list-disc ml-5 text-muted-foreground">
                        {amenities.slice(0, 3).map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                        {amenities.length > 3 && <li>+{amenities.length - 3} more</li>}
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <p className="font-semibold">Services:</p>
                    <div className="flex flex-wrap gap-2">
                        {services.slice(0, 3).map((service, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-muted-foreground text-xs bg-accent px-2 py-1 rounded-md">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {service}
                            </div>
                        ))}
                        {services.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{services.length - 3} more</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HotelCard;
