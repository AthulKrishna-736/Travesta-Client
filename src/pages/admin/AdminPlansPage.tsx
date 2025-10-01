import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import PlansList from "@/components/subscription/PlansList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PlanFormModal from "@/components/subscription/PlanFormModal";
import { useCreatePlans } from "@/hooks/admin/useSubscription";

const AdminPlansPage = () => {
    const [openModal, setOpenModal] = useState(false);

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
                        <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
                        <p className="text-muted-foreground">
                            Manage subscription plans available on the platform.
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        className="bg-gray-600 text-white hover:border hover:border-black"
                        onClick={() => setOpenModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Plan
                    </Button>
                </div>

                {/* Plans List */}
                <PlansList />

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
