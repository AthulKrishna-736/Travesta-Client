import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserSubscriptionRow } from "@/types/plan.types";

interface PlanHistoryDetailModalProps {
    open: boolean;
    onClose: () => void;
    history: UserSubscriptionRow | null;
}

const PlanHistoryDetailModal: React.FC<PlanHistoryDetailModalProps> = ({ open, onClose, history }) => {
    if (!history) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Subscription Details
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4 text-sm">

                    {/* User */}
                    <div>
                        <p className="text-gray-500">User</p>
                        <p className="font-medium text-gray-900">
                            {history.firstName}
                        </p>
                        <p className="text-gray-500">{history.email}</p>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Plan */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500">Plan</p>
                            <p className="font-medium">{history.subscriptionName}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Type</p>
                            <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                {history.subscriptionType}
                            </span>
                        </div>

                        <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-semibold text-green-600">
                                ₹{history.paymentAmount}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Status</p>
                            <span
                                className={`inline-block rounded-md px-2 py-1 text-sm font-medium ${history.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {history.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Validity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500">Valid From</p>
                            <p className="font-medium">
                                {new Date(history.validFrom).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Valid Until</p>
                            <p className="font-medium">
                                {new Date(history.validUntil).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PlanHistoryDetailModal;
