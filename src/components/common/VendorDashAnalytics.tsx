import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import { useGetVendorAnalytics } from '@/hooks/user/useBooking';

const VendorAnalyticsDashboard = () => {
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [appliedDateRange, setAppliedDateRange] = useState({ startDate: '', endDate: '' });

    const { data: analyticsResponse, isLoading, isError } = useGetVendorAnalytics(
        appliedDateRange.startDate,
        appliedDateRange.endDate
    );

    const handleDateFilter = () => {
        setAppliedDateRange(dateRange);
    };

    const clearFilters = () => {
        setDateRange({ startDate: '', endDate: '' });
        setAppliedDateRange({ startDate: '', endDate: '' });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isError || !analyticsResponse?.success) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-red-600 text-center">
                    <p className="text-xl font-semibold">Failed to load analytics</p>
                    <p className="text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    const analyticsData = analyticsResponse.data;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Date Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-700">Filter by Date:</span>
                    </div>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleDateFilter}
                        disabled={!dateRange.startDate || !dateRange.endDate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Apply Filter
                    </button>
                    {(appliedDateRange.startDate || appliedDateRange.endDate) && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                ₹{analyticsData.summary.totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>From successful bookings</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {analyticsData.summary.totalBookings}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-blue-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Confirmed bookings</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Avg Booking Value</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                ₹{analyticsData.summary.averageBookingValue.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-purple-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>Per booking average</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Hotels</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {analyticsData.summary.activeHotels}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <Users className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                        {analyticsData.summary.activeHotels > 0 ? 'With bookings' : 'No bookings yet'}
                    </div>
                </div>
            </div>

            {/* Top 5 Hotels Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 Performing Hotels</h2>
                {analyticsData.topHotels.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Hotel Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Bookings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analyticsData.topHotels.map((hotel: any, index: any) => (
                                    <tr key={hotel.hotelId} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-medium text-gray-800">{hotel.hotelName}</td>
                                        <td className="py-3 px-4 text-green-600 font-semibold">
                                            ₹{hotel.revenue.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{hotel.bookings}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No booking data available for the selected period
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Trend Line Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Trend</h2>
                    {analyticsData.monthlyRevenue.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No revenue data available
                        </div>
                    )}
                </div>

                {/* Booking Status Pie Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Status Distribution</h2>
                    {analyticsData.bookingStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analyticsData.bookingStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analyticsData.bookingStatus.map((entry: any, index: any) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No booking status data available
                        </div>
                    )}
                </div>
            </div>

            {/* Bar Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Hotels Revenue Bar Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Top Hotels by Revenue</h2>
                    {analyticsData.topHotels.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.topHotels}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hotelName" angle={-15} textAnchor="end" height={80} interval={0} />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No hotel data available
                        </div>
                    )}
                </div>

                {/* Monthly Bookings Bar Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Bookings</h2>
                    {analyticsData.monthlyRevenue.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="bookings" fill="#f59e0b" name="Bookings" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No booking data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorAnalyticsDashboard;