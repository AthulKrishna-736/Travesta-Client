import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: LucideIcon;
    prefix?: string;
    suffix?: string;
}

export const MetricCard = ({ title, value, change, icon: Icon, prefix = "", suffix = "" }: MetricCardProps) => {
    const isPositive = change! >= 0;

    return (
        <Card className="p-6 shadow-card hover:shadow-hover transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
                    <p className="text-3xl font-bold text-foreground tabular-nums">
                        {prefix}{typeof value && value === 'number' ? value.toLocaleString() : value}{suffix}
                    </p>
                    {/* <div className="flex items-center gap-1 mt-2">
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <span className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                            {Math.abs(change)}%
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">vs last period</span>
                    </div> */}
                </div>
                <div className="p-3 bg-gradient-primary rounded-lg">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
            </div>
        </Card>
    );
}

export default MetricCard;