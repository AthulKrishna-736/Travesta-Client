import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    prefix?: string;
    suffix?: string;
}

const MetricCard = ({ title, value, icon: Icon, prefix = "", suffix = "" }: MetricCardProps) => {
    return (
        <Card className="p-6 shadow-card hover:shadow-hover transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
                    <p className="text-3xl font-bold text-foreground tabular-nums">
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </p>
                </div>
                <div className="p-3 bg-gradient-primary rounded-lg">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
            </div>
        </Card>
    );
}

export default MetricCard;