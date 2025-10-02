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

    const statusColors: Record<string, string> = {
        confirmed: "green",
        pending: "orange",
        cancelled: "red",
    };

    const paymentColors: Record<string, string> = {
        success: "#4ade80",
        pending: "#facc15",
        failed: "#f87171",
        refunded: "#60a5fa",
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
