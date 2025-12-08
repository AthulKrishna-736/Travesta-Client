import React, { useState } from "react";
import VendorLayout from "@/components/layouts/VendorLayout";
import CouponTable from "@/components/coupon/CouponTable";
import CreateCouponModal from "@/components/coupon/CreateCouponModal";
import { useVendorCoupons, useCreateCoupon, useUpdateCoupon, useToggleCouponStatus } from "@/hooks/vendor/useCoupon";
import { ICoupon, TCreateCoupon, TUpdateCoupon } from "@/types/coupon.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/common/Pagination";
import { useDebounce } from "@/utils/helperFunctions";

const VendorCouponPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCoupon, setEditCoupon] = useState<ICoupon | null>(null);
    const debouncedSearchTerm = useDebounce(search, 500);
    const COUPON_LIMIT = 6

    const { mutate: toggleStatus } = useToggleCouponStatus();
    const { data: couponResponse, isLoading } = useVendorCoupons(page, COUPON_LIMIT, debouncedSearchTerm);
    const coupons = couponResponse?.data || [];
    const meta = couponResponse?.meta;

    const { mutate: createCouponFn, isPending: isCreating } = useCreateCoupon(() => {
        setIsModalOpen(false);
    });

    const { mutate: updateCouponFn, isPending: isUpdating } = useUpdateCoupon(() => {
        setIsModalOpen(false);
    });

    const handleSubmit = (values: TCreateCoupon | TUpdateCoupon, isEdit: boolean) => {
        if (isEdit && editCoupon) {
            updateCouponFn({ id: editCoupon.id, data: values });
        } else {
            createCouponFn(values as TCreateCoupon);
        }
    };

    const handleCouponStatusToggle = (couponId: string) => {
        toggleStatus(couponId);
    }

    return (
        <VendorLayout>
            <>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Coupons</h1>
                </div>

                {/* Search + Add Button */}
                <div className="flex items-center justify-between mb-4">
                    <Input
                        placeholder="Search coupons..."
                        className="w-64"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />

                    <Button
                        onClick={() => {
                            setEditCoupon(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Add Coupon
                    </Button>
                </div>

                {/* Coupon Table */}
                <CouponTable
                    coupons={coupons}
                    loading={isLoading}
                    onToggleBlock={handleCouponStatusToggle}
                    onEdit={(coupon) => {
                        setEditCoupon(coupon);
                        setIsModalOpen(true);
                    }}
                />

                {/* Pagination */}
                {meta && (
                    <div className="mt-4">
                        <Pagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}

                {/* Create/Edit Modal */}
                <CreateCouponModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    isEdit={!!editCoupon}
                    couponData={editCoupon || undefined}
                    isLoading={isCreating || isUpdating}
                />
            </>
        </VendorLayout>
    );
};

export default VendorCouponPage;
