import { WalletSectionProps } from '@/types/wallet.types';
import { Plus } from 'lucide-react';
import React from 'react';

const WalletSection: React.FC<WalletSectionProps> = ({ balance, transactions, addMoney, loading }) => {
    return (
        <div className="space-y-8">
            {/* Wallet Balance Section */}
            <div className="bg-orange-50 border border-orange-500 rounded-xl p-6 flex justify-between items-center">
                <div>
                    <div className="text-4xl font-bold text-orange-600">
                        ₹{balance.toFixed(2)}
                    </div>
                    <p className="text-sm text-orange-600 mt-1">Current Wallet Balance</p>
                </div>

                {addMoney && (
                    <button
                        className="bg-orange-400 text-white font-semibold px-6 py-2 rounded-md cursor-pointer transition flex items-center gap-2"
                        onClick={addMoney}
                    >
                        <Plus size={18} />
                        <span>Add Money</span>
                    </button>
                )}
            </div>

            {/* Transactions History Section */}
            <div className="bg-blue-50 shadow-md rounded-xl p-6 border border-blue-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
                {loading ? (
                    <p className="text-gray-500">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-gray-500">No transactions yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {transactions.map((tx, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-50 border border-gray-400 rounded-lg p-3">
                                <div>
                                    <p className="font-semibold text-gray-800">{tx.description}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(tx.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                    </p>
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
                )}
            </div>
        </div>
    );
};

export default WalletSection;
