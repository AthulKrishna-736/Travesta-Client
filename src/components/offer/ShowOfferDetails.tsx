import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Percent, Building2 } from "lucide-react";
import { IShowOfferDetailsModalProps } from "@/types/offer.types";


const ShowOfferDetailsModal: React.FC<IShowOfferDetailsModalProps> = ({ open, offer, onClose, }) => {
    if (!offer) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full rounded-xl shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Offer Details
                    </DialogTitle>
                    <DialogDescription>
                        View complete offer information.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-3">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Room Type Offer</h2>
                            <p className="text-sm text-gray-500">
                                Vendor ID: {offer.vendorId}
                            </p>
                        </div>

                        <Badge
                            variant={offer.isBlocked ? "destructive" : "default"}
                            className="px-3 py-1 text-xs"
                        >
                            {offer.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                    </div>

                    {/* Hotel ID */}
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-xs text-gray-500">Hotel ID</p>
                            <p className="font-medium">
                                {offer.hotelId ? offer.hotelId : "All Hotels"}
                            </p>
                        </div>
                    </div>

                    {/* Room Type */}
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                        <Tag className="w-5 h-5 text-purple-600" />
                        <div>
                            <p className="text-xs text-gray-500">Room Type</p>
                            <p className="font-medium">{offer.roomType}</p>
                        </div>
                    </div>

                    {/* Discount Type & Value */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <Percent className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-xs text-gray-500">Discount Type</p>
                                <p className="font-medium capitalize">{offer.discountType}</p>
                            </div>
                        </div>

                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500">Discount Value</p>
                            <p className="font-medium">{offer.discountValue}</p>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-xs text-gray-500">Start Date</p>
                                <p className="font-medium">
                                    {new Date(offer.startDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-xs text-gray-500">End Date</p>
                                <p className="font-medium">
                                    {new Date(offer.expiryDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Created & Updated */}
                    <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">Created At</p>
                        <p className="font-medium">
                            {new Date(offer.createdAt).toLocaleString()}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">Last Updated</p>
                        <p className="font-medium">
                            {new Date(offer.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowOfferDetailsModal;
