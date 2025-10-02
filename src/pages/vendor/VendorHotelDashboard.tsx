import { useState } from "react";
import { DollarSign, Calendar, Percent, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/components/hotel/dashboard/DashboardHeader";
import { MetricCard } from "@/components/hotel/dashboard/MetricCard";
import { RevenueChart } from "@/components/hotel/dashboard/RevenueChart";
import { BookingsStatusChart } from "@/components/hotel/dashboard/BookingStatusChart";
import { PaymentStatusChart } from "@/components/hotel/dashboard/PaymentStatusChart";
import { RoomPerformanceTable } from "@/components/hotel/dashboard/RoomPerformanceTable";
import VendorLayout from "@/components/layouts/VendorLayout";
import { useGetHotelAnalytics } from "@/hooks/vendor/useHotel";
import { useParams } from "react-router-dom";

const VendorHotelDashboard = () => {
    const { hotelId } = useParams()
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>("month");

    const { data: hotelAnalyticsResponse } = useGetHotelAnalytics(hotelId!, selectedPeriod)

    const hotelName = hotelAnalyticsResponse ? hotelAnalyticsResponse.data.hotelName : 'n/a';
    const location = hotelAnalyticsResponse ? hotelAnalyticsResponse.data.location : 'n/a';
    const metrics = hotelAnalyticsResponse ? hotelAnalyticsResponse.data.metrics : null
    const roomPerformance = hotelAnalyticsResponse ? hotelAnalyticsResponse.data.roomPerformance : null
    const charts = hotelAnalyticsResponse ? hotelAnalyticsResponse.data.charts : null

    // Mock data - would come from API in production
    // const metrics = {
    //     revenue: 1248500,
    //     bookings: 342,
    //     occupancy: 78,
    //     averageRate: 3650,
    // };

    const revenueData = [
        { date: "Jan 1", revenue: 45000 },
        { date: "Jan 5", revenue: 52000 },
        { date: "Jan 10", revenue: 48000 },
        { date: "Jan 15", revenue: 61000 },
        { date: "Jan 20", revenue: 55000 },
        { date: "Jan 25", revenue: 68000 },
        { date: "Jan 30", revenue: 72000 },
    ];

    const bookingsStatus = [
        { name: "Confirmed", value: 245, color: "hsl(var(--success))" },
        { name: "Pending", value: 67, color: "hsl(var(--primary))" },
        { name: "Cancelled", value: 30, color: "hsl(var(--destructive))" },
    ];

    // const roomPerformance = [
    //     { rank: 1, name: "Presidential Suite", type: "Suite", bookings: 45, revenue: 225000, occupancy: 92 },
    //     { rank: 2, name: "Ocean View Deluxe", type: "Deluxe", bookings: 78, revenue: 195000, occupancy: 85 },
    //     { rank: 3, name: "Garden Villa", type: "Villa", bookings: 52, revenue: 182000, occupancy: 81 },
    //     { rank: 4, name: "Executive Room", type: "Executive", bookings: 89, revenue: 156000, occupancy: 76 },
    //     { rank: 5, name: "Classic Double", type: "Standard", bookings: 112, revenue: 134000, occupancy: 71 },
    // ];

    const paymentStatus = [
        { status: "Success", count: 285, color: "hsl(var(--success))" },
        { status: "Pending", count: 42, color: "hsl(var(--primary))" },
        { status: "Failed", count: 8, color: "hsl(var(--destructive))" },
        { status: "Refunded", count: 7, color: "hsl(var(--muted-foreground))" },
    ];

    const statusColors: Record<string, string> = {
        confirmed: "green",
        pending: "orange",
        cancelled: "red",
    };

   const paymentColors: Record<string, string> = {
  success: "#4ade80",  // brighter green
  pending: "#facc15",  // brighter yellow
  failed: "#f87171",   // brighter red
  refunded: "#60a5fa", // brighter blue
};

    return (
        <VendorLayout>
            <>
                <div className="min-h-screen bg-background">
                    <DashboardHeader
                        hotelName={hotelName}
                        location={location}
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={setSelectedPeriod}
                    />

                    <main className="p-6 space-y-6 max-w-[1600px] mx-auto">
                        {/* Key Metrics Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {metrics && (
                                <>
                                    <MetricCard
                                        title="Total Revenue"
                                        value={metrics.revenue ?? 0}
                                        icon={DollarSign}
                                        prefix="₹"
                                    />
                                    <MetricCard
                                        title="Total Bookings"
                                        value={metrics.bookings ?? 0}
                                        icon={Calendar}
                                    />
                                    <MetricCard
                                        title="Average Occupancy"
                                        value={metrics.occupancy ?? 0}
                                        icon={Percent}
                                        suffix="%"
                                    />
                                    <MetricCard
                                        title="Average Daily Rate"
                                        value={metrics.averageRate.toFixed(2) ?? 0}
                                        icon={TrendingUp}
                                        prefix="₹"
                                    />
                                </>
                            )}
                        </section>

                        {/* Revenue Chart */}
                        <section>
                            {charts && charts.revenueTrend && (
                                <RevenueChart
                                    data={charts.revenueTrend.map((item: { _id: string; revenue: number }) => ({
                                        date: new Date(item._id).toLocaleDateString("en-CA", {
                                            month: "short",
                                            day: "numeric",
                                        }),
                                        revenue: item.revenue,
                                    }))}
                                />
                            )}
                        </section>

                        {/* Two Column Section */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {charts && charts.bookingStatus && charts.paymentStatus && (
                                <>
                                    <BookingsStatusChart
                                        data={charts.bookingStatus.map((item: { _id: string; count: number }) => ({
                                            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
                                            value: item.count,
                                            color: statusColors[item._id] || "gray",
                                        }))}
                                    />
                                    <PaymentStatusChart
                                        data={charts.paymentStatus.map((item: { _id: string; count: number }) => ({
                                            status: item._id.charAt(0).toUpperCase() + item._id.slice(1),
                                            count: item.count,
                                            color: paymentColors[item._id] || "gray",
                                        }))}
                                    />
                                </>
                            )}
                        </section>

                        {/* Room Performance Table */}
                        <section>
                            {roomPerformance && (
                                <RoomPerformanceTable data={roomPerformance} />
                            )}
                        </section>
                    </main>
                </div>
            </>
        </VendorLayout>
    );
};

export default VendorHotelDashboard;
