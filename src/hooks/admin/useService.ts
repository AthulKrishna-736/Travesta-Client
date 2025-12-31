import { getGeoAutocomplete, getNearbyAttractions, getStaticMap, getWeatherForecast } from "@/services/otherServices";
import { useQuery } from "@tanstack/react-query"

export const useGetStaticMap = (long: number, lat: number, zoom: number, width: number, height: number, format: 'png' | 'jpg', enabled: boolean) => {
    return useQuery({
        queryKey: ["static-map", long, lat, zoom, width, height, format],
        queryFn: () => getStaticMap(long, lat, zoom, width, height, format),
        enabled: Boolean(long && lat && enabled),
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
}

export const useNearbyAttractions = (lat: number, long: number, layers: string, types: string, enabled = true) => {
    return useQuery({
        queryKey: ["nearby-attractions", lat, long, layers, types],
        queryFn: () => getNearbyAttractions(lat, long, layers, types),
        enabled: Boolean(lat && long && enabled),
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
};

export const useWeatherForecast = (latitude: number, longitude: number, checkIn: string, checkOut: string, enabled = true) => {
    return useQuery({
        queryKey: ["weather-forecast", latitude, longitude, checkIn, checkOut,],
        queryFn: () => getWeatherForecast(latitude, longitude, checkIn, checkOut),
        enabled: Boolean(latitude && longitude && checkIn && checkOut && enabled),
        staleTime: 6 * 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
};

export const useGeoAutocomplete = (searchTerm: string, enabled = true) => {
    return useQuery({
        queryKey: ["autocomplete", searchTerm.trim().toLowerCase()],
        queryFn: () => getGeoAutocomplete(searchTerm),
        enabled: Boolean(searchTerm.trim() && enabled),
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
};

