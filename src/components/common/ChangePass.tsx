import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "@/utils/validations/authValidation";
import { useChangePassword } from "@/hooks/user/useUser";

interface ChangePasswordFormValues {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onClose }) => {
    const [show, setShow] = useState({ old: false, new: false, confirm: false });

    const { register, handleSubmit, formState: { errors }, reset, } = useForm<ChangePasswordFormValues>({
        resolver: yupResolver(changePasswordSchema),
    });

    const { mutate: changePasswordMutate, isPending: loading } = useChangePassword();

    const onSubmit = (values: ChangePasswordFormValues) => {
        changePasswordMutate({ oldPassword: values.oldPassword, newPassword: values.newPassword },
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            }
        );
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Current Password */}
                    <div className="relative">
                        <Input type={show.old ? "text" : "password"} placeholder="Current Password" {...register("oldPassword")} />
                        <button type="button" className="absolute right-3 top-2.5 text-sm text-muted-foreground cursor-pointer"
                            onClick={() => setShow({ ...show, old: !show.old })}
                        >
                            {show.old ? "Hide" : "Show"}
                        </button>
                        {errors.oldPassword && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.oldPassword.message}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <Input type={show.new ? "text" : "password"} placeholder="New Password" {...register("newPassword")} />
                        <button type="button" className="absolute right-3 top-2.5 text-sm text-muted-foreground cursor-pointer"
                            onClick={() => setShow({ ...show, new: !show.new })}
                        >
                            {show.new ? "Hide" : "Show"}
                        </button>
                        {errors.newPassword && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Input type={show.confirm ? "text" : "password"} placeholder="Confirm New Password" {...register("confirmPassword")} />
                        <button type="button" className="absolute right-3 top-2.5 text-sm text-muted-foreground cursor-pointer"
                            onClick={() =>
                                setShow({ ...show, confirm: !show.confirm })
                            }
                        >
                            {show.confirm ? "Hide" : "Show"}
                        </button>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <Button type="button" variant="ghost" disabled={loading} className="cursor-pointer"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" className="cursor-pointer" disabled={loading}>
                            {loading ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
