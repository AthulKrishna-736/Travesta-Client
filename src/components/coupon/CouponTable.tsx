import React, { useState } from "react";
import { CouponTableProps, ICoupon } from "@/types/coupon.types";
import DataTable from "../common/Table";
import ConfirmationModal from "../common/ConfirmationModa";
import { Eye, Edit, Ban, Unlock } from "lucide-react";
import CouponModal from "./CreateCouponModal";
import ShowCouponDetailsModal from "./ShowCouponDetails";

const CouponTable: React.FC<CouponTableProps> = ({ coupons, loading, onToggleBlock, onEdit, }) => {
    const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [viewCoupon, setViewCoupon] = useState<ICoupon | null>(null);

    const columns = [
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "type", label: "Type" },
        { key: "value", label: "Value" },
        { key: "minPrice", label: "Min Price" },
        { key: "maxPrice", label: "Max Price" },
        { key: "isBlocked", label: "Blocked" },
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

            {viewCoupon && (
                <CouponModal
                    open={!!viewCoupon}
                    isEdit={false}
                    couponData={viewCoupon}
                    onClose={() => setViewCoupon(null)}
                    onSubmit={() => { }}
                    isLoading={false}
                />
            )}

            <ShowCouponDetailsModal
                open={!!viewCoupon}
                coupon={viewCoupon}
                onClose={() => setViewCoupon(null)}
            />

        </>
    );
};

export default CouponTable;
