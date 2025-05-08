import React, { useState } from 'react'
import DataTable from '../common/Table'
import { VendorRequestTableProps } from '@/types/user.types'
import { useVendorVerify } from '@/hooks/admin/useVendorVerify'
import ConfirmationModal from '../common/ConfirmationModa'

const VendorTable: React.FC<VendorRequestTableProps> = ({ vendors, loading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const [rejectReason, setRejectReason] = useState('');

    const { mutate: updateVendorReq } = useVendorVerify()

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
            });
        }
        setIsModalOpen(false);
        setRejectReason('');
    };

    const handleRejectCancel = () => {
        setIsModalOpen(false);
        setRejectReason('');
    };

    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "verificationReason", label: "reason" },
        { key: "isVerified", label: "Verified" },
    ]

    const actions = [
        {
            label: 'Accept',
            variant: 'ghost' as const,
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
            onClick: (row: any) => {
                openRejectModal(row);
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
            />
        </>
    )
}

export default VendorTable