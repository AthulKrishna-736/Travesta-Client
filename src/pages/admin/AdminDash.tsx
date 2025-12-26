import { AdminLayout } from "@/components/layouts/AdminLayout"
import { useGetAdminAnalytics } from "@/hooks/vendor/useVendor";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IndianRupee, CalendarCheck, Hotel, BedDouble } from "lucide-react";

const AdminDash = () => {

    const { data: analyticsRes } = useGetAdminAnalytics()
    const analytics = analyticsRes?.data ?? null;

    if (!analytics) return (
        <div className="mt-16 mx-auto max-w-xl px-6 py-10 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl text-center shadow-sm animate-pulse">
            <h2 className="text-xl font-semibold mb-2">Loading Details...</h2>
            <p className="text-base">Please wait while we fetch the information.</p>
        </div>
    )

    const bookingsData = analytics.bookingsChart.map((item: any) => ({
        month: item._id,
        bookings: item.count
    }));

    const revenueData = analytics.topRevenueDays.map((item: any) => ({
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

                                    <ResponsiveContainer width="100%" height={260}>
                                        <LineChart data={bookingsData}>
                                            <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 2" />

                                            <XAxis
                                                dataKey="month"
                                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#ffffff",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "8px",
                                                    fontSize: "12px",
                                                }}
                                                labelStyle={{ color: "#111827", fontWeight: 500 }}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="bookings"
                                                stroke="#2563eb"
                                                strokeWidth={2.5}
                                                dot={{ r: 3, fill: "#2563eb" }}
                                                activeDot={{ r: 5 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Revenue Days */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h2 className="text-sm font-medium text-gray-700 mb-4">
                                        Top Revenue Days
                                    </h2>

                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={revenueData}>
                                            <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 2" />

                                            <XAxis
                                                dataKey="date"
                                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#ffffff",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "8px",
                                                    fontSize: "12px",
                                                }}
                                                labelStyle={{ color: "#111827", fontWeight: 500 }}
                                            />

                                            <Bar
                                                dataKey="revenue"
                                                fill="#16a34a"
                                                radius={[6, 6, 0, 0]}
                                                barSize={28}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
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
                                                contentStyle={{
                                                    backgroundColor: "#ffffff",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "8px",
                                                    fontSize: "12px",
                                                }}
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
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Hotels</h2>
                                    <div className="space-y-4">
                                        {analytics.topHotels.map((hotel: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 text-sm">{hotel.hotel.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{hotel.hotel.city}</p>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">{hotel.totalBookings}</p>
                                                        <p className="text-xs text-gray-500">bookings</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">₹{hotel.revenue.toLocaleString()}</p>
                                                        <p className="text-xs text-gray-500">revenue</p>
                                                    </div>
                                                    {hotel.avgRating && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-yellow-500">★</span>
                                                            <span className="font-medium text-gray-900">{hotel.avgRating}</span>
                                                        </div>
                                                    )}
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