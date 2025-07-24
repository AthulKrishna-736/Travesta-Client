export interface EntityRef {
    _id: string;
    name: string;
    basePrice: number;
}

export interface Booking {
    _id: string;
    userId: string;
    hotelId: string | EntityRef;
    roomId: string | EntityRef;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: "confirmed" | "cancelled" | "pending";
    payment?: {
        status: "pending" | "success" | "failed" | "refunded";
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface BookingTableProps {
    bookings: Booking[];
    loading: boolean;
}

export interface BookingDetailProps {
    open: boolean;
    onClose: () => void;
    booking: Booking | null;
}
