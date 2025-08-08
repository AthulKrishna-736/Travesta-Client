export interface WalletTransaction {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
}

export interface WalletSectionProps {
    balance: number;
    transactions: WalletTransaction[];
    userName?: string;
    addMoney: () => void;
}