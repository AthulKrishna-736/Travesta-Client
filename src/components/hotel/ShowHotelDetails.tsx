import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import StaticMap from '../maps/StaticMap';
import { IHotel } from '@/types/hotel.types';

interface ShowHotelDetailsModalProps {
    open: boolean;
    onClose: () => void;
    data: IHotel;
    title?: string;
}

const ShowHotelDetailsModal: React.FC<ShowHotelDetailsModalProps> = ({ open, onClose, data, title = 'Hotel Details', }) => {
    if (!data) return null;

    const mainImage = data.images?.[0];
    const otherImages = data.images?.slice(1) || [];
    const basicFields: (keyof IHotel)[] = ['name', 'address', 'city', 'state'];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-4xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-gray-500">
                        Detailed information about {data.name || 'this hotel'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6">
                    {/* Main Image */}
                    {mainImage && (
                        <div className="w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden shadow-md bg-gray-300 relative flex items-center justify-center">
                            {/* Spinner */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                            </div>

                            <img
                                src={mainImage}
                                alt="Main Hotel Image"
                                onLoad={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                    const spinner = e.currentTarget.previousElementSibling;
                                    if (spinner) spinner.setAttribute('hidden', 'true');
                                }}
                                className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                            />
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="flex flex-col gap-4">
                        <div className="space-y-4">
                            <div className="bg-gray-300 p-3 sm:p-4 rounded-lg">
                                <h3 className="text-base sm:text-lg font-semibold  mb-2 sm:mb-3">
                                    Basic Information
                                </h3>
                                <div className="space-y-2 text-sm sm:text-base">
                                    {basicFields.map((key) =>
                                        data[key] && (
                                            <p
                                                key={key}
                                                className="flex flex-col sm:flex-row sm:justify-between"
                                            >
                                                <span className="text-gray-600 font-medium uppercase">{key}:</span>
                                                <span className="font-semibold mt-1 sm:mt-0">{String(data[key])}</span>
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-green-200 p-3 sm:p-4 rounded-lg">
                                <div className="space-y-2 text-sm sm:text-base">
                                    {(['amenities', 'tags'] as (keyof IHotel)[]).map((key) => {
                                        if (!data[key]) return null;

                                        if (['amenities', 'tags'].includes(key)) {
                                            const values = Array.isArray(data[key]) ? data[key].map((item: any) => key === 'amenities' ? item.name : item) : [];

                                            return (
                                                <div key={key} className="flex flex-col">
                                                    <span className="font-medium uppercase">
                                                        {key}:
                                                    </span>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {values.map((item: string, idx: number) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                                                            >
                                                                {item.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Rules Section */}
                    {data.propertyRules && (
                        <div className="bg-yellow-100 p-3 sm:p-4 rounded-lg mb-4">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 uppercase">
                                Property Rules
                            </h3>

                            <div className="space-y-1 text-sm sm:text-base">
                                <p><strong>Check-in Time:</strong> {data.propertyRules.checkInTime || "N/A"}</p>
                                <p><strong>Check-out Time:</strong> {data.propertyRules.checkOutTime || "N/A"}</p>
                                <p><strong>Minimum Guest Age:</strong> {data.propertyRules.minGuestAge || "N/A"}</p>
                                <p><strong>Pets Allowed:</strong> {data.propertyRules.petsAllowed ? "Yes" : "No"}</p>
                                <p><strong>Outside Food Allowed:</strong> {data.propertyRules.outsideFoodAllowed ? "Yes" : "No"}</p>

                                {data.propertyRules.idProofAccepted?.length > 0 && (
                                    <p>
                                        <strong>ID Proofs Accepted:</strong> {data.propertyRules.idProofAccepted.join(", ")}
                                    </p>
                                )}

                                {data.propertyRules.specialNotes && (
                                    <div className="mt-2">
                                        <strong>Special Notes:</strong>
                                        <p className="whitespace-pre-line mt-1 text-gray-700">
                                            {data.propertyRules.specialNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Geo Location */}
                    {data.geoLocation && (
                        <div className="bg-blue-200 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 uppercase">
                                Location
                            </h3>
                            <div className='flex justify-around font-semibold'>
                                <span>Long: {data.geoLocation.coordinates[0]}</span>
                                <span>Lat: {data.geoLocation.coordinates[1]}</span>
                            </div>

                            <div>
                                <StaticMap
                                    long={data.geoLocation.coordinates[0]}
                                    lat={data.geoLocation.coordinates[1]}
                                    zoom={17}
                                    height={720}
                                    width={1280}
                                    format='png'
                                />
                            </div>
                        </div>
                    )}

                    {/* Additional Images */}
                    {otherImages.length > 0 && (
                        <div className="mt-4 sm:mt-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                                More Images
                            </h3>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {otherImages.map((img: string, index: number) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-lg shadow-sm h-32 sm:h-40"
                                    >
                                        <img
                                            src={img}
                                            alt={`Hotel Image ${index + 2}`}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowHotelDetailsModal;
