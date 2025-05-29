// components/vendor/ShowHotelDetailsModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';

interface ShowHotelDetailsModalProps {
    open: boolean;
    onClose: () => void;
    data: any
    title?: string;
}

const ShowHotelDetailsModal: React.FC<ShowHotelDetailsModalProps> = ({ open, onClose, data, title = 'Hotel Details' }) => {
    if (!data) return null;

    // Keys to exclude from rendering
    const excludedKeys = ['createdAt', 'updatedAt', '__v', 'id', 'images', 'geoLocation'];

    const formatKey = (key: string) =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900">{title}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    {/* Textual details */}
                    {Object.entries(data).map(([key, value]) => {
                        if (excludedKeys.includes(key)) return null;

                        // Special render for amenities array
                        if (key === 'amenities' && Array.isArray(value)) {
                            return (
                                <div key={key} className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">{formatKey(key)}</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {value.map((amenity: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 text-xs bg-blue-100 rounded">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={key} className="flex flex-col">
                                <span className="text-sm text-muted-foreground">{formatKey(key)}</span>
                                <span className="font-medium break-words">{String(value)}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Geo Location */}
                {data.geoLocation && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Geo Location</h3>
                        <p>{data.geoLocation.join(', ')}</p>
                    </div>
                )}

                {/* Images */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Images</h3>
                    {data.images && data.images.length > 0 ? (
                        <div className="flex gap-4 flex-wrap">
                            {data.images.map((url: any, idx: any) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Hotel Image ${idx + 1}`}
                                    className="w-40 h-28 rounded-md object-cover border"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No images available.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowHotelDetailsModal;
