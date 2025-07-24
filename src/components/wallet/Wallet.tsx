import { WalletSectionProps } from '@/types/wallet.types';
import React from 'react';


const WalletSection: React.FC<WalletSectionProps> = ({ balance, transactions, userName }) => {
    return (
        <div className="bg-yellow-100 shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Welcome, {userName || 'User'}</h2>

            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700">Wallet Balance</h3>
                <p className="text-3xl font-bold text-green-600">₹{balance.toFixed(2)}</p>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Recent Transactions</h3>
                <ul className="space-y-3">
                    {transactions.map((tx, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div>
                                <p className="font-semibold">{tx.description}</p>
                                <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                            <span
                                className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                                    }`}
                            >
                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WalletSection;
