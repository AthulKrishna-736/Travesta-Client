import { AnalyticsPieChartProps } from "@/types/analytics.types";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


const AnalyticsPieChart = <T extends Record<string, any>>({
    data,
    height = 320,
    innerRadius = 60,
    outerRadius = 100,
    centerLabel,
    showTotal = true
}: AnalyticsPieChartProps<T>) => {
    const total = data.reduce((sum: number, item) => sum + item.value, 0);

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                        />
                    ))}
                </Pie>

                {showTotal && (
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-800 text-sm font-semibold"
                    >
                        {centerLabel ?? `${total} Bookings`}
                    </text>
                )}

                <Tooltip
                    formatter={(value: number, name: string) => [
                        value,
                        name,
                    ]}
                    contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                    }}
                />

                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                        fontSize: "12px",
                        color: "#374151",
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default AnalyticsPieChart;
