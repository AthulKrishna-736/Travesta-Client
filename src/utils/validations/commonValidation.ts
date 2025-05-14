import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "First name can only contain letters and spaces")
        .required("First name is required"),
    lastName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "First name can only contain letters and spaces")
        .required("Last name is required"),
    phone: Yup.string()
        .matches(/^\+?[0-9\s()-]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
});