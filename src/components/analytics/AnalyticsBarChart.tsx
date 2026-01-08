import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsBarChartProps {
    data: any[];
    xKey: string;
    yKey: string;
    label?: string;
    height?: number;
    barColor?: string;
    barSize?: number;
    valueFormatter?: (value: number) => string;
    xAxisAngle?: number;
    yAxisFormatter?: (value: number) => string;
}

const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
    data,
    xKey,
    yKey,
    label = "Value",
    height = 320,
    barColor = "#10b981",
    barSize = 32,
    valueFormatter = (value: number) => value.toLocaleString(),
    xAxisAngle = -20,
    yAxisFormatter,
}) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
            >
                <CartesianGrid
                    stroke="#e5e7eb"
                    strokeDasharray="4 4"
                />

                <XAxis
                    dataKey={xKey}
                    angle={xAxisAngle}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    height={70}
                />

                <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={yAxisFormatter}
                />

                <Tooltip
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

                <Bar
                    dataKey={yKey}
                    name={label}
                    fill={barColor}
                    radius={[6, 6, 0, 0]}
                    barSize={barSize}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AnalyticsBarChart;
