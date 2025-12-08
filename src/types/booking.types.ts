import { IHotel } from "./hotel.types";
import { IRoom } from "./room.types";
import { IUser } from "./user.types";

export type TBookingStatus = 'confirmed' | 'cancelled' | 'pending';
export type TPaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

//type
export interface IBooking {
    id: string;
    userId: string;
    hotelId: string;
    roomId: string;
    user?: Partial<IUser>;
    hotel?: Pick<IHotel, 'name' | 'city' | 'state' | 'geoLocation' | 'images'> & { _id: string };
    room?: Pick<IRoom, 'name' | 'basePrice'> & { _id: string };
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: TBookingStatus;
    payment: TPaymentStatus;
    bookingId: string;
    createdAt: string;
    updatedAt: string;
}

//component props types
export interface BookingTableProps {
    bookings: IBooking[];
    loading: boolean;
}

export interface BookingDetailProps {
    open: boolean;
    onClose: () => void;
    booking: IBooking | null;
}

export interface BookingTableProps {
    bookings: IBooking[];
    loading: boolean;
}

export interface BookingPayload {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
}

