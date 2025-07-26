import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddWalletCredit } from "@/hooks/user/useWallet";
import { useNavigate } from "react-router-dom";

interface CheckoutFormProps {
    open: boolean;
    onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ open, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const { mutateAsync: addCredit, isPending } = useAddWalletCredit();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message || "Payment failed");
        } else if (paymentIntent?.status === "succeeded") {
            try {
                await addCredit(paymentIntent.amount / 100);
                onClose();
                navigate("/user/wallet");
            } catch (err) {
                console.error("Error logging credit:", err);
                setErrorMessage("Failed to log wallet credit");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent
                className="max-w-md p-0"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Complete Your Payment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <PaymentElement />
                    </div>

                    {errorMessage && (
                        <div className="text-red-600">{errorMessage}</div>
                    )}

                    <button
                        type="submit"
                        disabled={!stripe || isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 transition"
                    >
                        {isPending ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutForm;
