import { AdminLayout } from "@/components/layouts/AdminLayout"
import { useGetAdminAnalytics } from "@/hooks/vendor/useVendor";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDash = () => {

    const { data: analyticsRes } = useGetAdminAnalytics()

    const analytics = analyticsRes?.data ?? null;

    if (!analytics) return <div>No Dashboard Data found!</div>

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
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <p className="text-sm text-gray-500">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{analytics.totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <p className="text-sm text-gray-500">Total Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.counts.totalBookings}</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <p className="text-sm text-gray-500">Total Hotels</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.counts.totalHotels}</p>
                                </div>
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <p className="text-sm text-gray-500">Total Rooms</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.counts.totalRooms}</p>
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Bookings Chart */}
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Bookings</h2>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={bookingsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                                            <YAxis stroke="#6b7280" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                            />
                                            <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Revenue Days */}
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Revenue Days</h2>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                                            <YAxis stroke="#6b7280" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                            />
                                            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Bottom Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Ratings */}
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Average Ratings</h2>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={ratingData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis type="number" domain={[0, 5]} stroke="#6b7280" fontSize={12} />
                                            <YAxis type="category" dataKey="category" stroke="#6b7280" fontSize={12} width={80} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                            />
                                            <Bar dataKey="rating" radius={[0, 4, 4, 0]}>
                                                {ratingData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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