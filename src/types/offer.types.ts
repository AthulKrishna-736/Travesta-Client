export type TRoomType = 'AC' | 'Non-AC' | 'Deluxe' | 'Suite' | 'Standard';
export type TDiscountType = 'flat' | 'percent';

export interface IOffer {
    id: string;
    vendorId: string;
    name: string;
    hotelId: string | null;
    roomType: TRoomType;
    discountType: TDiscountType;
    discountValue: number;
    startDate: Date;
    expiryDate: Date;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type TCreateOffer = {
    hotelId: string | null;
    name: string;
    roomType: TRoomType;
    discountType: TDiscountType;
    discountValue: number;
    startDate: string;
    expiryDate: string;
}

export type TUpdateOffer = {
    hotelId?: string | null;
    name?: string;
    roomType?: TRoomType;
    discountType?: TDiscountType;
    discountValue?: number;
    startDate?: string;
    expiryDate?: string;
}

//component props types
export interface IOfferModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TCreateOffer | TUpdateOffer, isEdit: boolean) => Promise<void>;
    isEdit?: boolean;
    offerData?: IOffer | null;
    isLoading?: boolean;
}

export interface OfferTableProps {
    offers: IOffer[];
    loading: boolean;
    onToggleBlock: (id: string) => void;
    onEdit: (offer: IOffer) => void;
}

export interface IShowOfferDetailsModalProps {
    open: boolean;
    offer?: IOffer | null;
    onClose: () => void;
}
