export type TCreatePlan = {
    name: string;
    description: string;
    type: 'basic' | 'medium' | 'vip';
    price: number;
    duration: number;
    features: string[];
}

export type TUpdatePlan = {
    name?: string;
    description?: string;
    type?: 'basic' | 'medium' | 'vip';
    price?: number;
    duration?: number;
    features?: string[];
}