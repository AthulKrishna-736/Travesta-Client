import { useState } from "react";
import { Check } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { env } from "@/config/config";
import PaymentSelectionModal from "./PlanPaymentOption";
import SubscriptionCheckoutForm from "./PlanCheckout";
import { useCancelSubscription, useGetUserActivePlan, useSubscribePlan } from "@/hooks/admin/useSubscription";
import { useCreatePaymentIntent, useGetWallet } from "@/hooks/user/useWallet";
import ConfirmationModal from "../common/ConfirmationModa";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const isAuthenticated = Boolean(useSelector((state: RootState) => state.user.user?.id));

    const { data: activePlanRes } = useGetUserActivePlan(isAuthenticated);
    const { data: walletResponse } = useGetWallet(isAuthenticated);

    const activePlan = activePlanRes?.data;
    const wallet = walletResponse ? walletResponse.data : null;

    const { mutateAsync: subscribePlan } = useSubscribePlan();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
    const { mutateAsync: cancelSubscription, isPending } = useCancelSubscription();

    const handleSelectPlan = () => {
        if (activePlan?.isActive) {
            setShowConfirmModal(true);
        } else {
            setShowPaymentModal(true);
        }
    };

    const handleConfirmProceed = () => {
        setShowConfirmModal(false);
        setShowPaymentModal(true);
    };

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

    const durationText = plan.duration >= 30 ? `${Math.floor(plan.duration / 30)} ${Math.floor(plan.duration / 30) === 1 ? "month" : "months"}` : `${plan.duration} days`;
    const hasActivePlan = Boolean(activePlan?.isActive);
    const isCurrentPlan = hasActivePlan && activePlan.subscriptionId.type === plan.type;

    return (
        <>
            <div className="relative h-full">
                <div className={`h-full rounded-xl border-2 border-black`}>
                    <div className="p-7 flex flex-col h-full">
                        <div className="mb-6">
                            <h3 className="text-lg lg:text-2xl font-semibold text-gray-900 tracking-tight">{plan.name}</h3>
                            <p className="text-sm lg:text-md text-gray-500 mt-1 leading-relaxed">{plan.description}</p>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-end gap-1">
                                <span className="text-2xl lg:text-4xl font-semibold text-gray-900">₹{plan.price}</span>
                                {plan.type !== "basic" && (
                                    <span className="text-gray-500 text-sm lg:text-md mb-1">/{durationText}</span>
                                )}
                            </div>
                        </div>

                        <ul className="space-y-2.5 mb-6 flex-grow">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-700 text-sm lg:text-md">
                                    <div className='p-1 rounded-full bg-blue-200'>
                                        <Check className='w-3.5 h-3.5 text-blue-600' />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {plan.type !== "basic" && (
                            <div className="flex flex-col gap-2">
                                <button onClick={handleSelectPlan} disabled={isCurrentPlan}
                                    className={`w-full rounded-md py-2 text-sm font-medium transition ${isCurrentPlan ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-black text-white cursor-pointer hover:bg-gray-800"}`}
                                >
                                    {isCurrentPlan ? "Active Plan" : "Select Plan"}
                                </button>

                                {/* Cancel button only if active plan matches */}
                                {isCurrentPlan && (
                                    <button onClick={() => setShowCancelModal(true)} className="w-full cursor-pointer rounded-md py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}

                        <ConfirmationModal
                            open={showCancelModal}
                            title="Cancel Subscription Plan"
                            description={`You have an active ${activePlan?.subscriptionId?.name} plan until ${new Date(activePlan?.validUntil).toLocaleDateString()}.`}
                            extraNote={
                                <div className="mt-4 rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-800 border border-yellow-300">
                                    <p>By canceling this plan:</p>
                                    <ul className="list-disc list-inside">
                                        <li>Full refund is available if canceled within 7 days of subscription.</li>
                                        <li>Partial refund may be applied if canceled after 7 days.</li>
                                    </ul>
                                </div>
                            }
                            showInput={false}
                            onConfirm={async () => {
                                setShowCancelModal(false);
                                cancelSubscription();
                            }}
                            onCancel={() => setShowCancelModal(false)}
                            isLoading={isPending}
                        />
                    </div>
                </div>
            </div>

            <ConfirmationModal
                open={showConfirmModal}
                title="Active Subscription Detected"
                description={`You already have an active ${activePlan?.subscriptionId?.name} plan until ${new Date(activePlan?.validUntil).toLocaleDateString()}.`}
                extraNote={
                    <div className="mt-4 rounded-md bg-yellow-100 px-4 py-2 text-sm text-yellow-800 border border-yellow-300">
                        <strong>Note:</strong> Subscribing to a new plan will replace your current one immediately.
                        Any remaining days from your current plan will not be refunded.
                    </div>
                }
                showInput={false}
                onConfirm={handleConfirmProceed}
                onCancel={() => setShowConfirmModal(false)}
                isLoading={false}
            />

            {/* 💳 Payment selection modal */}
            <PaymentSelectionModal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handlePaymentSelect}
                walletBalance={wallet?.balance}
            />

            {/* 💰 Stripe checkout modal */}
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