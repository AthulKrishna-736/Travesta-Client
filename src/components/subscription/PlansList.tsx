import { useState } from 'react';
import DataTable from '../common/Table';
import { PricingPlan } from './PlanCard';
import { Edit, Eye } from 'lucide-react';
import { Action } from '@/types/component.types';
import { useGetAllPlans } from '@/hooks/admin/useSubscription';
import PlanDetailModal from './PlanDetailModal';
import PlanFormModal from './PlanFormModal';

const PlansList = () => {
    const { data: plansResponseData, isLoading } = useGetAllPlans();
    const plans = plansResponseData ? plansResponseData.data : null;

    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const columns = [
        { key: "name", label: "Plan Name" },
        { key: "type", label: "Type" },
        { key: "price", label: "Price (₹)" },
        { key: "duration", label: "Duration (days)" },
        { key: "description", label: "Description" },
        { key: "isActive", label: "Active" }
    ];

    const actions: Action[] = [
        {
            label: "Details",
            variant: "ghost",
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
            variant: "ghost",
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

    const handleEditSubmit = (data: any) => {
        console.log('Edit submitted:', data);
        // Call your API here
        setIsEditModalOpen(false);
    };

    return (
        <>
            <DataTable
                columns={columns}
                data={plans}
                actions={actions}
                loading={isLoading}
            />

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
            />
        </>
    );
};

export default PlansList;