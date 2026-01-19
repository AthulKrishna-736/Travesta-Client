import { lazy, Suspense } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { useGetAdminAnalytics } from "@/hooks/vendor/useVendor";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IndianRupee, CalendarCheck, Hotel, BedDouble } from "lucide-react";
import ChartLoader from "@/components/common/ChartLoader";

const AnalyticsBarChart = lazy(() => import("@/components/analytics/AnalyticsBarChart"));
const AnalyticsLineChart = lazy(() => import("@/components/analytics/AnalyticsLineChart"));

const AdminDash = () => {
    const { data: analyticsRes } = useGetAdminAnalytics()
    const analytics = analyticsRes?.data ?? null;

    if (!analytics) return (
        <div className="mt-16 mx-auto max-w-xl px-6 py-10 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl text-center shadow-sm animate-pulse">
            <h2 className="text-xl font-semibold mb-2">Loading Details...</h2>
            <p className="text-base">Please wait while we fetch the information.</p>
        </div>
    )

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

    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <div className="min-h-screen bg-gray-50 p-6">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {/* Stats Cards */}

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-green-700">Total Revenue</p>
                                            <p className="text-3xl font-bold text-green-900 mt-2">
                                                ₹{analytics.totalRevenue.toLocaleString()}
                                            </p>
                                        </div>
                                        <IndianRupee className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-blue-700">Total Bookings</p>
                                            <p className="text-3xl font-bold text-blue-900 mt-2">
                                                {analytics.counts.totalBookings}
                                            </p>
                                        </div>
                                        <CalendarCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>

                                <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-purple-700">Total Hotels</p>
                                            <p className="text-3xl font-bold text-purple-900 mt-2">
                                                {analytics.counts.totalHotels}
                                            </p>
                                        </div>
                                        <Hotel className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>

                                <div className="bg-orange-50 border border-orange-100 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-orange-700">Total Rooms</p>
                                            <p className="text-3xl font-bold text-orange-900 mt-2">
                                                {analytics.counts.totalRooms}
                                            </p>
                                        </div>
                                        <BedDouble className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Bookings Chart */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-sm font-medium text-gray-700 mb-4">
                                        Monthly Bookings
                                    </h2>

                                    <Suspense fallback={<ChartLoader />}>
                                        <AnalyticsLineChart
                                            data={bookingsData}
                                            xKey="month"
                                            yKey="bookings"
                                            label="Bookings"
                                            strokeColor="#2563eb"
                                            valueFormatter={(value) => value.toLocaleString()}
                                        />
                                    </Suspense>
                                </div>

                                {/* Revenue Days */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-sm font-medium text-gray-700 mb-4">
                                        Top Revenue Days
                                    </h2>

                                    <Suspense fallback={<ChartLoader />}>
                                        <AnalyticsBarChart
                                            data={revenueData}
                                            xKey="date"
                                            yKey="revenue"
                                            label="Revenue"
                                            barColor="#16a34a"
                                            barSize={28}
                                            valueFormatter={(value) => `₹${value.toLocaleString()}`}
                                        />
                                    </Suspense>
                                </div>
                            </div>

                            {/* Bottom Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Ratings */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-sm font-medium text-gray-700 mb-4">
                                        Average Ratings
                                    </h2>

                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={ratingData} layout="vertical">
                                            <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 2" />

                                            <XAxis
                                                type="number"
                                                domain={[0, 5]}
                                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                type="category"
                                                dataKey="category"
                                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                width={90}
                                            />

                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
                                                labelStyle={{ color: "#111827", fontWeight: 500 }}
                                            />

                                            <Bar dataKey="rating" radius={[0, 6, 6, 0]} barSize={18}>
                                                {ratingData.map((_, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={colors[index % colors.length]}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Top Hotels */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                        Top Hotels
                                    </h2>

                                    <div className="divide-y divide-gray-100">
                                        {analytics.topHotels.map((hotel, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between py-4 hover:bg-gray-50 transition rounded-md px-2"
                                            >
                                                {/* Hotel Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {hotel.hotel.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {hotel.hotel.city}
                                                    </p>
                                                </div>

                                                {/* Metrics */}
                                                <div className="flex items-center gap-6 text-sm">
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            {hotel.totalBookings}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Bookings
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="font-semibold text-green-600">
                                                            ₹{hotel.revenue.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Revenue
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 rounded-md px-2 py-1">
                                                        <span className="text-yellow-500 text-sm">★</span>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {(hotel.avgRating ?? 0).toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminDash;