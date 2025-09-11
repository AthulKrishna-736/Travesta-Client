import React, { useState } from 'react'
import DataTable from '../common/Table'
import { VendorRequestTableProps } from '@/types/user.types'
import ConfirmationModal from '../common/ConfirmationModa'
import ShowDetailsModal from '../common/ShowDetailsModal'
import { useVendorVerify } from '@/hooks/vendor/useVendor'
import { BadgeInfo, CheckCircle2, XCircle } from 'lucide-react'

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
                vendorId: selectedVendor.id,
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
            icon: CheckCircle2,
            tooltip: 'Accept verification',
            showLabel: false,
            hidden: (row: any) => row.isVerified === true,
            className: "text-green-700 hover:bg-green-100",
            onClick: (row: any) => {
                setSelectedVendor(row);
                setIsAcceptModalOpen(true);
            }
        },
        {
            label: 'Reject',
            variant: 'ghost' as const,
            icon: XCircle,
            tooltip: 'Reject verification',
            showLabel: false,
            hidden: (row: any) => row.isVerified === true,
            className: "text-red-700 hover:bg-red-100",
            onClick: (row: any) => {
                openRejectModal(row);
            }
        },
        {
            label: 'Details',
            variant: 'ghost' as const,
            icon: BadgeInfo,
            tooltip: 'Show Details',
            showLabel: false,
            className: 'cursor-pointer text-blue-700 hover:bg-blue-100 mx-2',
            onClick: (row: any) => {
                openVendorDetailModal(row)
            }
        }
    ]

    return (
        <>
            <div className="rounded-lg border-1 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={vendors}
                    actions={actions}
                    loading={loading}
                />
            </div>

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