export type TRoles = 'user' | 'vendor' | 'admin'

export interface ILoginFormProps {
    role: TRoles
    onSubmit: (data: { email: string; password: string }) => void
    isLoading: boolean
}

export type TLoginFormValues = {
    email: string,
    password: string,
}

export type TSignUpFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: string;
    subscriptionType: string;
}

export interface ISignUpFormProps {
    role: Exclude<TRoles, 'admin'>
    onSubmit: (values: TSignUpFormValues) => void;
    isLoading: boolean
}

export type TOtpFormValues = {
    otp: string,
    userId: string,
    purpose: 'signup' | 'reset'
}

export interface IOtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (otp: string) => void;
    userId: string
    role: Exclude<TRoles, 'admin'>
    isLoading: boolean
    purpose: 'signup' | 'reset'
}

export interface IForgotPassProps {
    onSubmit: (email: string) => void;
    isLoading: boolean
}

export interface IResetPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newPassword: string) => void;
    isLoading: boolean
}

export type TResentOtpValues = {
    userId: string
}

export type TForgotPassValues = {
    email: string
}

export type TResetPassValues = {
    email: string,
    password: string,
}

export type TGoogleLoginValues = {
    credential: string,
    role: Exclude<TRoles, 'admin'>
}

export interface IGoogleLoginProps {
    role: Exclude<TRoles, 'admin'>
}