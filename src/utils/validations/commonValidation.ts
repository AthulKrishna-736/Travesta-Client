import * as Yup from 'yup';

const nameRegex = /^[A-Za-z\s]+$/;

export const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(nameRegex, "First name can only contain letters and spaces")
        .max(20, "First name must be at most 20 characters")
        .required("First name is required"),

    lastName: Yup.string()
        .matches(nameRegex, "Last name can only contain letters and spaces")
        .max(20, "Last name must be at most 20 characters")
        .required("Last name is required"),

    phone: Yup.string()
        .matches(/^\+?[0-9\s()-]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
});

export const hotelSchema = Yup.object().shape({
    name: Yup.string()
        .matches(nameRegex, 'Name must contain only letters and spaces')
        .max(30, "Hotel name must be at most 30 characters")
        .required('Hotel name is required'),

    description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .max(300, "Description must be at most 300 characters")
        .required('Description is required'),

    address: Yup.string()
        .min(5, 'Address must be at least 5 characters')
        .max(40, "Address must be at most 40 characters")
        .required('Address is required'),

    state: Yup.string()
        .matches(nameRegex, 'State must contain only letters and spaces')
        .max(20, "State must be at most 20 characters")
        .required('State is required'),

    city: Yup.string()
        .matches(nameRegex, 'City must contain only letters and spaces')
        .max(20, "City must be at most 20 characters")
        .required('City is required'),
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


//plan create/edit 
export const planFormSchema = Yup.object().shape({
    name: Yup.string().required("Plan name is required").trim(),
    description: Yup.string().required("Description is required").trim(),
    price: Yup.number().required("Price is required").min(1, "Price must be positive"),
    duration: Yup.number().required("Duration is required").min(1, "Duration must be at least 1 day"),
    features: Yup.array(
        Yup.object({
            value: Yup.string().required("Feature cannot be empty").trim(),
        })
    )
        .required("At least one feature is required")
        .min(1, "At least one feature is required"),
});