import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const dummyUser = {
    accountStatus: {
        verified: false,
        verificationNotes: "Your account is pending admin approval.",
        googleLinked: true,
        blocked: false,
    },
};

export const AccountStatus: React.FC = () => {
    const { verified, verificationNotes, googleLinked, blocked } = dummyUser.accountStatus;

    return (
        <Card className="animate-fade-in animation-delay-400">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Account Status</span>
                    {verified ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
                    ) : blocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            Pending
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Verification Status</p>
                            <p className="text-xs text-muted-foreground">{verificationNotes}</p>
                        </div>
                        {verified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Google Account Linked</p>
                        {googleLinked ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Account Status</p>
                        {!blocked ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountStatus;
