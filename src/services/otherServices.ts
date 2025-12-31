import { env } from "@/config/config";
import { TAutoComplete, TPlace, TWeather } from "@/types/custom.types";
import axios from "axios";

export const getNearbyAttractions = async (lat: number, long: number, layers: string, types: string,): Promise<TPlace[]> => {
    const response = await axios.get("https://api.olamaps.io/places/v1/nearbysearch", {
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

    return response.data?.predictions?.slice(0, 10) || [];
};

export const getStaticMap = async (long: number, lat: number, zoom: number, width: number, height: number, format: 'png' | 'jpg'): Promise<string | null> => {
    const response = await axios.get(`https://api.olamaps.io/tiles/v1/styles/default-light-standard/static/${long},${lat},${zoom}/${width}x${height}.${format}`, {
        params: {
            marker: `${long},${lat}|red|scale:1`,
            api_key: env.OLA_API_SECRET,
        },
        responseType: "blob",
    });

    const blob = response.data as Blob;
    return URL.createObjectURL(blob);
};

export const getWeatherForecast = async (latitude: number, longitude: number, checkIn: string, checkOut: string): Promise<TWeather> => {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
            latitude,
            longitude,
            daily: "temperature_2m_max,temperature_2m_min,weathercode",
            timezone: "auto",
            start_date: checkIn,
            end_date: checkOut,
        }
    });

    return response.data;
};

export const getGeoAutocomplete = async (input: string): Promise<TAutoComplete["predictions"]> => {
    const response = await axios.get("https://api.olamaps.io/places/v1/autocomplete", {
        params: {
            input,
            language: "en",
            api_key: import.meta.env.VITE_OLA_API_SECRET,
        },
    });

    return response.data.predictions ?? [];
};