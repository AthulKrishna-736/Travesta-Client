import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CheckoutFormProps {
    open: boolean;
    onClose: () => void;
    onPaymentSuccess: () => Promise<void>;
}

const SubscriptionCheckoutForm: React.FC<CheckoutFormProps> = ({ open, onClose, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsSubmitting(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message || "Payment failed");
            setIsSubmitting(false);
        } else if (paymentIntent?.status === "succeeded") {
            try {
                await onPaymentSuccess();
                onClose();
            } catch (err) {
                console.error("Success handler failed:", err);
                setErrorMessage("Something went wrong after payment");
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md p-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Complete Your Subscription Payment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <PaymentElement />
                    {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
                    <button
                        type="submit"
                        disabled={!stripe || isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 transition"
                    >
                        {isSubmitting ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SubscriptionCheckoutForm;
