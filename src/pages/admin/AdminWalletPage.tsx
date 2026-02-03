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

    const adminName = useSelector((state: RootState) => state.user.user?.firstName);
    const limit = 5;

    const { data: walletDataResponse, isLoading: walletLoading } = useGetWallet();
    const { data: transactionDataResponse, isLoading: transactionLoading } = useGetUserTransactions(page, limit);

    const walletData = walletDataResponse?.data ?? null;
    const transactionData = transactionDataResponse?.data ?? null;
    const meta = transactionDataResponse?.meta as TPagination ?? null;

    return (
        <AdminLayout>
            <div>
                {walletLoading ? (
                    <div className="mt-10 mx-auto max-w-xl px-6 py-8 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl text-center shadow-sm animate-pulse">
                        <h2 className="text-lg font-semibold mb-2">
                            Loading Wallet...
                        </h2>
                        <p className="text-sm">
                            Fetching your balance and transactions.
                        </p>

                        <div className="mt-4 space-y-3">
                            <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto" />
                            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
                            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto" />
                        </div>
                    </div>
                ) : walletData ? (
                    <WalletSection
                        balance={walletData.balance}
                        transactions={transactionData || []}
                        userName={adminName || "User"}
                        loading={transactionLoading}
                    />
                ) : null}

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