import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BookingsStatusChartProps {
    data: Array<{ name: string; value: number; color: string }>;
}

export const BookingsStatusChart = ({ data }: BookingsStatusChartProps) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-6">Bookings by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                            fontSize: "14px",
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value: any, entry: any) => (
                            <span className="text-sm text-foreground">
                                {value}: <span className="font-semibold">{entry.payload.value}</span>
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
                <p className="text-2xl font-bold text-foreground">{total}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
        </Card>
    );
}

export default BookingsStatusChart;