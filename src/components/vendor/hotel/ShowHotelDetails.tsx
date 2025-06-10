import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';

interface ShowHotelDetailsModalProps {
    open: boolean;
    onClose: () => void;
    data: any;
    title?: string;
}

const ShowHotelDetailsModal: React.FC<ShowHotelDetailsModalProps> = ({ open, onClose, data, title = 'Hotel Details' }) => {
    if (!data) return null;

    const mainImage = data.images?.[0];
    const otherImages = data.images?.slice(1) || [];

    const formatKey = (key: string) =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-4xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">{title}</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-gray-500">
                        Detailed information about {data.name || 'this hotel'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6">
                    {/* Main Image */}
                    {mainImage && (
                        <div className="w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
                            <img
                                src={mainImage}
                                alt="Main Hotel Image"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Basic Information</h3>
                                <div className="space-y-2 text-sm sm:text-base">
                                    {['name', 'address', 'city', 'state'].map((key) => (
                                        data[key] && (
                                            <p key={key} className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-600 font-medium">{formatKey(key)}:</span>
                                                <span className="text-gray-800 mt-1 sm:mt-0">{String(data[key])}</span>
                                            </p>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Features</h3>
                                <div className="space-y-2 text-sm sm:text-base">
                                    {['rating', 'services', 'amenities', 'tags'].map((key) => {
                                        if (!data[key]) return null;

                                        if (['services', 'amenities', 'tags'].includes(key) && Array.isArray(data[key])) {
                                            return (
                                                <div key={key} className="flex flex-col">
                                                    <span className="text-gray-600 font-medium">{formatKey(key)}:</span>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {data[key].map((item: string, idx: number) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-700 border border-gray-200 shadow-sm"
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <p key={key} className="flex flex-col sm:flex-row sm:justify-between">
                                                <span className="text-gray-600 font-medium">{formatKey(key)}:</span>
                                                <span className="text-gray-800 mt-1 sm:mt-0">{String(data[key])}</span>
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Geo Location */}
                    {data.geoLocation && (
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Location</h3>
                            <p className="text-gray-800 text-sm sm:text-base">{data.geoLocation.join(', ')}</p>
                        </div>
                    )}

                    {/* Additional Images */}
                    {otherImages.length > 0 && (
                        <div className="mt-4 sm:mt-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">More Images</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                {otherImages.map((img: string, index: number) => (
                                    <div key={index} className="group relative overflow-hidden rounded-lg shadow-sm h-32 sm:h-40">
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