import { Card } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface RevenueChartProps {
    data: Array<{ date: string; revenue: number }>;
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
    return (
        <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} /> {/* soft blue */}
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} /> {/* light gray grid */}
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280" /* muted gray */
                        fontSize={12}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#f9fafb", // very light gray
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                        }}
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default RevenueChart;
