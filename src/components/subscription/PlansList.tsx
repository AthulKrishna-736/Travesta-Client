import { useState } from 'react';
import DataTable from '../common/Table';
import { PricingPlan } from './PlanCard';
import { Edit, Eye } from 'lucide-react';
import { useGetAllPlans, useUpdatePlans } from '@/hooks/admin/useSubscription';
import PlanDetailModal from './PlanDetailModal';
import PlanFormModal from './PlanFormModal';
import { Column } from '@/types/custom.types';
import { PlanSubmitData } from '@/types/plan.types';

const PlansList = () => {
    const { data: plansResponseData, isLoading } = useGetAllPlans();
    const plans = plansResponseData?.data;

    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { mutate: updatePlan, isPending } = useUpdatePlans();


    const columns: Column<PricingPlan>[] = [
        { key: "name", label: "Plan Name", render: (value) => typeof value === "string" ? (<span className="font-semibold">{value}</span>) : null },
        {
            key: "type", label: "Type", render: (value) => typeof value === "string" ? (
                <span className="px-3 py-1 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium capitalize">
                    {value}
                </span>
            ) : null,
        },
        { key: "price", label: "Price (₹)", render: (value) => typeof value === "number" ? `₹${value}` : null },
        { key: "duration", label: "Duration (days)", render: (value) => typeof value === "number" ? `${value} days` : null },
        { key: "description", label: "Description", render: (value) => typeof value === "string" ? value : null },
        {
            key: "isActive", label: "Active", render: (value) => typeof value === "boolean" ? (
                value ? (
                    <span className="px-3 py-1 rounded-sm bg-green-100 text-green-700 text-xs font-medium">
                        Active
                    </span>
                ) : (
                    <span className="px-3 py-1 rounded-sm bg-red-100 text-red-700 text-xs font-medium">
                        Inactive
                    </span>
                )
            ) : null,
        },
    ];

    const actions = [
        {
            label: "Details",
            variant: "ghost" as const,
            icon: Eye,
            showLabel: false,
            tooltip: 'View details',
            className: 'text-blue-500',
            onClick: (plan: PricingPlan) => {
                setSelectedPlan(plan);
                setIsDetailModalOpen(true);
            },
        },
        {
            label: "Edit",
            variant: "ghost" as const,
            icon: Edit,
            showLabel: false,
            tooltip: 'Edit plan',
            className: 'text-green-600',
            onClick: (plan: PricingPlan) => {
                setSelectedPlan(plan);
                setIsEditModalOpen(true);
            },
        },
    ];

    const handleEditSubmit = (data: PlanSubmitData) => {
        if (!selectedPlan) return;

        const formattedData = {
            ...data,
            features: data.features,
            planId: selectedPlan.id,
        };

        updatePlan(formattedData, {
            onSuccess: () => {
                setIsEditModalOpen(false);
            },
        });
    };

    return (
        <>
            {plans && plans.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={plans}
                    actions={actions}
                    loading={isLoading}
                />
            ) : (
                <div className="flex justify-center items-center py-10">
                    <p className="font-semibold text-lg text-red-500">
                        No hotels found. Please create one.
                    </p>
                </div>
            )}

            <PlanDetailModal
                open={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                plan={selectedPlan}
            />

            <PlanFormModal
                open={isEditModalOpen}
                title={selectedPlan ? "Edit Plan" : "Create Plan"}
                onCancel={() => setIsEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                initialData={selectedPlan}
                loading={isPending}
            />
        </>
    );
};

export default PlansList;
