import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";

interface Offer {
    id: string;
    title: string;
    description: string;
    image: string;
    discount: string;
    hotelName: string;
    rating: number;
    originalPrice: number;
    discountedPrice: number;
    location: string;
}

const offers: Offer[] = [
    {
        id: "1",
        title: "Summer Special",
        description: "Enjoy 30% off on all bookings for summer getaways",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        discount: "30% OFF",
        hotelName: "Grand Plaza Resort",
        rating: 4.8,
        originalPrice: 350,
        discountedPrice: 245,
        location: "Bali, Indonesia"
    },
    {
        id: "2",
        title: "City Break",
        description: "Experience the city with our exclusive weekend deals",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        discount: "25% OFF",
        hotelName: "Metropolitan Suites",
        rating: 4.6,
        originalPrice: 280,
        discountedPrice: 210,
        location: "New York, USA"
    },
    {
        id: "3",
        title: "Romantic Getaway",
        description: "Book a special package for two with champagne on arrival",
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
        discount: "20% OFF",
        hotelName: "Serenity Beach Resort",
        rating: 4.9,
        originalPrice: 420,
        discountedPrice: 336,
        location: "Santorini, Greece"
    }
];

const SpecialOffers = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="mb-10 text-center">
                    <Badge className="mb-2 bg-traveste-100 text-traveste-700 hover:bg-traveste-200">Limited Time</Badge>
                    <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Take advantage of these exclusive deals and save on your next stay
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <Card key={offer.id} className="overflow-hidden h-full flex flex-col">
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded-full text-sm font-bold">
                                    {offer.discount}
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{offer.hotelName}</CardTitle>
                                        <CardDescription className="text-gray-500">{offer.location}</CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm">
                                        <Star className="h-3 w-3 fill-current" />
                                        <span>{offer.rating}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2 flex-grow">
                                <h3 className="font-medium text-lg mb-2">{offer.title}</h3>
                                <p className="text-gray-600 text-sm">{offer.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center pt-2">
                                <div>
                                    <span className="text-gray-500 text-sm line-through">${offer.originalPrice}</span>
                                    <span className="text-traveste-700 font-bold text-lg ml-2">${offer.discountedPrice}</span>
                                    <span className="text-gray-500 text-sm">/night</span>
                                </div>
                                <Button variant="ghost" size="sm" className="hover:text-traveste-500">
                                    View Deal <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Button className="bg-traveste-500 hover:bg-traveste-600">
                        View All Offers <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
