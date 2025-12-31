import React from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useNearbyAttractions } from "@/hooks/admin/useService";
import { NearbyAttractionsProps, TPlace } from "@/types/custom.types";


const NearbyAttractions: React.FC<NearbyAttractionsProps> = ({ lat, long, layers = "venue", types = "tourist_attraction", }) => {
    const { data: places, isLoading: loading } = useNearbyAttractions(lat, long, layers, types, true);

    const formatDistance = (meters: number) => {
        if (meters < 1000) {
            return `${meters}m`;
        }
        return `${(meters / 1000).toFixed(1)}km`;
    };

    const openDirections = (place: TPlace) => {
        const baseUrl = "https://www.google.com/maps/dir/?api=1";
        const address = encodeURIComponent(place.description);
        window.open(`${baseUrl}&destination=${address}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-4 sm:px-6 py-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Nearby Attractions
                </h1>
                <p className="text-sm text-gray-500">
                    {places && places.length} places around you
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 sm:px-6 py-6 pb-24">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : places && places.length > 0 ? (
                    <div className="space-y-4">
                        {places.map((place) => (
                            <div
                                key={place.place_id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="w-10 h-10 flex items-center justify-center rounded-md bg-indigo-50">
                                        <MapPin className="w-5 h-5 text-indigo-600" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {place.structured_formatting.main_text}
                                            </h3>

                                            {/* Directions Button */}
                                            <button
                                                onClick={() => openDirections(place)}
                                                className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline"
                                                title="Get Directions"
                                            >
                                                <span>Directions</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-500 truncate mt-1">
                                            {place.structured_formatting.secondary_text}
                                        </p>

                                        <div className="mt-3 text-sm text-gray-700">
                                            {formatDistance(place.distance_meters)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No nearby places found</p>
                    </div>
                )}
            </div>

            {/* Summary */}
            {places && places.length > 0 && (
                <div className="bg-white border-t px-4 sm:px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-4 justify-between">
                        <span>
                            Closest: <strong>{formatDistance(Math.min(...places.map(p => p.distance_meters)))}</strong>
                        </span>
                        <span>
                            Total: <strong>{places.length}</strong>
                        </span>
                        <span>
                            Farthest: <strong>{formatDistance(Math.max(...places.map(p => p.distance_meters)))}</strong>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NearbyAttractions;