import Header from "@/components/header/user/Header";
import Footer from "@/components/footer/Footer";
import PlanCard from "@/components/subscription/PlanCard";
import { useGetSubscriptionPlans } from "@/hooks/admin/useSubscription";

const SubscriptionPage = () => {
    const { data: plansResponseData } = useGetSubscriptionPlans();

    const plans = plansResponseData ? plansResponseData.data : null;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                            Choose Your Plan
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Select the perfect plan for your needs. All plans include a 14-day money-back guarantee.
                        </p>
                    </header>

                    {/* Pricing Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-start pt-8">
                        {plans && plans.map((plan: any) => (
                            <PlanCard key={plan.name} plan={plan} />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SubscriptionPage;
