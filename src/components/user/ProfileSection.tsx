import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Edit, X } from "lucide-react";
import { ProfileSectionProps, UpdateUserFormValues } from "@/types/component.types";
import { validationSchema } from "@/utils/validations/commonValidation";


export const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    const [initialValues, setInitialValues] = useState<UpdateUserFormValues>({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        id: user.id,
    });

    useEffect(() => {
        setInitialValues({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            id: user.id,
        });
    }, [user]);

    const handleSave = (values: UpdateUserFormValues) => {
        const updatedUser = {
            ...values,
            phone: values.phone,
        };
        onUpdate(updatedUser);
        setIsEditing(false);
    };

    return (
        <Card className="animate-fade-in">
            <CardHeader className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <CardTitle>Personal Information</CardTitle>
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                        {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                </div>

                {!isEditing && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                <Formik<UpdateUserFormValues>
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                    enableReinitialize
                >
                    {({ values, handleChange, handleReset, isSubmitting }) => (
                        <Form>
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* First Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                className="h-9"
                                            />
                                            <ErrorMessage
                                                name="firstName"
                                                component="div"
                                                className="text-sm text-red-500"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3">
                                            {user.firstName}
                                        </div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                className="h-9"
                                            />
                                            <ErrorMessage
                                                name="lastName"
                                                component="div"
                                                className="text-sm text-red-500"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3">
                                            {user.lastName}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3">
                                        {user.email}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={values.phone}
                                                onChange={handleChange}
                                                className="h-9"
                                            />
                                            <ErrorMessage
                                                name="phone"
                                                component="div"
                                                className="text-sm text-red-500"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3">
                                            {user.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-destructive"
                                        type="button"
                                        onClick={() => {
                                            handleReset();
                                            setIsEditing(false);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Cancel</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-green-500"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Check className="h-4 w-4" />
                                        <span className="sr-only">Save</span>
                                    </Button>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
};

export default ProfileSection;
