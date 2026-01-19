import { useState } from "react";
import DataTable from "@/components/common/Table";
import { Eye } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PlanHistoryDetailModal from "./PlanHistoryDetail";
import { useGetPlanHistory } from "@/hooks/admin/useSubscription";
import { Column, TPagination } from "@/types/custom.types";
import Pagination from "../common/Pagination";
import { UserSubscriptionRow } from "@/types/plan.types";

const PlanHistoryList = () => {
    const [page, setPage] = useState<number>(1);
    const [type, setType] = useState<"basic" | "medium" | "vip" | "all">("all");
    const [selectedHistory, setSelectedHistory] = useState<UserSubscriptionRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const limit = 6;
    const { data: planHistoryResponse, isLoading } = useGetPlanHistory(page, limit, type);

    const histories: UserSubscriptionRow[] = planHistoryResponse
        ? planHistoryResponse.data.map((item) => ({
            id: item._id,
            firstName: item.user?.firstName ?? 'n/a',
            email: item.user?.email ?? 'n/a',
            subscriptionName: item.subscription?.name ?? 'n/a',
            subscriptionType: item.subscription?.type ?? 'n/a',
            paymentAmount: `${item.paymentAmount ?? 0}`,
            validFrom: new Date(item.validFrom).toLocaleString('en-IN', { month: 'short', year: '2-digit', day: '2-digit' }),
            validUntil: new Date(item.validUntil).toLocaleString('en-IN', { month: 'short', year: '2-digit', day: '2-digit' }),
            isActive: item.isActive ? true : false,
        })) : [];

    const meta = planHistoryResponse ? planHistoryResponse.meta as TPagination : null;

    const columns: Column<UserSubscriptionRow>[] = [
        { key: "firstName", label: "User Name", render: (value) => typeof value === "string" ? (<span className="font-semibold">{value}</span>) : null },
        { key: "email", label: "Email", render: (value) => typeof value === "string" ? value : null },
        {
            key: "subscriptionName", label: "Plan", render: (value) => typeof value === "string" ? (
                <span className="px-3 py-1 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium">
                    {value}
                </span>
            ) : null,
        },
        { key: "paymentAmount", label: "Amount", render: (value) => typeof value === "string" ? value : null },
        { key: "validFrom", label: "Valid From", render: (value) => typeof value === "string" ? value : null },
        { key: "validUntil", label: "Valid Until", render: (value) => typeof value === "string" ? value : null },
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
            label: "View Details",
            variant: "ghost" as const,
            icon: Eye,
            showLabel: false,
            className: "text-blue-600",
            tooltip: "View details",
            onClick: (history: UserSubscriptionRow) => {
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

                    <Select value={type} onValueChange={(value: "basic" | "medium" | "vip" | "all") => setType(value)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Plans</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            {!isLoading && histories && histories.length > 0 ? (
                <div className="rounded-lg border overflow-hidden">
                    <DataTable<UserSubscriptionRow>
                        columns={columns}
                        data={histories}
                        actions={actions}
                        loading={isLoading}
                    />
                </div>
            ) : (
                !isLoading && (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500 border rounded-md bg-gray-100">
                        <p className="font-medium">No subscription history found.</p>
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
