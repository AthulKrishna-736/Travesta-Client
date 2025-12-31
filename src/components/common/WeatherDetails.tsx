import React from "react";
import { Cloud, CloudRain, Sun, CloudDrizzle, CloudSnow, Wind } from "lucide-react";
import { useWeatherForecast } from "@/hooks/admin/useService";
import { IWeatherDetailsProps } from "@/types/custom.types";


const WeatherDetails: React.FC<IWeatherDetailsProps> = ({ latitude, longitude, checkIn, checkOut }) => {
    const { data: weatherData, isLoading: loading, isError: error } = useWeatherForecast(latitude, longitude, checkIn, checkOut, true);

    if (loading)
        return (
            <div className="p-4 bg-gray-100 rounded-md text-center text-gray-600 animate-pulse">
                Fetching weather data...
            </div>
        );

    if (error)
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-md text-center">
                {error}
            </div>
        );

    if (!weatherData)
        return (
            <div className="p-4 bg-gray-100 rounded-md text-center text-gray-600">
                No weather data available.
            </div>
        );

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="w-16 h-16 text-yellow-400" />;
        if (code >= 1 && code <= 3) return <Cloud className="w-16 h-16 text-gray-400" />;
        if (code >= 51 && code <= 67) return <CloudDrizzle className="w-16 h-16 text-blue-400" />;
        if (code >= 71 && code <= 77) return <CloudSnow className="w-16 h-16 text-blue-300" />;
        if (code >= 80 && code <= 99) return <CloudRain className="w-16 h-16 text-blue-500" />;
        return <Wind className="w-16 h-16 text-gray-500" />;
    };

    const getWeatherDescription = (code: number) => {
        if (code === 0) return "Clear sky";
        if (code === 1) return "Mainly clear";
        if (code === 2) return "Partly cloudy";
        if (code === 3) return "Overcast";
        if (code >= 51 && code <= 67) return "Drizzle";
        if (code >= 71 && code <= 77) return "Snow";
        if (code >= 80 && code <= 82) return "Rain showers";
        if (code >= 95 && code <= 99) return "Thunderstorm";
        return "Unknown";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        const month = date.toLocaleDateString("en-US", { month: "short" });
        const dayNum = date.getDate();
        return { day, month, dayNum };
    };

    const { daily } = weatherData;

    return (
        <div>
            <div>
                <h1 className="font-bold text-xl">Weather Details</h1>
                {/* Header */}
                <div className="border-b border-gray-200 py-4 mb-4">
                    <h1 className="text-lg" >{weatherData.timezone}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {weatherData.latitude}°N, {weatherData.longitude}°E • {weatherData.elevation}m elevation
                    </p>
                </div>

                {/* Daily Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {daily && daily.time && daily.time.map((date: string, index: number) => {
                        const { day, month, dayNum } = formatDate(date);
                        return (
                            <div
                                key={date}
                                className="bg-gradient-to-br from-sky-100 via-blue-150 to-indigo-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                {/* Date Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-2xl font-medium text-gray-800">
                                            {day}, {month} {dayNum}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {getWeatherDescription(daily.weathercode[index])}
                                        </p>
                                    </div>
                                    <div className="opacity-80">
                                        {getWeatherIcon(daily.weathercode[index])}
                                    </div>
                                </div>

                                {/* Temperature Display */}
                                <div className="flex items-end space-x-2 mb-4">
                                    <span className="text-5xl font-light text-gray-900">
                                        {Math.round(daily.temperature_2m_max[index])}°
                                    </span>
                                    <span className="text-2xl font-light text-gray-500 pb-2">
                                        / {Math.round(daily.temperature_2m_min[index])}°
                                    </span>
                                </div>

                                {/* Temperature Range Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="absolute h-full bg-gradient-to-r from-blue-400 via-orange-300 to-orange-400 rounded-full"
                                            style={{
                                                left: '0%',
                                                width: '100%'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-gray-700">
                                        <span>{Math.round(daily.temperature_2m_min[index])}°C</span>
                                        <span>{Math.round(daily.temperature_2m_max[index])}°C</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Weather guide */}
                <div className="border-t border-gray-200 py-4 mt-5">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Weather Guide</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex items-start justify-start space-x-2">
                            <Sun className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Clear/Sunny</p>
                                <p className="text-sm text-gray-500">Perfect for outdoor activities</p>
                            </div>
                        </div>
                        <div className="flex items-start justify-start space-x-2">
                            <Cloud className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Cloudy</p>
                                <p className="text-sm text-gray-500">Mild conditions, no rain</p>
                            </div>
                        </div>
                        <div className="flex items-start justify-start space-x-2">
                            <CloudDrizzle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Drizzle</p>
                                <p className="text-sm text-gray-500">Light rain, carry umbrella</p>
                            </div>
                        </div>
                        <div className="flex items-start justify-start space-x-2">
                            <CloudRain className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Rain/Storm</p>
                                <p className="text-sm text-gray-500">Heavy rain, stay indoors</p>
                            </div>
                        </div>
                        <div className="flex items-start justify-start space-x-2">
                            <CloudSnow className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Snow</p>
                                <p className="text-sm text-gray-500">Cold, wear warm clothes</p>
                            </div>
                        </div>
                        <div className="flex items-start justify-start space-x-2">
                            <Wind className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Windy</p>
                                <p className="text-sm text-gray-500">Strong winds expected</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default WeatherDetails;
