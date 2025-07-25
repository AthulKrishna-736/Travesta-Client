import React, { useState } from 'react'
import DataTable from '../common/Table'
import { VendorRequestTableProps } from '@/types/user.types'
import ConfirmationModal from '../common/ConfirmationModa'
import ShowDetailsModal from '../common/ShowDetailsModal'
import { useVendorVerify } from '@/hooks/vendor/useVendor'

const VendorTable: React.FC<VendorRequestTableProps> = ({ vendors, loading, page, limit, search }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [vendorModalOpen, setVendorModalOpen] = useState(false);

    const { mutate: updateVendorReq, isPending } = useVendorVerify(page, limit, search, () => {
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

    const handleAcceptConfirm = () => {
        if (selectedVendor) {
            console.log('selected vendor: ', selectedVendor)
            updateVendorReq({
                vendorId: selectedVendor._id,
                isVerified: true,
                reason: 'Approved by admin'
            }, {
                onSettled: () => {
                    setIsAcceptModalOpen(false);
                }
            });
        }
    };

    const handleAcceptCancel = () => {
        setIsAcceptModalOpen(false);
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
            className: "bg-green-50 text-green-700 hover:bg-green-100",
            onClick: (row: any) => {
                setSelectedVendor(row);
                setIsAcceptModalOpen(true);
            }
        },
        {
            label: 'Reject',
            variant: 'ghost' as const,
            className: "bg-red-50 text-red-700 hover:bg-red-100",
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
            <ConfirmationModal
                open={isAcceptModalOpen}
                title="Accept Vendor"
                description="Are you sure you want to accept this vendor?"
                showInput={false}
                onConfirm={handleAcceptConfirm}
                onCancel={handleAcceptCancel}
                isLoading={isPending}
            />

        </>
    )
}

export default VendorTable