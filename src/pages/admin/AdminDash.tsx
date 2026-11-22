import { lazy, Suspense } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { useGetAdminAnalytics } from "@/hooks/vendor/useVendor";
import { IndianRupee, CalendarCheck, Hotel, BedDouble } from "lucide-react";
import ChartLoader from "@/components/common/ChartLoader";
import EmptyChart from "@/components/common/EmptyChart";
import StatsCard from "@/components/common/StatusCard";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";

const AnalyticsBarChart = lazy(() => import("@/components/analytics/AnalyticsBarChart"));
const AnalyticsLineChart = lazy(() => import("@/components/analytics/AnalyticsLineChart"));
const AnalyticsHorizontalBarChart = lazy(() => import("@/components/analytics/AnalyticsHorizontalBarChart"));

const AdminDash = () => {
    const { data: analyticsRes } = useGetAdminAnalytics()
    const analytics = analyticsRes?.data ?? null;

    if (!analytics) return <Loader />

    const bookingsData = analytics.bookingsChart.map((item) => ({
        month: item._id,
        bookings: item.count
    }));

    const revenueData = analytics.topRevenueDays.map((item) => ({
        date: item._id.slice(5),
        revenue: item.revenue
    }));

    const ratingData = [
        { category: 'Hospitality', rating: analytics.averageRating.avgHospitality },
        { category: 'Cleanliness', rating: analytics.averageRating.avgCleanliness },
        { category: 'Facilities', rating: analytics.averageRating.avgFacilities },
        { category: 'Room', rating: analytics.averageRating.avgRoom },
        { category: 'Value', rating: analytics.averageRating.avgValue }
    ];

    return (
        <AdminLayout>
            <div className="h-full bg-slate-50/80 p-6">
                <div className="mx-auto max-w-7xl space-y-6">

                    {/* Dashboard Header */}
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <StatsCard
                            title="Total Revenue"
                            value={`₹${analytics.totalRevenue.toLocaleString()}`}
                            icon={IndianRupee}
                            className="bg-green-50 border-green-100 text-green-900"
                            iconClassName="text-green-600"
                        />

                        <StatsCard
                            title="Total Bookings"
                            value={analytics.counts.totalBookings}
                            icon={CalendarCheck}
                            className="bg-blue-50 border-blue-100 text-blue-900"
                            iconClassName="text-blue-600"
                        />

                        <StatsCard
                            title="Total Hotels"
                            value={analytics.counts.totalHotels}
                            icon={Hotel}
                            className="bg-purple-50 border-purple-100 text-purple-900"
                            iconClassName="text-purple-600"
                        />

                        <StatsCard
                            title="Total Rooms"
                            value={analytics.counts.totalRooms}
                            icon={BedDouble}
                            className="bg-orange-50 border-orange-100 text-orange-900"
                            iconClassName="text-orange-600"
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Bookings */}
                        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
                            <h2 className="text-sm font-medium text-gray-700 mb-4">
                                Monthly Bookings
                            </h2>

                            <Suspense fallback={<ChartLoader />}>
                                {bookingsData.length > 0 ? (
                                    <AnalyticsLineChart
                                        data={bookingsData}
                                        xKey="month"
                                        yKey="bookings"
                                        label="Bookings"
                                        strokeColor="#2563eb"
                                        valueFormatter={(value) => value.toLocaleString()}
                                    />
                                ) : (
                                    <EmptyChart />
                                )}
                            </Suspense>
                        </div>

                        {/* Top Revenue Days */}
                        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
                            <h2 className="text-sm font-medium text-gray-700 mb-4">
                                Top Revenue Days
                            </h2>

                            <Suspense fallback={<ChartLoader />}>
                                {revenueData.length > 0 ? (
                                    <AnalyticsBarChart
                                        data={revenueData}
                                        xKey="date"
                                        yKey="revenue"
                                        label="Revenue"
                                        barColor="#16a34a"
                                        barSize={28}
                                        valueFormatter={(value) => `₹${value.toLocaleString()}`}
                                    />
                                ) : (
                                    <EmptyChart />
                                )}
                            </Suspense>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Average Ratings */}
                        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
                            <h2 className="text-sm font-medium text-gray-700 mb-4">
                                Average Ratings
                            </h2>

                            {ratingData && ratingData.length > 0 ? (
                                <AnalyticsHorizontalBarChart
                                    data={ratingData}
                                    xKey="category"
                                    yKey="rating"
                                />
                            ) : (
                                <div className="h-[260px]">
                                    <EmptyChart message="No ratings available" />
                                </div>
                            )}
                        </div>

                        {/* Top Hotels */}
                        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
                            <h2 className="text-sm font-medium text-gray-700 mb-4">
                                Top Hotels
                            </h2>

                            <div className="h-[320px] overflow-y-auto divide-y divide-gray-100">
                                {analytics.topHotels && analytics.topHotels.length > 0 ? (
                                    analytics.topHotels.map((hotel, idx: number) => (
                                        <div
                                            key={idx}
                                            className="group flex items-center justify-between gap-2 sm:gap-4 px-3 py-4 rounded-xl transition-colors hover:bg-slate-50 min-w-0"
                                        >
                                            {/* Hotel Information */}
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600">
                                                    <span className="text-sm font-bold">
                                                        {hotel.hotel.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                                        {hotel.hotel.name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400 truncate">
                                                        {hotel.hotel.city}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Hotel Metrics */}
                                            <div className="flex items-center gap-2 sm:gap-5 shrink-0">

                                                {/* Bookings */}
                                                <div className="text-right min-w-[55px]">
                                                    <p className="text-sm font-semibold text-indigo-600 tabular-nums">
                                                        {hotel.totalBookings.toLocaleString()}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 mt-1">
                                                        Bookings
                                                    </p>
                                                </div>

                                                {/* Revenue */}
                                                <div className="text-right min-w-[85px]">
                                                    <p className="text-sm font-semibold text-emerald-600 tabular-nums">
                                                        ₹{hotel.revenue.toLocaleString("en-IN")}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 mt-1">
                                                        Revenue
                                                    </p>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 min-w-[65px] justify-center">
                                                    <span className="text-amber-600 text-sm">
                                                        ★
                                                    </span>
                                                    <span className="text-xs font-semibold tabular-nums">
                                                        {(hotel.avgRating ?? 0).toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        title="No hotels found"
                                        description="Hotel performance data will appear here."
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDash;