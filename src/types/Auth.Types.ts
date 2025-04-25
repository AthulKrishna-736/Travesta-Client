export interface LoginFormProps {
    role: "user" | "vendor" | "admin"
    onSubmit: (data: { email: string; password: string }) => void
    isLoading: boolean
}

export type LoginFormValues = {
    email: string,
    password: string,
}

export type SignUpFormValues = {
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
    isLoading: boolean
}

export type OtpFormValues = {
    otp: string, 
    userId: string,
    purpose: 'signup' | 'reset'
}

export interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (otp: string) => void;
    userId: string
    role: "user" | "vendor"
    isLoading: boolean
}

export interface ForgotPassProps {
    onSubmit: (email: string) => void;
}

export interface ResetPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newPassword: string) => void;
}
