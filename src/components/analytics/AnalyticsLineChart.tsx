import { AnalyticsLineChartProps } from "@/types/analytics.types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


const AnalyticsLineChart = <T extends Record<string, any>>({
    data,
    xKey,
    yKey,
    label = "Value",
    height = 320,
    strokeColor = "#2563eb",
    valueFormatter = (value: number) => value.toLocaleString()
}: AnalyticsLineChartProps<T>) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
                <CartesianGrid
                    stroke="#e5e7eb"
                    strokeDasharray="4 4"
                />

                <XAxis
                    dataKey={xKey}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />

                <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={valueFormatter}
                />

                <Tooltip
                    cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                    formatter={(value: number) => [
                        valueFormatter(value),
                        label,
                    ]}
                    contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                    }}
                />

                <Legend
                    verticalAlign="top"
                    height={24}
                    wrapperStyle={{ fontSize: "12px" }}
                />

                <Line
                    type="monotone"
                    dataKey={yKey}
                    name={label}
                    stroke={strokeColor}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default AnalyticsLineChart;
