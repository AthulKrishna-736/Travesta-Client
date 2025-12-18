import { env } from "@/config/config"
import { showError } from "@/utils/customToast";
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useGetStaticMap = (long: number, lat: number, zoom: number, width: number, height: number, format: 'png' | 'jpg') => {
    return useQuery({
        queryKey: ['static-map', { long, lat, zoom }],
        queryFn: async () => {
            try {
                const response = await fetch(`https://api.olamaps.io/tiles/v1/styles/default-light-standard/static/${long},${lat},${zoom}/${width}x${height}.${format}?marker=${long},${lat}|red|scale:1&api_key=${env.OLA_API_SECRET}`);

                if (!response.ok) {
                    showError('Error while fetching static Image');
                    return null;
                }

                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } catch (error) {
                showError('Error fetching map');
                return null;
            }
        },
        placeholderData: keepPreviousData,
        retry: 1,
    })
}

