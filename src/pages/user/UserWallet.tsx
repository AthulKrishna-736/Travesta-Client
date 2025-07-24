import React, { useState } from "react";
import Header from "@/components/common/Header";
import WalletSection from "@/components/wallet/Wallet";
import Pagination from "@/components/common/Pagination";

const UserWallet: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 2;

    const allTransactions = [
        {
            type: 'credit',
            amount: 1000,
            description: 'Added via UPI',
            date: '2025-07-21',
        },
        {
            type: 'debit',
            amount: 300,
            description: 'Hotel Booking - Delhi',
            date: '2025-07-22',
        },
        {
            type: 'credit',
            amount: 860.75,
            description: 'Refund - Cancelled Booking',
            date: '2025-07-23',
        },
        {
            type: 'debit',
            amount: 500,
            description: 'Room Upgrade Fee',
            date: '2025-07-24',
        },
    ];

    const totalPages = Math.ceil(allTransactions.length / transactionsPerPage);
    const paginatedTransactions = allTransactions.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-background px-4 py-6 mt-4">
                <div className="mx-auto max-w-6xl space-y-6">
                    <h1 className="text-3xl font-bold">Your Wallet</h1>

                    <WalletSection
                        balance={1560.75}
                        transactions={paginatedTransactions}
                        userName="John"
                    />

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserWallet;
