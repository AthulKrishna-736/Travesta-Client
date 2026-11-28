import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface AnalyticsHorizontalBarChartProps<T extends Record<string, unknown>> {
    data: T[];
    xKey: keyof T;
    yKey: keyof T;
}

const colors = ["#6366f1", "#0ea5e9", "#a855f7", "#10b981", "#f59e0b"];

const AnalyticsHorizontalBarChart = <T extends Record<string, unknown>>({
    data,
    xKey,
    yKey,
}: AnalyticsHorizontalBarChartProps<T>) => {
    return (
        <ResponsiveContainer width="100%" height="95%">
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
                barCategoryGap="25%"
            >
                <CartesianGrid
                    stroke="#f1f5f9"
                    strokeDasharray="3 3"
                    horizontal={false}
                />

                <XAxis
                    type="number"
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />

                <YAxis
                    type="category"
                    dataKey={String(xKey)}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                />

                <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    formatter={(value) => [
                        `${Number(value).toFixed(1)} / 5`,
                        "Rating",
                    ]}
                    contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #f1f5f9",
                        borderRadius: "10px",
                        fontSize: "12px",
                        padding: "8px 12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    }}
                    labelStyle={{
                        color: "#334155",
                        fontWeight: 600,
                        marginBottom: "4px",
                    }}
                />

                <Bar
                    dataKey={String(yKey)}
                    radius={[0, 6, 6, 0]}
                    barSize={16}
                    animationDuration={800}
                >
                    {data.map((_, index) => (
                        <Cell
                            key={index}
                            fill={colors[index % colors.length]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AnalyticsHorizontalBarChart;