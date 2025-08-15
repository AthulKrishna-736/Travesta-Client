
export interface IRoom {
    id?: string
    _id?: string;
    hotelId: string;
    name: string;
    roomCount: number;
    bedType: string;
    amenities: string[];
    images: (string | File)[];
    basePrice: number;
    isAvailable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
