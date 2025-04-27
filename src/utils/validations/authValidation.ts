import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .email("Must be a valid email address")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
            "Only standard emails allowed (no emojis or weird symbols)"
        ),

    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "At least one uppercase letter required (A-Z)")
        .matches(/[a-z]/, "At least one lowercase letter required (a-z)")
        .matches(/[0-9]/, "At least one number required (0-9)")
        .matches(/[@$!%*?&]/, "At least one special character required (@$!%*?&)")
});


export const signupValidationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
    password: Yup.string()
        .min(6, "Minimum 6 characters")
        .matches(/[A-Z]/, "Must include an uppercase letter")
        .matches(/[a-z]/, "Must include a lowercase letter")
        .matches(/\d/, "Must include a number")
        .matches(/[!@#$%^&*]/, "Must include a special character")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});


export const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
        .length(6, 'OTP must be exactly 6 digits')
        .matches(/^\d{6}$/, 'OTP must contain only digits')
        .required('OTP is required'),
});


export const forgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Must be a valid email address')
        .required('Email is required')
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Invalid email format'
        ),
});


export const resetPasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .matches(/[A-Z]/, "Must include an uppercase letter")
        .matches(/[a-z]/, "Must include a lowercase letter")
        .matches(/\d/, "Must include a number")
        .matches(/[!@#$%^&*]/, "Must include a special character"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});
