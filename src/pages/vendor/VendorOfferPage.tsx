import React, { useState } from "react";
import VendorLayout from "@/components/layouts/VendorLayout";
import OfferTable from "@/components/offer/OfferTable";
import CreateOfferModal from "@/components/offer/CreateOfferModal";
import { useVendorOffers, useCreateOffer, useUpdateOffer, useToggleOfferStatus } from "@/hooks/vendor/useOffer";
import { IOffer, TCreateOffer, TUpdateOffer } from "@/types/offer.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/common/Pagination";
import { useDebounce } from "@/utils/helperFunctions";

const VendorOfferPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editOffer, setEditOffer] = useState<IOffer | null>(null);

    const debouncedSearchTerm = useDebounce(search, 500);
    const OFFER_LIMIT = 6;

    const { data: offerResponse, isLoading } = useVendorOffers(page, OFFER_LIMIT, debouncedSearchTerm);

    const offers = offerResponse?.data || [];
    const meta = offerResponse?.meta;

    // Mutations
    const { mutateAsync: toggleStatus } = useToggleOfferStatus();

    const { mutateAsync: createOfferFn, isPending: isCreating } = useCreateOffer(() => {
        setIsModalOpen(false);
    });

    const { mutateAsync: updateOfferFn, isPending: isUpdating } = useUpdateOffer(() => {
        setIsModalOpen(false);
    });

    const handleSubmit = async (values: TCreateOffer | TUpdateOffer, isEdit: boolean) => {
        try {
            if (isEdit && editOffer) {
                await updateOfferFn({ id: editOffer.id, data: values });
            } else {
                await createOfferFn(values as TCreateOffer);
            }
        } catch (error) {
            throw error;
        }
    };

    const handleOfferStatusToggle = (offerId: string) => {
        toggleStatus(offerId);
    };

    return (
        <VendorLayout>
            <>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Offers</h1>
                </div>

                {/* Search + Add Button */}
                <div className="flex items-center justify-between mb-4">
                    <Input
                        placeholder="Search offers..."
                        className="w-64"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />

                    <Button
                        onClick={() => {
                            setEditOffer(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Add Offer
                    </Button>
                </div>

                {/* Offer Table */}
                <OfferTable
                    offers={offers}
                    loading={isLoading}
                    onToggleBlock={handleOfferStatusToggle}
                    onEdit={(offer) => {
                        setEditOffer(offer);
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

                {/* Create/Edit Offer Modal */}
                <CreateOfferModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    isEdit={!!editOffer}
                    offerData={editOffer || undefined}
                    isLoading={isCreating || isUpdating}
                />
            </>
        </VendorLayout>
    );
};

export default VendorOfferPage;
