import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { ProfileSectionProps, UpdateUserFormValues } from "@/types/user.types";
import { validationSchema } from "@/utils/validations/commonValidation";
import ChangePasswordModal from "../common/ChangePass";

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [initialValues, setInitialValues] = useState<UpdateUserFormValues>({
        firstName: "",
        lastName: "",
        email: "",
        phone: 0,
    });

    useEffect(() => {
        setInitialValues({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || 0,
        });
    }, [user]);

    const handleSave = (values: UpdateUserFormValues) => {
        const { firstName, lastName, phone } = values;
        onUpdate({ firstName, lastName, phone });
        setIsEditing(false);
    };

    return (
        <div className="bg-[#e0dff6] rounded-md p-6">
            {/* Info and edit button */}
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.role == 'user' ? 'hidden' : ''} ${user.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                        {user.isVerified ? "Verified" : "Unverified"}
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
            </div>

            {/* User Details & Inputs */}
            <div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                    enableReinitialize
                >
                    {({ values, handleChange, handleReset }) => (
                        <Form>
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* First Name */}
                                <div className="grid gap-2">
                                    <Label className="text-lg mx-1" htmlFor="firstName">First Name</Label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                className="h-13 !text-lg bg-[#eae9f5]"
                                            />
                                            <ErrorMessage
                                                name="firstName"
                                                component="div"
                                                className="text-sm text-red-500"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex h-13 text-lg items-center rounded-md border bg-muted/50 px-3">
                                            {user.firstName}
                                        </div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="grid gap-2">
                                    <Label className="text-lg mx-1" htmlFor="lastName">Last Name</Label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                className="h-13 !text-lg bg-[#eae9f5]"
                                            />
                                            <ErrorMessage
                                                name="lastName"
                                                component="div"
                                                className="text-sm text-red-500"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex h-13 text-lg items-center rounded-md border bg-muted/50 px-3">
                                            {user.lastName}
                                        </div>
                                    )}
                                </div>

                                {/* Email - always non-editable */}
                                <div className="grid gap-2">
                                    <Label className="text-lg mx-1" htmlFor="email">Email</Label>
                                    <div className="flex h-13 text-lg font-semibold items-center rounded-md border bg-muted/50 px-3">
                                        {user.email}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="grid gap-2">
                                    <Label className="text-lg mx-1" htmlFor="phone">Phone Number</Label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={values.phone}
                                                onChange={handleChange}
                                                className="h-13 !text-lg bg-[#eae9f5]"
                                            />
                                            <ErrorMessage
                                                name="phone"
                                                component="div"
                                                className="text-sm text-red-500"
                                            />
                                        </>
                                    ) : (
                                        <div className="flex h-13 text-lg items-center rounded-md border bg-muted/50 px-3">
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
                                        className="text-destructive"
                                        type="button"
                                        onClick={() => {
                                            handleReset();
                                            setIsEditing(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-green-500"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>

                {/* Password */}
                <div className="mt-2 grid gap-2">
                    <Label className="text-lg mx-1">Password</Label>
                    <div className="flex h-13 text-lg items-center justify-between rounded-md border bg-muted/50 px-3">
                        <span className="text-muted-foreground">********</span>
                        <Button className="cursor-pointer" type="button" variant="ghost" size="sm" onClick={() => setShowPasswordModal(true)}>
                            Change
                        </Button>
                    </div>
                </div>

                <ChangePasswordModal
                    open={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                />
            </div>
        </div>
    );
};

export default ProfileSection;
