import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PricingPlan } from "./PlanCard";

interface PlanDetailModalProps {
    open: boolean;
    onClose: () => void;
    plan: PricingPlan | null;
}

const PlanDetailModal: React.FC<PlanDetailModalProps> = ({ open, onClose, plan }) => {
    if (!plan) return null;

    const durationText = plan.duration >= 30
        ? `${Math.floor(plan.duration / 30)} ${Math.floor(plan.duration / 30) === 1 ? 'month' : 'months'}`
        : `${plan.duration} days`;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl px-6 py-5">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        Plan Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Review all details of this subscription plan.
                    </DialogDescription>
                </DialogHeader>

                <div className="pt-4 space-y-4 text-sm text-gray-800">
                    <h3 className="text-base font-medium text-gray-700 border-b pb-1">
                        Plan Summary
                    </h3>

                    <div className="space-y-2">
                        <p>
                            <strong className="text-gray-600">Plan Name:</strong>{" "}
                            <span className="font-medium">{plan.name}</span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Type:</strong>{" "}
                            <span className="px-3 py-1 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium">
                                {plan.type}
                            </span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Description:</strong>{" "}
                            <span className="text-gray-700">{plan.description}</span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Duration:</strong>{" "}
                            {durationText}
                        </p>
                        <p>
                            <strong className="text-gray-600">Status:</strong>{" "}
                            <span className={`font-semibold ${plan.isActive ? "text-green-600" : "text-red-500"}`}>
                                {plan.isActive ? "Active" : "Inactive"}
                            </span>
                        </p>
                        <p>
                            <strong className="text-gray-600">Plan ID:</strong>{" "}
                            <span className="text-gray-500 text-xs">{plan.id}</span>
                        </p>
                    </div>

                    <div className="border-t pt-3">
                        <strong className="text-gray-600">Features:</strong>
                        <ul className="mt-2 space-y-1 ml-4">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="text-gray-700 list-disc">
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t pt-3">
                        <p className="text-lg font-bold text-green-600">
                            Price: ₹{plan.price}
                        </p>
                    </div>
                </div>

                <DialogFooter className="pt-5">
                    <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PlanDetailModal;