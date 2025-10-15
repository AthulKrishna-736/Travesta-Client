import { useState } from "react";
import { Check } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { env } from "@/config/config";
import PaymentSelectionModal from "./PlanPaymentOption";
import SubscriptionCheckoutForm from "./PlanCheckout";
import { useSubscribePlan } from "@/hooks/admin/useSubscription";
import { useCreatePaymentIntent } from "@/hooks/user/useWallet";

const stripePromise = loadStripe(env.STRIPE_SECRET);

export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    type: "basic" | "medium" | "vip";
    price: number;
    duration: number;
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface PricingCardProps {
    plan: PricingPlan;
}

const PlanCard = ({ plan }: PricingCardProps) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const { mutateAsync: subscribePlan } = useSubscribePlan();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();

    const handlePaymentSelect = async (method: "wallet" | "online") => {
        setShowPaymentModal(false);

        if (method === "wallet") {
            await subscribePlan({ planId: plan.id, method: "wallet" });
            return;
        }

        if (method === "online") {
            const paymentRes = await createPaymentIntent(plan.price * 100);
            if (paymentRes?.data?.clientSecret) {
                setClientSecret(paymentRes.data.clientSecret);
            }
        }
    };

    const handlePaymentSuccess = async () => {
        await subscribePlan({ planId: plan.id, method: "online" });
    };

    const stripeOptions: StripeElementsOptions = {
        clientSecret: clientSecret ?? "",
        appearance: { theme: "stripe" },
    };

    const isPopular = plan.type === "medium";
    const isPremium = plan.type === "vip";
    const durationText =
        plan.duration >= 30
            ? `${Math.floor(plan.duration / 30)} ${Math.floor(plan.duration / 30) === 1 ? "month" : "months"}`
            : `${plan.duration} days`;

    return (
        <>
            <div className="relative h-full">
                {isPopular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                        <span className="text-xs font-medium px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm backdrop-blur-sm">
                            Most Popular
                        </span>
                    </div>
                )}

                <div
                    className={`h-full rounded-3xl border border-transparent bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 
                    ${isPopular ? "ring-2 ring-blue-400/40" : ""} 
                    ${isPremium ? "ring-2 ring-purple-400/40" : ""} 
                    ${!isPopular && !isPremium ? "ring-1 ring-gray-200/60" : ""}`}
                >
                    <div className="p-7 flex flex-col h-full">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{plan.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{plan.description}</p>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-end gap-1">
                                <span className="text-3xl font-semibold text-gray-900">₹{plan.price}</span>
                                {plan.type !== 'basic' && (<span className="text-gray-400 text-sm mb-1">/{durationText}</span>)}
                            </div>
                        </div>

                        <ul className="space-y-2.5 mb-6 flex-grow">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                                    <div
                                        className={`p-1.5 rounded-md bg-gradient-to-br 
                                        ${isPopular ? "from-blue-100 to-blue-50" : ""} 
                                        ${isPremium ? "from-purple-100 to-purple-50" : ""} 
                                        ${!isPopular && !isPremium ? "from-gray-100 to-gray-50" : ""}`}
                                    >
                                        <Check
                                            className={`w-3.5 h-3.5 
                                            ${isPopular ? "text-blue-600" : ""} 
                                            ${isPremium ? "text-purple-600" : ""} 
                                            ${!isPopular && !isPremium ? "text-gray-600" : ""}`}
                                        />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {plan.type !== 'basic' && (
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className={`w-full rounded-xl py-2.5 font-medium text-sm tracking-wide shadow-sm transition-all duration-200 
                                ${isPopular ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90" : ""} 
                                ${isPremium ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90" : ""} 
                                ${!isPopular && !isPremium ? "bg-gray-900 text-white hover:bg-gray-800" : ""}`}
                            >
                                {isPopular ? "Start Now" : "Select Plan"}
                            </button>
                        )}
                    </div>
                </div>
            </div>


            {/* Payment selection modal */}
            <PaymentSelectionModal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handlePaymentSelect}
            />

            {/* Stripe checkout modal */}
            {clientSecret && (
                <Elements stripe={stripePromise} options={stripeOptions}>
                    <SubscriptionCheckoutForm
                        open={!!clientSecret}
                        onClose={() => setClientSecret(null)}
                        onPaymentSuccess={handlePaymentSuccess}
                    />
                </Elements>
            )}
        </>
    );
};

export default PlanCard;