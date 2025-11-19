export type TTransactionType = 'credit' | 'debit';
export type TRelatedType = 'Booking' | 'Subscription';

export interface IWallet {
    id: string;
    userId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

export interface ITransaction {
    id: string;
    walletId: string;
    type: TTransactionType;
    amount: number;
    description: string;
    transactionId?: string;
    relatedEntityId?: string;
    relatedEntityType?: TRelatedType;
    createdAt: string;
    updatedAt: string;
}

export interface WalletSectionProps {
    balance: number;
    transactions: ITransaction[];
    loading?: boolean;
    userName?: string;
    addMoney?: () => void;
}