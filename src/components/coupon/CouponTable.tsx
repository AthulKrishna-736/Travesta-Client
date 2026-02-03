import React, { useState } from "react";
import { CouponTableProps, ICoupon } from "@/types/coupon.types";
import DataTable from "../common/Table";
import ConfirmationModal from "../common/ConfirmationModal";
import { Eye, Edit, Ban, Unlock } from "lucide-react";
import ShowCouponDetailsModal from "./ShowCouponDetails";
import { Column } from "@/types/custom.types";

const CouponTable: React.FC<CouponTableProps> = ({ coupons, loading, onToggleBlock, onEdit, }) => {
    const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [viewCoupon, setViewCoupon] = useState<ICoupon | null>(null);


    const columns: Column<ICoupon>[] = [
        { key: "name", label: "Name", render: (value) => typeof value === "string" ? (<span className="font-semibold">{value}</span>) : null },
        {
            key: "code", label: "Code", render: (value) => typeof value === "string" ? (
                <span className="px-3 py-1 rounded-sm bg-gray-100 text-gray-800 text-xs font-medium">
                    {value}
                </span>
            ) : null,
        },
        {
            key: "type", label: "Type", render: (value) => typeof value === "string" ? (
                <span className="px-3 py-1 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium">
                    {value}
                </span>
            ) : null,
        },
        { key: "value", label: "Value", render: (value) => typeof value === "number" ? `${value}` : null },
        { key: "minPrice", label: "Min Price", render: (value) => typeof value === "number" ? `₹${value}` : null },
        { key: "maxPrice", label: "Max Price", render: (value) => typeof value === "number" ? `₹${value}` : null },
        {
            key: "isBlocked", label: "Blocked", render: (value) => typeof value === "boolean" ? (
                value ? (
                    <span className="px-3 py-1 rounded-sm bg-red-100 text-red-700 text-xs font-medium">
                        Yes
                    </span>
                ) : (
                    <span className="px-3 py-1 rounded-sm bg-green-100 text-green-700 text-xs font-medium">
                        No
                    </span>
                )
            ) : null,
        },
    ];

    const actions = [
        {
            label: "View",
            tooltip: "View Coupon Details",
            icon: Eye,
            variant: "ghost" as const,
            showLabel: false,
            className: "cursor-pointer text-gray-700 hover:bg-gray-200 mx-1",
            onClick: (coupon: ICoupon) => setViewCoupon(coupon)
        },
        {
            label: "Edit",
            tooltip: "Edit Coupon",
            icon: Edit,
            variant: "ghost" as const,
            showLabel: false,
            className: "cursor-pointer text-blue-700 hover:bg-blue-100 mx-1",
            onClick: (coupon: ICoupon) => onEdit(coupon)
        },
        {
            label: (c: ICoupon) => (c.isBlocked ? "Unblock" : "Block"),
            tooltip: (c: ICoupon) => (c.isBlocked ? "Unblock Coupon" : "Block Coupon"),
            icon: (c: ICoupon) => (c.isBlocked ? Unlock : Ban),
            variant: "ghost" as const,
            showLabel: false,
            className: (c: ICoupon) =>
                c.isBlocked
                    ? "cursor-pointer text-green-700 hover:bg-green-100 mx-1"
                    : "cursor-pointer text-red-700 hover:bg-red-100 mx-1",
            onClick: (coupon: ICoupon) => {
                setSelectedCoupon(coupon);
                setIsConfirmOpen(true);
            }
        }
    ];

    const handleConfirmToggle = () => {
        if (selectedCoupon) {
            onToggleBlock(selectedCoupon.id);
        }
        setIsConfirmOpen(false);
        setSelectedCoupon(null);
    };

    return (
        <>
            <div className="rounded-lg border overflow-hidden">
                {coupons && coupons.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={coupons}
                        actions={actions}
                        loading={loading}
                    />
                ) : (
                    <div className="flex justify-center items-center">
                        <p className="font-semibold text-2xl text-red-500 bg-red-100 w-full text-center py-5">
                            No Coupons found. Please create one.
                        </p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                open={isConfirmOpen}
                title={selectedCoupon?.isBlocked ? "Unblock Coupon" : "Block Coupon"}
                description="Are you sure you want to change block status for this coupon?"
                onConfirm={handleConfirmToggle}
                onCancel={() => {
                    setIsConfirmOpen(false);
                    setSelectedCoupon(null);
                }}
                showInput={false}
                isLoading={false}
            />

            <ShowCouponDetailsModal
                open={!!viewCoupon}
                coupon={viewCoupon}
                onClose={() => setViewCoupon(null)}
            />

        </>
    );
};

export default CouponTable;
