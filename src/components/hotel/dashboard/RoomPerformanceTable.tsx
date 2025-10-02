import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

interface RoomData {
    _id: string;
    name: string;
    type: string;
    bookings: number;
    revenue: number;
}

interface RoomPerformanceTableProps {
    data: RoomData[];
}

export const RoomPerformanceTable = ({ data }: RoomPerformanceTableProps) => {
    return (
        <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-6">Top Performing Rooms</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                                    Rank
                                </div>
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                                    Room Name
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Type</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">
                                <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground transition-colors">
                                    Bookings
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">
                                <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground transition-colors">
                                    Revenue
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((room, idx) => (
                            <tr
                                key={room._id}
                                className="border-b border-border hover:bg-muted/50 transition-colors"
                            >
                                <td className="py-4 px-2">
                                    <Badge variant={idx + 1 === 1 ? "default" : "secondary"} className="font-semibold">
                                        #{idx + 1}
                                    </Badge>
                                </td>
                                <td className="py-4 px-2 font-medium text-foreground">{room.name}</td>
                                <td className="py-4 px-2 text-sm text-muted-foreground">{room.type}</td>
                                <td className="py-4 px-2 text-right font-semibold text-foreground tabular-nums">
                                    {room.bookings}
                                </td>
                                <td className="py-4 px-2 text-right font-semibold text-foreground tabular-nums">
                                    ₹{room.revenue.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default RoomPerformanceTable;
