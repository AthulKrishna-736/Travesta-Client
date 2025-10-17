import React, { useEffect, useState } from "react";
import axios from "axios";
import { env } from "@/config/config";
import { MapPin, Clock, Sparkles, TrendingUp, Navigation2 } from "lucide-react";

interface NearbyAttractionsProps {
    lat: number;
    long: number;
    layers?: string;
    types?: string;
}


const NearbyAttractions: React.FC<NearbyAttractionsProps> = ({
    lat,
    long,
    layers = "venue",
    types = "tourist_attraction",
}) => {
    const [places, setPlaces] = useState<any[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            try {
                const res = await axios.get("https://api.olamaps.io/places/v1/nearbysearch", {
                    params: {
                        layers,
                        types,
                        location: `${lat},${long}`,
                        api_key: env.OLA_API_SECRET,
                    },
                    headers: {
                        "X-Request-Id": Math.random().toString(36).substring(2, 10),
                    },
                });

                if (res.data?.predictions?.length) {
                    setPlaces(res.data.predictions.slice(0, 10));
                }
            } catch (err) {
                console.error("Error fetching nearby attractions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, [lat, long, layers, types]);
    const formatDistance = (meters: number) => {
        if (meters < 1000) {
            return `${meters}m`;
        }
        return `${(meters / 1000).toFixed(1)}km`;
    };

    const getPopularityColor = (popularity: string) => {
        const colors: { [key: string]: string } = {
            "Must Visit": "bg-red-100 text-red-700 border-red-200",
            "Very Popular": "bg-purple-100 text-purple-700 border-purple-200",
            "Trending": "bg-orange-100 text-orange-700 border-orange-200",
            "Popular": "bg-blue-100 text-blue-700 border-blue-200",
            "Local Favorite": "bg-green-100 text-green-700 border-green-200"
        };
        return colors[popularity] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative px-6 py-12 text-white">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-6 h-6" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                            Discover
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Places Near You</h1>
                    <p className="text-indigo-100 text-lg">Explore {places.length} amazing locations</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-8 pb-24">
                {loading ? (
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading attractions...</p>
                    </div>
                ) : places.length > 0 ? (
                    <div className="space-y-5">
                        {places.map((place, index) => (
                            <div
                                key={place.place_id}
                                onClick={() => setSelectedPlace(selectedPlace === place.place_id ? null : place.place_id)}
                                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 ${selectedPlace === place.place_id ? 'border-purple-500 scale-105' : 'border-transparent'
                                    }`}
                            >
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Icon Card */}
                                        <div className="flex-shrink-0 w-20 h-20 rounded-3xl shadow-md overflow-hidden">
                                            <div className={`w-full h-full bg-gradient-to-br ${['from-blue-400 to-blue-600', 'from-green-400 to-green-600',
                                                'from-orange-400 to-orange-600', 'from-purple-400 to-purple-600',
                                                'from-pink-400 to-pink-600'][index % 5]
                                                } flex items-center justify-center`}>
                                                <MapPin className="w-10 h-10 text-white drop-shadow-lg" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                    {place.structured_formatting.main_text}
                                                </h3>
                                                <div className="flex-shrink-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                    #{index + 1}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{place.structured_formatting.secondary_text}</span>
                                            </div>

                                            {/* Bottom Row */}
                                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                                                        <Navigation2 className="w-4 h-4 text-indigo-600" />
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {formatDistance(place.distance_meters)}
                                                        </span>
                                                    </div>

                                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getPopularityColor(place.popularity)}`}>
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        {place.popularity}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No places found</h3>
                        <p className="text-gray-500">Try exploring a different area</p>
                    </div>
                )}
            </div>

            {/* Summary Bar */}
            <div className="bg-white">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-lg">
                            <span className="text-gray-500 text-lg">Closest: </span>
                            <span className="font-bold text-gray-900">{formatDistance(Math.min(...places.map(p => p.distance_meters)))}</span>
                        </div>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="text-lg">
                            <span className="text-gray-500 text-lg">Total: </span>
                            <span className="font-bold text-gray-900">{places.length} places</span>
                        </div>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="text-lg">
                            <span className="text-gray-500 text-lg">Range: </span>
                            <span className="font-bold text-gray-900">{formatDistance(Math.max(...places.map(p => p.distance_meters)))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NearbyAttractions;