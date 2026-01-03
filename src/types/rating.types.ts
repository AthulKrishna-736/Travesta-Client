import { IUser } from "./user.types";

export interface IRating {
    id: string;
    hotelId: string;
    userId: Pick<IUser, 'firstName' | 'lastName' | 'profileImage'> & { _id: string };
    hospitality: number;
    cleanliness: number;
    facilities: number;
    room: number;
    moneyValue: number;
    review: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export type TRatingForm = Pick<IRating, 'hospitality' | 'cleanliness' | 'facilities' | 'room' | 'moneyValue' | 'review'>

//component props types
export interface IRatingModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TRatingForm & { images: File[], oldImages: string[] }) => void;
    isEdit?: boolean;
    ratingData?: Partial<TRatingForm> | null;
    isLoading: boolean;
}

export interface IRatingDetailsProps {
    ratings: IRating[];
}
