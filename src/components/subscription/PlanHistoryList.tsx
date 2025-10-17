import { useState } from "react";
import DataTable from "@/components/common/Table";
import { Eye } from "lucide-react";
import { Action } from "@/types/component.types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PlanHistoryDetailModal from "./PlanHistoryDetail";
import { useGetPlanHistory } from "@/hooks/admin/useSubscription";
import { TPagination } from "@/types/custom.types";
import Pagination from "../common/Pagination";

const PlanHistoryList = () => {
    const [page, setPage] = useState<number>(1);
    const [type, setType] = useState<"basic" | "medium" | "vip">("basic");

    const limit = 6;
    const { data: planHistoryResponse, isLoading } = useGetPlanHistory(page, limit, type);
    const histories = planHistoryResponse
        ? planHistoryResponse.data.map((item: any) => ({
            id: item._id,
            firstName: item.user?.firstName ?? 'n/a',
            email: item.user?.email ?? 'n/a',
            subscriptionName: item.subscription?.name ?? 'n/a',
            subscriptionType: item.subscription?.type ?? 'n/a',
            paymentAmount: `₹${item.paymentAmount ?? 0}`,
            validFrom: new Date(item.validFrom).toLocaleDateString(),
            validUntil: new Date(item.validUntil).toLocaleDateString(),
            isActive: item.isActive ? true : false,
        }))
        : [];
    const meta = planHistoryResponse ? planHistoryResponse.meta as TPagination : null;

    const [selectedHistory, setSelectedHistory] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { key: "firstName", label: "User Name" },
        { key: "email", label: "Email" },
        { key: "subscriptionName", label: "Plan Name" },
        { key: "subscriptionType", label: "Type" },
        { key: "paymentAmount", label: "Amount (₹)" },
        { key: "validFrom", label: "Valid From" },
        { key: "validUntil", label: "Valid Until" },
        { key: "isActive", label: "Active" },
    ];


    const actions: Action[] = [
        {
            label: "View Details",
            variant: "ghost",
            icon: Eye,
            showLabel: false,
            className: "text-blue-600",
            tooltip: "View details",
            onClick: (history) => {
                setSelectedHistory(history);
                setIsModalOpen(true);
            },
        },
    ];

    return (
        <div className="space-y-5">
            {/* Header / Filter */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Subscription History</h2>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Filter by Type:</label>

                    <Select value={type} onValueChange={(value: any) => setType(value)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            {!isLoading && histories && histories.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={histories}
                    actions={actions}
                    loading={isLoading}
                />
            ) : (
                !isLoading && (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500 border rounded-md bg-gray-50">
                        <p className="text-sm font-medium">No subscription history found.</p>
                    </div>
                )
            )}

            {meta && meta.totalPages > 0 && (
                <Pagination
                    currentPage={meta.currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                />
            )}

            {/* Detail Modal */}
            <PlanHistoryDetailModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                history={selectedHistory}
            />
        </div>
    );
};

export default PlanHistoryList;
