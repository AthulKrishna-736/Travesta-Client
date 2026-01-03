import { useState } from 'react'
import Pagination from '@/components/common/Pagination';
import { AdminLayout } from '@/components/layouts/AdminLayout'
import WalletSection from '@/components/wallet/Wallet';
import { useGetUserTransactions, useGetWallet } from '@/hooks/user/useWallet';
import { TPagination } from '@/types/custom.types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const AdminWalletPage = () => {
    const [page, setPage] = useState(1);

    const adminName = useSelector((state: RootState) => state.admin.admin?.firstName);
    const isAuthenticated = Boolean(useSelector((state: RootState) => state.admin.admin?.id));

    const limit = 5;

    const { data: walletDataResponse, isLoading: walletLoading } = useGetWallet(isAuthenticated);
    const { data: transactionDataResponse, isLoading: transactionLoading } = useGetUserTransactions(page, limit);

    const walletData = walletDataResponse?.data ?? null;
    const transactionData = transactionDataResponse?.data ?? null;
    const meta = transactionDataResponse?.meta as TPagination ?? null;

    return (
        <AdminLayout>
            <div>
                {!walletLoading && walletData && (
                    <WalletSection
                        balance={walletData.balance}
                        transactions={transactionData || []}
                        userName={adminName || "User"}
                        loading={transactionLoading}
                    />
                )}

                {meta && meta.totalPages > 0 && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminWalletPage