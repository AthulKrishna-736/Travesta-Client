import { IAmenity } from "./amenities.types";
import { IHotel } from "./hotel.types";

export enum BedType {
    KING = "King",
    QUEEN = "Queen",
    DOUBLE = "Double",
    SINGLE = "Single",
    TWIN_DOUBLE = "TwinDouble",
    TWIN_QUEEN = "TwinQueen",
}

export const BED_TYPE_CAPACITY: Record<BedType, number> = {
    [BedType.KING]: 3,
    [BedType.QUEEN]: 2,
    [BedType.DOUBLE]: 2,
    [BedType.SINGLE]: 1,
    [BedType.TWIN_QUEEN]: 4,
    [BedType.TWIN_DOUBLE]: 4,
};


//type
export interface IRoom {
    id: string
    hotelId: string;
    name: string;
    roomCount: number;
    roomType: string;
    bedType: string;
    guest: number;
    amenities: (Partial<IAmenity> & { _id: string })[];
    images: string[];
    basePrice: number;
    gstPrice?: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

//component props types
export interface ICreateRoomProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FormData | { id: string, data: FormData }) => void;
    isLoading: boolean;
    roomData?: IRoom | null;
    isEdit?: boolean;
    hotelId?: string;
}

export interface IRoomTableProps {
    hotels: IHotel[]
    rooms: IRoom[];
    loading: boolean;
}

export interface TRoomDetailProps {
    open: boolean;
    data: IRoom;
    onClose: () => void;
};

export interface RoomCardProps {
    room: IRoom & { discountedPrice: number, appliedOffer: any };
    handleBookClick: (room: IRoom & { discountedPrice: number, appliedOffer: any }) => void;
}