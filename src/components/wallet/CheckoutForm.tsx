import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface CheckoutFormProps {
    open: boolean;
    onClose: () => void;
    onPaymentSuccess: (data: PaymentSuccessData) => Promise<void>;
    isForBooking?: boolean;
    receiverId?: string;
    bookingId?: string;
}

export type PaymentSuccessData =
    | {
        type: "wallet";
        amount: number;
        transactionId: string;
    } | {
        type: "booking";
        amount: number;
        transactionId: string;
        receiverId: string;
        description: string;
        relatedBookingId: string;
    };


const CheckoutForm: React.FC<CheckoutFormProps> = ({ open, onClose, onPaymentSuccess, isForBooking, receiverId, bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsSubmitting(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message || "Payment failed");
            setIsSubmitting(false);
        } else if (paymentIntent?.status === "succeeded") {
            try {
                const paymentData: PaymentSuccessData =
                    isForBooking
                        ? {
                            type: "booking",
                            amount: paymentIntent.amount / 100,
                            transactionId: paymentIntent.id,
                            receiverId: receiverId!,
                            description: "Payment for booking successfull",
                            relatedBookingId: bookingId!,
                        }
                        : {
                            type: "wallet",
                            amount: paymentIntent.amount / 100,
                            transactionId: paymentIntent.id,
                        };

                await onPaymentSuccess(paymentData);
                onClose();
            } catch (err) {
                console.error("Custom success handler failed:", err);
                setErrorMessage("Something went wrong after payment");
                setIsSubmitting(false);
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
                    <PaymentElement />

                    {errorMessage && (
                        <div className="text-red-600 text-sm">{errorMessage}</div>
                    )}

                    <button
                        type="submit"
                        disabled={!stripe || isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 transition"
                    >
                        {isSubmitting ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutForm;
