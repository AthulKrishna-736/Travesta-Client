import { lazy, Suspense, useState } from 'react';
import { Calendar, Users, IndianRupee } from 'lucide-react';
import { useGetVendorAnalytics } from '@/hooks/user/useBooking';
import ChartLoader from '../common/ChartLoader';

const AnalyticsBarChart = lazy(() => import('./AnalyticsBarChart'));
const AnalyticsLineChart = lazy(() => import('./AnalyticsLineChart'));
const AnalyticsPieChart = lazy(() => import('./AnalyticsPieChart'));

const VendorAnalyticsDashboard = () => {
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [appliedDateRange, setAppliedDateRange] = useState({ startDate: '', endDate: '' });

    const { data: analyticsResponse, isLoading, isError } = useGetVendorAnalytics(appliedDateRange.startDate, appliedDateRange.endDate);

    const handleDateFilter = () => {
        setAppliedDateRange(dateRange);
    };

    const clearFilters = () => {
        setDateRange({ startDate: '', endDate: '' });
        setAppliedDateRange({ startDate: '', endDate: '' });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="p-6 min-h-screen">
            {/* Date Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-700">Filter by Date:</span>
                    </div>
                    <input
                        type="date"
                        max={today}
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        max={today}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                {/* Total Revenue */}
                <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-700">Total Revenue</p>
                            <p className="text-3xl font-bold text-green-900 mt-2">
                                ₹{analyticsData.summary.totalRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                From successful bookings
                            </p>
                        </div>
                        <IndianRupee className="w-6 h-6 text-green-600" />
                    </div>
                </div>

                {/* Total Bookings */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-700">Total Bookings</p>
                            <p className="text-3xl font-bold text-blue-900 mt-2">
                                {analyticsData.summary.totalBookings}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                Confirmed bookings
                            </p>
                        </div>
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                {/* Avg Booking Value */}
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-700">Avg Booking Value</p>
                            <p className="text-3xl font-bold text-purple-900 mt-2">
                                ₹{analyticsData.summary.averageBookingValue.toFixed(2)}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                                Per booking average
                            </p>
                        </div>
                        <IndianRupee className="w-6 h-6 text-purple-600" />
                    </div>
                </div>

                {/* Active Hotels */}
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-700">Active Hotels</p>
                            <p className="text-3xl font-bold text-orange-900 mt-2">
                                {analyticsData.summary.activeHotels}
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                                {analyticsData.summary.activeHotels > 0 ? 'With bookings' : 'No bookings yet'}
                            </p>
                        </div>
                        <Users className="w-6 h-6 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Top 5 Hotels Table */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Top 5 Performing Hotels
                    </h2>
                </div>

                {analyticsData.topHotels.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-semibold text-gray-600">
                                        Rank
                                    </th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-600">
                                        Hotel Name
                                    </th>
                                    <th className="py-3 px-4 text-right font-semibold text-gray-600">
                                        Revenue
                                    </th>
                                    <th className="py-3 px-4 text-right font-semibold text-gray-600">
                                        Bookings
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {analyticsData.topHotels.map((hotel: any, index: number) => (
                                    <tr
                                        key={hotel.hotelId}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-blue-50 text-blue-700 font-semibold">
                                                {index + 1}
                                            </span>
                                        </td>

                                        <td className="py-3 px-4 font-medium text-gray-800">
                                            {hotel.hotelName}
                                        </td>

                                        <td className="py-3 px-4 text-right font-semibold text-green-700">
                                            ₹{hotel.revenue.toLocaleString()}
                                        </td>

                                        <td className="py-3 px-4 text-right text-gray-700">
                                            {hotel.bookings}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                        No booking data available for the selected period
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Trend Line Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Revenue Trend
                        </h2>
                    </div>

                    {analyticsData.monthlyRevenue.length > 0 ? (
                        <Suspense fallback={<ChartLoader />}>
                            <AnalyticsLineChart
                                data={analyticsData.monthlyRevenue}
                                xKey="month"
                                yKey="revenue"
                                label="Revenue"
                                strokeColor="#2563eb"
                                valueFormatter={(value) => `₹${value / 1000}k`}
                            />
                        </Suspense>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-sm text-gray-500">
                            No revenue data available
                        </div>
                    )}
                </div>

                {/* Booking Status Pie Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Booking Status Distribution
                        </h2>
                    </div>

                    {analyticsData.bookingStatus.length > 0 ? (
                        <Suspense fallback={<ChartLoader />}>
                            <AnalyticsPieChart
                                data={analyticsData.bookingStatus}
                                centerLabel={`${analyticsData.bookingStatus.reduce((sum: number, item: any) => sum + item.value, 0)} Bookings`}
                            />
                        </Suspense>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-sm text-gray-500">
                            No booking status data available
                        </div>
                    )}
                </div>
            </div>

            {/* Bar Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Hotels by Revenue */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Top Hotels by Revenue
                    </h2>

                    {analyticsData.topHotels.length > 0 ? (
                        <Suspense fallback={<ChartLoader />}>
                            <AnalyticsBarChart
                                data={analyticsData.topHotels}
                                xKey="hotelName"
                                yKey="revenue"
                                label="Revenue"
                                barColor="#10b981"
                                valueFormatter={(value) => `₹${value.toLocaleString()}`}
                                yAxisFormatter={(value) => `₹${value / 1000}k`}
                            />
                        </Suspense>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-sm text-gray-500">
                            No hotel data available
                        </div>
                    )}
                </div>

                {/* Monthly Bookings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Monthly Bookings
                    </h2>

                    {analyticsData.monthlyRevenue.length > 0 ? (
                        <Suspense fallback={<ChartLoader />}>
                            <AnalyticsBarChart
                                data={analyticsData.monthlyRevenue}
                                xKey="month"
                                yKey="bookings"
                                label="Bookings"
                                barColor="#f59e0b"
                                valueFormatter={(value) => value.toLocaleString()}
                            />
                        </Suspense>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-sm text-gray-500">
                            No booking data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorAnalyticsDashboard;