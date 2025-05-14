import React, { useState } from 'react'
import DataTable from '../common/Table'
import { VendorRequestTableProps } from '@/types/user.types'
import { useVendorVerify } from '@/hooks/admin/useVendorVerify'
import ConfirmationModal from '../common/ConfirmationModa'
import ShowDetailsModal from '../common/ShowDetailsModal'

const VendorTable: React.FC<VendorRequestTableProps> = ({ vendors, loading, page, limit, search }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [vendorModalOpen, setVendorModalOpen] = useState(false);

    const { mutate: updateVendorReq, isPending } = useVendorVerify(page, limit, search,() => {
        setIsModalOpen(false);
        setRejectReason('')
    })

    const openRejectModal = (vendor: any) => {
        setSelectedVendor(vendor);
        setIsModalOpen(true);
    };

    const handleRejectConfirm = () => {
        if (selectedVendor) {
            updateVendorReq({
                vendorId: selectedVendor.id,
                isVerified: false,
                reason: rejectReason
            }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setRejectReason('');
                }
            })
        }
    };

    const openVendorDetailModal = (vendor: any) => {
        setSelectedVendor(vendor)
        setVendorModalOpen(true)
    }

    const handleDetailModalClose = () => {
        setVendorModalOpen(false)
        setSelectedVendor('')
    }

    const handleRejectCancel = () => {
        setIsModalOpen(false);
        setRejectReason('');
    };

    const columns = [
        { key: "firstName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "verificationReason", label: "reason" },
        { key: "isVerified", label: "Verified" },
    ]

    const actions = [
        {
            label: 'Accept',
            variant: 'ghost' as const,
            className: 'text-green-600 border-green-600 hover:bg-green-50',
            onClick: (row: any) => {
                updateVendorReq({
                    vendorId: row.id,
                    isVerified: true,
                    reason: 'Approved by admin'
                })
            }
        },
        {
            label: 'Reject',
            variant: 'ghost' as const,
            className: 'text-red-600 border-red-600 hover:bg-red-50',
            onClick: (row: any) => {
                openRejectModal(row);
            }
        },
        {
            label: 'Details',
            variant: 'ghost' as const,
            className: 'bg-gray-800 text-white hover:bg-white hover:border',
            onClick: (row: any) => {
                openVendorDetailModal(row)
            }
        }
    ]

    return (
        <>
            <DataTable
                columns={columns}
                data={vendors}
                actions={actions}
                loading={loading}
            />
            <ConfirmationModal
                open={isModalOpen}
                title="Reject Vendor"
                description="Please provide a reason for rejecting this vendor."
                showInput={true}
                inputValue={rejectReason}
                onInputChange={setRejectReason}
                onConfirm={handleRejectConfirm}
                onCancel={handleRejectCancel}
                isLoading={isPending}
            />
            <ShowDetailsModal
                open={vendorModalOpen}
                title='Vendor Details'
                data={selectedVendor}
                onCancel={handleDetailModalClose}
            />
        </>
    )
}

export default VendorTable