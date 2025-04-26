export type TRoles = 'user' | 'vendor' | 'admin'

export interface LoginFormProps {
    role: TRoles
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
    role: Exclude<TRoles, 'admin'>
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
    role: Exclude<TRoles, 'admin'>
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

export type ResentOtpValues = {
    userId: string
}