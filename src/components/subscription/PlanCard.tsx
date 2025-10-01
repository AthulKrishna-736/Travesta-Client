import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const isPopular = plan.type === "medium";
    const isPremium = plan.type === "vip";

    const durationText = plan.duration >= 30
        ? `${Math.floor(plan.duration / 30)} ${Math.floor(plan.duration / 30) === 1 ? 'month' : 'months'}`
        : `${plan.duration} days`;

    return (
        <div className="relative h-full">
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                        Most Popular
                    </span>
                </div>
            )}

            <div
                className={cn(
                    "relative h-full bg-white rounded-2xl border transition-all duration-300",
                    "hover:shadow-lg hover:-translate-y-1",
                    isPopular && "border-blue-600 shadow-lg scale-105",
                    isPremium && "border-purple-600",
                    !isPopular && !isPremium && "border-gray-200"
                )}
            >
                <div className="p-8 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {plan.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {plan.description}
                        </p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-8">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-gray-900">
                                ₹{plan.price}
                            </span>
                            <span className="text-gray-600">/{durationText}</span>
                        </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-grow">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        "mt-0.5 rounded-full p-0.5 flex-shrink-0",
                                        isPopular && "bg-blue-100",
                                        isPremium && "bg-purple-100",
                                        !isPopular && !isPremium && "bg-gray-100"
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            "w-4 h-4",
                                            isPopular && "text-blue-600",
                                            isPremium && "text-purple-600",
                                            !isPopular && !isPremium && "text-gray-600"
                                        )}
                                    />
                                </div>
                                <span className="text-sm text-gray-700 leading-relaxed">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                        className={cn(
                            "font-semibold text-base w-full rounded-lg py-3 transition-colors duration-200",
                            isPopular && "bg-blue-600 text-white hover:bg-blue-700",
                            isPremium && "bg-purple-600 text-white hover:bg-purple-700",
                            !isPopular && !isPremium && "bg-gray-900 text-white hover:bg-gray-800"
                        )}
                    >
                        {isPopular ? "Get Started" : "Choose Plan"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanCard;