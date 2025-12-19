import { Clock, LogOut, Users, PawPrint, Utensils, CreditCard, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import CollapsibleText from "../common/CollapseText";

interface PropertyRulesData {
    checkInTime?: string;
    checkOutTime?: string;
    minGuestAge?: number;
    petsAllowed?: boolean;
    outsideFoodAllowed?: boolean;
    idProofAccepted?: string[];
    specialNotes?: string;
}

interface PropertyRulesProps {
    propertyRules?: PropertyRulesData;
}

const PropertyRules = ({ propertyRules }: PropertyRulesProps) => {
    const rules = [
        {
            icon: Clock,
            label: "Check-In",
            value: propertyRules?.checkInTime || '--',
            type: "time" as const,
        },
        {
            icon: LogOut,
            label: "Check-Out",
            value: propertyRules?.checkOutTime || '--',
            type: "time" as const,
        },
        {
            icon: Users,
            label: "Minimum Guest Age",
            value: propertyRules?.minGuestAge ? `${propertyRules.minGuestAge} years` : '--',
            type: "text" as const,
        },
        {
            icon: PawPrint,
            label: "Pets Allowed",
            value: propertyRules?.petsAllowed ?? null,
            type: "boolean" as const,
        },
        {
            icon: Utensils,
            label: "Outside Food Allowed",
            value: propertyRules?.outsideFoodAllowed ?? null,
            type: "boolean" as const,
        },
    ];

    return (
        <div>
            <div>
                <h2 className="text-xl font-semibold">Property Rules</h2>
            </div>

            <div className="p-6 space-y-6">
                {/* Main Rules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rules.map((rule, index) => {
                        const Icon = rule.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 rounded-lg bg-muted/80 hover:bg-muted transition-colors"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#def2f5] flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-[#00c1d6]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        {rule.label}
                                    </p>
                                    {rule.type === "boolean" ? (
                                        <div className="flex items-center gap-1.5">
                                            {rule.value === true ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-[#21c45d]" />
                                                    <span className="text-sm font-semibold text-[#21c45d]">Yes</span>
                                                </>
                                            ) : rule.value === false ? (
                                                <>
                                                    <XCircle className="w-4 h-4 text-destructive" />
                                                    <span className="text-sm font-semibold text-destructive">No</span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-medium text-muted-foreground">--</span>
                                            )}
                                        </div>
                                    ) : rule.type === "time" ? (
                                        <p className="text-base font-semibold text-card-foreground">
                                            {rule.value !== '--'
                                                ? new Date(`1970-01-01T${rule.value}:00`).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })
                                                : '--'}                                        </p>
                                    ) : (
                                        <p className="text-base font-semibold text-card-foreground">
                                            {rule.value}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ID Proofs Section */}
                {propertyRules?.idProofAccepted && propertyRules.idProofAccepted.length > 0 && (
                    <div className="p-4 rounded-lg bg-[#e1fbfe] border border-border">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#caf4f9] flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-[#00c1d6]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#00c1d6] mb-2">
                                    ID Proofs Accepted
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {propertyRules.idProofAccepted.map((proof: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-card text-card-foreground border border-border"
                                        >
                                            {proof}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Special Notes Section */}
                {propertyRules?.specialNotes && (
                    <div className="p-4 rounded-lg bg-gray-100">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-[#f6a71e]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium mb-2">
                                    Special Notes
                                </p>
                                <CollapsibleText text={propertyRules.specialNotes} limit={250}/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyRules;
