
import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import PlansList from "@/components/subscription/PlansList";
import PlanFormModal from "@/components/subscription/PlanFormModal";
import PlanHistoryList from "@/components/subscription/PlanHistoryList";
import { useCreatePlans } from "@/hooks/admin/useSubscription";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PlanSubmitData } from "@/types/plan.types";

const AdminPlansPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState("plans");

    const { mutate: createPlan, isPending } = useCreatePlans();

    const handleCreatePlan = (data: PlanSubmitData) => {
        createPlan(data, {
            onSuccess: () => {
                setOpenModal(false);
            },
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="flex flex-col gap-5 max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Subscriptions
                            </h1>
                            <p className="text-muted-foreground">
                                Manage and view subscription plans and history.
                            </p>
                        </div>

                        {activeTab === "plans" && (
                            <Button
                                className="bg-black text-white hover:bg-gray-600 rounded-md shadow-sm cursor-pointer"
                                onClick={() => setOpenModal(true)}
                            >
                                Add New Plan
                            </Button>
                        )}
                    </div>

                    {/* Information Note */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm mt-3">
                        <span className="text-yellow-800 font-semibold mb-1">
                            Note:{" "}
                        </span>
                        <span className="text-yellow-700 text-sm leading-relaxed">
                            Subscription plans help manage the pricing and features
                            available to your customers. Make sure to maintain
                            <span className="font-medium"> clear pricing and plan details</span>
                            so customers can easily understand their available options.
                        </span>
                    </div>

                    {/* Tab Selection */}
                    <div className="flex justify-between">
                        <ToggleGroup
                            type="single"
                            value={activeTab}
                            onValueChange={(value) => {
                                if (value) setActiveTab(value);
                            }}
                            className="w-fit gap-1 rounded-lg bg-white p-1"
                        >
                            <ToggleGroupItem
                                value="plans"
                                className="rounded-md border-0 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:shadow-sm"
                            >
                                Plans
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="history"
                                className="rounded-md border-0 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:shadow-sm"
                            >
                                Plan History
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[70vh] flex justify-center">
                        {activeTab === "plans" ? (
                            <PlansList />
                        ) : (
                            <PlanHistoryList />
                        )}
                    </div>
                </div>

                {/* Create Plan Modal */}
                <PlanFormModal
                    open={openModal}
                    title="Create New Plan"
                    onCancel={() => setOpenModal(false)}
                    onSubmit={handleCreatePlan}
                    loading={isPending}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminPlansPage;
