import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import PlansList from "@/components/subscription/PlansList";
import PlanFormModal from "@/components/subscription/PlanFormModal";
import { useCreatePlans } from "@/hooks/admin/useSubscription";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PlanHistoryList from "@/components/subscription/PlanHistoryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPlansPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState("plans");

    const { mutate: createPlan, isPending } = useCreatePlans();

    const handleCreatePlan = (data: any) => {
        createPlan(data, {
            onSuccess: () => {
                setOpenModal(false);
            },
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                        <p className="text-muted-foreground">
                            Manage and view subscription plans and history.
                        </p>
                    </div>

                    {activeTab === "plans" && (
                        <Button
                            variant="ghost"
                            className="bg-gray-600 text-white hover:border hover:border-black"
                            onClick={() => setOpenModal(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Plan
                        </Button>
                    )}
                </div>

                {/* Tabs Section */}
                <Tabs
                    defaultValue="plans"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="flex w-fit bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger
                            value="plans"
                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "plans"
                                ? "bg-white shadow text-black"
                                : "text-gray-500 hover:text-black"
                                }`}
                        >
                            Plans
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === "history"
                                ? "bg-white shadow text-black"
                                : "text-gray-500 hover:text-black"
                                }`}
                        >
                            Plan History
                        </TabsTrigger>
                    </TabsList>

                    {/* PLANS TAB */}
                    <TabsContent value="plans">
                        <PlansList />
                    </TabsContent>

                    {/* HISTORY TAB */}
                    <TabsContent value="history">
                        <PlanHistoryList />
                    </TabsContent>
                </Tabs>

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
