import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentSelectionModalProps {
    open: boolean;
    onClose: () => void;
    walletBalance?: number;
    onSelect: (method: "online" | "wallet") => void;
}

const PaymentSelectionModal: React.FC<PaymentSelectionModalProps> = ({ open, onClose, onSelect, walletBalance }) => {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Select Payment Method</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-4">
                    <button
                        onClick={() => onSelect("online")}
                        className="flex items-center gap-3 border rounded-lg p-3 hover:bg-blue-50 transition"
                    >
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Pay Online (Stripe)
                    </button>

                    <button
                        onClick={() => onSelect("wallet")}
                        className="flex items-center gap-3 border rounded-lg p-3 hover:bg-blue-50 transition"
                    >
                        <Wallet className="w-5 h-5 text-green-600" />
                        Pay Using Wallet {`(${walletBalance?.toFixed(2)})`}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentSelectionModal;
