import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PlanHistoryDetailModalProps {
    open: boolean;
    onClose: () => void;
    history: any | null;
}

const PlanHistoryDetailModal: React.FC<PlanHistoryDetailModalProps> = ({ open, onClose, history }) => {
    if (!history) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl px-6 py-5">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Subscription History Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed view of this user’s subscription record.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 text-gray-700">
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-500">User:</span>
                        <span className="text-gray-900">{history.firstName}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-500">Email:</span>
                        <span className="text-gray-900">{history.email}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-500">Plan:</span>
                        <span className="text-gray-900">{history.subscriptionName}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-500">Type:</span>
                        <span className="text-gray-900">{history.subscriptionType}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-500">Amount:</span>
                        <span className="text-green-600 font-semibold">₹{history.paymentAmount}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-500">Valid From:</span>
                        <span className="text-gray-900">{new Date(history.validFrom).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-500">Valid Until:</span>
                        <span className="text-gray-900">{new Date(history.validUntil).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-500">Status:</span>
                        <span className={history.isActive ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                            {history.isActive ? "Active" : "Inactive"}
                        </span>
                    </p>
                </div>

                <DialogFooter className="pt-5">
                    <Button onClick={onClose} variant="secondary">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PlanHistoryDetailModal;
