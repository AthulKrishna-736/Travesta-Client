import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IRoom } from "@/types/user.types";

type TRoomDetailProps = {
    open: boolean;
    data: IRoom;
    onClose: () => void;
};

const ShowRoomDetailsModal: React.FC<TRoomDetailProps> = ({ open, data, onClose }) => {
    const mainImage = data.images?.[0];
    const otherImages = data.images?.slice(1) || [];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">Room Details</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Detailed information about {data.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Main Image */}
                    {mainImage && (
                        <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden shadow-md">
                            <img
                                src={typeof mainImage === "string" ? mainImage : URL.createObjectURL(mainImage)}
                                alt={`Main Room Image`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Information</h3>
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Name:</span>
                                        <span className="text-gray-800">{data.name}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Bed Type:</span>
                                        <span className="text-gray-800 capitalize">{data.bedType}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Capacity:</span>
                                        <span className="text-gray-800">{data.capacity} person(s)</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Pricing</h3>
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Base Price:</span>
                                        <span className="text-gray-800">₹{data.basePrice.toLocaleString()}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-600 font-medium">Availability:</span>
                                        <span className={`font-medium ${data.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                            {data.isAvailable ? "Available" : "Not Available"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.amenities.map((amenity, index) => (
                                    <span
                                        key={index}
                                        className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200 shadow-sm"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Images */}
                    {otherImages.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">More Images</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {otherImages.map((img, index) => {
                                    const src = typeof img === "string" ? img : URL.createObjectURL(img);
                                    return (
                                        <div key={index} className="group relative overflow-hidden rounded-lg shadow-sm h-40">
                                            <img
                                                src={src}
                                                alt={`Room Image ${index + 2}`}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowRoomDetailsModal;