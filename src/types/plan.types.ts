import { PricingPlan } from "@/components/subscription/PlanCard";

export type TSubscription = 'basic' | 'medium' | 'vip';

//type
export interface ISubscription {
    id: string;
    name: string;
    description: string;
    type: TSubscription;
    price: number;
    duration: number;
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ISubscriptionHistory {
    _id: string,
    subscribedAt: Date,
    validFrom: Date,
    validUntil: Date,
    isActive: boolean,
    paymentAmount: number,
    subscription: {
        _id: string,
        name: string,
        type: string,
        price: number,
        duration: number
    },
    user: {
        _id: string,
        firstName: string,
        lastName: string,
        email: string,
    }
}

export type TCreatePlan = {
    name: string;
    description: string;
    type: TSubscription;
    price: number;
    duration: number;
    features: string[];
}

export type TUpdatePlan = {
    name?: string;
    description?: string;
    type?: TSubscription;
    price?: number;
    duration?: number;
    features?: string[];
}

// component props
export interface PlanFormModalProps {
    open: boolean;
    title: string;
    onCancel: () => void;
    onSubmit: (data: PlanSubmitData) => void;
    loading?: boolean;
    initialData?: PricingPlan | null;
}

export type PlanFormData = {
    name: string;
    description: string;
    price: number;
    duration: number;
    features: { value: string }[];
};

export type PlanSubmitData = {
    name: string;
    description: string;
    price: number;
    duration: number;
    type: 'basic' | 'medium' | 'vip';
    features: string[];
};

export type UserSubscriptionRow = {
    id: string;
    firstName: string;
    email: string;
    subscriptionName: string;
    subscriptionType: string;
    paymentAmount: string;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
};


