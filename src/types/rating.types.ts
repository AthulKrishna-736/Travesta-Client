
interface UserInfo {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
}

export interface TRatingResponse {
    id: string;
    hotelId: string;
    userId: UserInfo;
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