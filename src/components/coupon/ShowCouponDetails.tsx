import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Percent } from "lucide-react";
import { IShowCouponDetailsModalProps } from "@/types/coupon.types";


const ShowCouponDetailsModal: React.FC<IShowCouponDetailsModalProps> = ({ open, coupon, onClose, }) => {
    if (!coupon) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full rounded-xl shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Coupon Details
                    </DialogTitle>
                    <DialogDescription>
                        View complete coupon information.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-3">

                    {/* Header Info */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">{coupon.name}</h2>
                            <p className="text-sm text-gray-500">Code: {coupon.code}</p>
                        </div>

                        <Badge
                            variant={coupon.isBlocked ? "destructive" : "default"}
                            className="px-3 py-1 text-xs"
                        >
                            {coupon.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                    </div>

                    {/* Type & Value */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <Tag className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-xs text-gray-500">Discount Type</p>
                                <p className="font-medium capitalize">{coupon.type}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <Percent className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-xs text-gray-500">Value</p>
                                <p className="font-medium">{coupon.value}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Limits */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500">Min Price</p>
                            <p className="font-medium">₹{coupon.minPrice}</p>
                        </div>

                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500">Max Price</p>
                            <p className="font-medium">₹{coupon.maxPrice}</p>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-xs text-gray-500">Start Date</p>
                                <p className="font-medium">
                                    {new Date(coupon.startDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-xs text-gray-500">End Date</p>
                                <p className="font-medium">
                                    {new Date(coupon.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Created & Updated */}
                    <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">Created At</p>
                        <p className="font-medium">
                            {new Date(coupon.createdAt).toLocaleString()}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">Last Updated</p>
                        <p className="font-medium">
                            {new Date(coupon.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowCouponDetailsModal;
