import { IHotel } from "./hotel.types";
import { IUser } from "./user.types";

export type TAdminAnalyticsData = {
    counts: { totalHotels: number, totalRooms: number, totalBookings: number };
    totalRevenue: number;
    totalBookings: number;
    bookingsChart: Array<{ _id: string, count: number }>;
    topHotels: Array<{ _id: string, totalBookings: number, revenue: number, avgRating: number, hotel: Pick<IHotel, 'name' | 'vendorId' | 'images' | 'city'> }>;
    topVendors: Array<Pick<IUser, 'firstName' | 'lastName' | 'email'> & { _id: string, totalBooking: number, revenue: number, hotelCount: number }>;
    topRevenueDays: Array<{ _id: string, revenue: number }>;
    averageRating: { _id: string | null, avgHospitality: number, avgCleanliness: number, avgFacilities: number, avgRoom: number, avgValue: number };
};

export type TVendorAnalyticsData = {
    summary: { totalRevenue: number, totalBookings: number, averageBookingValue: number, activeHotels: number }
    topHotels: Array<{ hotelName: string, revenue: number, bookings: number, hotelId: string }>
    monthlyRevenue: Array<{ revenue: number, bookings: number, month: string }>
    bookingStatus: Array<{ name: string, value: number, color: string }>
}

// component props
export interface AnalyticsBarChartProps<T> {
    data: T[];
    xKey: string;
    yKey: string;
    label?: string;
    height?: number;
    barColor?: string;
    barSize?: number;
    valueFormatter?: (value: number) => string;
    xAxisAngle?: number;
    yAxisFormatter?: (value: number) => string;
}

export interface AnalyticsLineChartProps<T> {
    data: T[];
    xKey: string;
    yKey: string;
    label?: string;
    height?: number;
    strokeColor?: string;
    valueFormatter?: (value: number) => string;
}

export interface AnalyticsPieChartProps<T> {
    data: T[];
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
    centerLabel?: string;
    showTotal?: boolean;
}