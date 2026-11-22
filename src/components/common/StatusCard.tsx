import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    className: string;
    iconClassName?: string;
}

const StatsCard = ({ title, value, icon: Icon, className, iconClassName }: StatsCardProps) => {
    return (
        <div className={`${className} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>

                <Icon className={`w-6 h-6 ${iconClassName}`} />
            </div>
        </div>
    );
};

export default StatsCard;