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
    payment?: "pending" | "success" | "failed" | "refunded";
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


export interface BookingPayload {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
}



export interface BookingRes {
    _id: string;
    userId: string;
    hotelId: {
        _id: string;
        vendorId: string;
        name: string;
    };
    roomId: {
        _id: string;
        name: string;
        basePrice: number;
    };
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    payment: "pending" | "success" | "failed" | "refunded";
    createdAt: string;
    updatedAt: string;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    data: BookingRes[];
    meta: {
        currentPage: number;
        pageSize: number;
        totalData: number;
        totalPages: number;
    };
    statusCode: number;
}

export interface BookingTableProps {
    bookings: Booking[];
    loading: boolean;
}

