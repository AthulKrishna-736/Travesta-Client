export type TCouponTypes = 'flat' | 'percent';


export interface ICoupon {
    id: string;
    vendorId: string;
    name: string;
    code: string;
    type: TCouponTypes;
    value: number;
    minPrice: number;
    maxPrice: number;
    startDate: string;
    endDate: string;
    count: number;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type TCreateCoupon = {
    name: string,
    code: string,
    type: TCouponTypes,
    value: number,
    minPrice: number,
    maxPrice: number,
    count: number,
    startDate: string,
    endDate: string,
}

export type TUpdateCoupon = {
    name?: string,
    code?: string,
    type?: TCouponTypes,
    value?: number,
    minPrice?: number,
    maxPrice?: number,
    count?: number,
    startDate?: string,
    endDate?: string,
}

//component props types
export interface ICouponModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TCreateCoupon | TUpdateCoupon, isEdit: boolean) => void;
    isEdit?: boolean;
    couponData?: TUpdateCoupon & { id?: string };
    isLoading?: boolean;
}

export interface CouponTableProps {
    coupons: ICoupon[];
    loading: boolean;
    onToggleBlock: (id: string) => void;
    onEdit: (coupon: ICoupon) => void;
}

export interface IShowCouponDetailsModalProps {
    open: boolean;
    coupon?: ICoupon | null;
    onClose: () => void;
}