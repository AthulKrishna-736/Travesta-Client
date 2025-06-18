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


export const createAmenitySchema = Yup.object({
    name: Yup.string()
        .required("Name is required")
        .matches(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
    description: Yup.string()
        .required("Description is required")
        .matches(/^[A-Za-z0-9\s,.'"-?!()&]+$/, "Description can contain letters, numbers, spaces, and basic punctuation")
        .min(5, "Description must be at least 5 characters"),
});