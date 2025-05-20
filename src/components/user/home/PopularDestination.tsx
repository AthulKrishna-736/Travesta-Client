import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface Destination {
    id: string;
    name: string;
    country: string;
    image: string;
    properties: number;
}

const destinations: Destination[] = [
    {
        id: "1",
        name: "Paris",
        country: "France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
        properties: 3245
    },
    {
        id: "2",
        name: "New York",
        country: "United States",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        properties: 4532
    },
    {
        id: "3",
        name: "Tokyo",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1636&q=80",
        properties: 2876
    },
    {
        id: "4",
        name: "Rome",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1496&q=80",
        properties: 2143
    },
    {
        id: "5",
        name: "Bali",
        country: "Indonesia",
        image: "https://images.unsplash.com/photo-1558005137-d9619a5c539f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        properties: 1876
    },
    {
        id: "6",
        name: "Sydney",
        country: "Australia",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        properties: 1543
    },
];

const PopularDestinations = () => {
    return (
        <section className="py-16 container mx-auto px-4">
            <div className="mb-10 text-center">
                <Badge className="mb-2 bg-traveste-100 text-traveste-700 hover:bg-traveste-200">Popular Choices</Badge>
                <h2 className="text-3xl font-bold text-gray-900">Trending Destinations</h2>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    Explore our most popular destinations with thousands of properties to choose from
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination) => (
                    <Card key={destination.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-60 w-full overflow-hidden">
                            <img
                                src={destination.image}
                                alt={destination.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                <h3 className="text-xl font-semibold">{destination.name}</h3>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm">{destination.country}</span>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">{destination.properties.toLocaleString()} properties</span>
                                <a
                                    href="#"
                                    className="text-traveste-500 font-medium text-sm hover:text-traveste-700 transition-colors"
                                >
                                    Explore Hotels
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default PopularDestinations;
