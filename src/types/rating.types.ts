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