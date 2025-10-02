import { Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
    hotelName: string;
    location: string;
    selectedPeriod: string;
    onPeriodChange: (period: 'week' | 'month' | 'year') => void;
}

export const DashboardHeader = ({ hotelName, location, selectedPeriod, onPeriodChange }: DashboardHeaderProps) => {
    const periods = ["week", "month", "year"];

    return (
        <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {hotelName}
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {location}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Last {selectedPeriod}</span>
                    </div>
                    <div className="flex gap-1 bg-muted rounded-lg p-1">
                        {periods.map((period) => (
                            <Button
                                key={period}
                                variant={selectedPeriod === period ? "default" : "ghost"}
                                size="sm"
                                onClick={() => onPeriodChange(period as 'week' | 'month' | 'year')}
                                className="transition-all duration-200"
                            >
                                {period}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;