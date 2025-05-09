import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phone: Yup.string()
        .matches(/^\+?[0-9\s()-]{10,}$/, "Invalid phone number")
        .required("Phone number is required"),
});