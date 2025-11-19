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