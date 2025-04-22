export interface LoginFormProps {
    role: "user" | "vendor" | "admin"
    onSubmit: (data: { email: string; password: string }) => void
}

export interface SignUpFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: string;
    subscriptionType: string;
}

export interface SignUpFormProps {
    role: "user" | "vendor"
    onSubmit: (values: SignUpFormValues) => void;
}

export interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (otp: string) => void;
}

export interface ForgotPassProps {
    onSubmit: (email: string) => void;
}

export interface ResetPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newPassword: string) => void;
  }
  