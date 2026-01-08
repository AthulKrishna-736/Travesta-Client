import { IHotel } from "./hotel.types";
import { IUser } from "./user.types";

export type TAdminAnalyticsData = {
    counts: { totalHotels: number, totalRooms: number, totalBookings: number };
    totalRevenue: number;
    totalBookings: number;
    bookingsChart: Array<{ _id: string, count: number }>;
    topHotels: Array<Pick<IHotel, 'name' | 'vendorId' | 'images' | 'city'> & { _id: string, totalBookings: number, revenue: number, avgRating: number }>;
    topVendors: Array<Pick<IUser, 'firstName' | 'lastName' | 'email'> & { _id: string, totalBooking: number, revenue: number, hotelCount: number }>;
    topRevenueDays: Array<{ _id: string, revenue: number }>;
    averageRating: { _id: string | null, avgHospitality: number, avgCleanliness: number, avgFacilities: number, avgRoom: number, avgValue: number };
};
