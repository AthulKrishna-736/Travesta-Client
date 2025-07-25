import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { addWalletCredit } from "@/services/userService";
import { useNavigate } from "react-router-dom";

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

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
            console.error("Payment Error:", error.message);
        } else if (paymentIntent?.status === "succeeded") {
            try {
                await addWalletCredit(paymentIntent.amount / 100);
                navigate("/user/wallet");
            } catch (err) {
                console.error("Failed to log wallet credit:", err);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
                Pay Now
            </button>
        </form>
    );
};

export default CheckoutForm;
