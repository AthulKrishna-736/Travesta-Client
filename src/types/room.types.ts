import { IAmenity } from "./component.types";

export interface IRoom {
    id?: string
    _id?: string;
    hotelId: string;
    name: string;
    roomCount: number;
    roomType: string;
    bedType: string;
    guest: number;
    amenities: string[] | IAmenity[];
    images: (string | File)[];
    basePrice: number;
    isAvailable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum BedType {
    KING = "King",
    QUEEN = "Queen",
    DOUBLE = "Double",
    TWIN = "Twin",
    SINGLE = "Single",
    SOFA = "Sofa",
    BUNK = "Bunk",
}

export const BED_TYPE_CAPACITY: Record<BedType, number> = {
    [BedType.KING]: 2,
    [BedType.QUEEN]: 2,
    [BedType.DOUBLE]: 2,
    [BedType.TWIN]: 1,
    [BedType.SINGLE]: 1,
    [BedType.SOFA]: 1,
    [BedType.BUNK]: 1,
};