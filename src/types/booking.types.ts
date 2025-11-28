import { IHotel } from "./hotel.types";
import { IRoom } from "./room.types";

export type TBookingStatus = 'confirmed' | 'cancelled' | 'pending';
export type TPaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

//type
export interface IBooking {
    _id: string;
    id: string;
    userId: string;
    hotelId: Pick<IHotel, 'name'> & { _id: string };
    roomId: Pick<IRoom, 'name' | 'basePrice'> & { _id: string };
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: TBookingStatus;
    payment: TPaymentStatus;
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

