import * as Yup from 'yup';

const nameRegex = /^[A-Za-z\s]+$/;
const tagAmenityServiceRegex = /^[A-Za-z0-9,\s]+$/;


export const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .matches(nameRegex, "First name can only contain letters and spaces")
        .required("First name is required"),
    lastName: Yup.string()
        .matches(nameRegex, "First name can only contain letters and spaces")
        .required("Last name is required"),
    phone: Yup.string()
        .matches(/^\+?[0-9\s()-]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
});




export const hotelSchema = Yup.object().shape({
    name: Yup.string()
        .matches(nameRegex, 'Name must contain only letters and spaces')
        .required('Hotel name is required'),

    description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .required('Description is required'),

    address: Yup.string()
        .min(5, 'Address must be at least 5 characters')
        .required('Address is required'),

    state: Yup.string()
        .matches(nameRegex, 'State must contain only letters and spaces')
        .required('State is required'),

    city: Yup.string()
        .matches(nameRegex, 'City must contain only letters and spaces')
        .required('City is required'),

    tags: Yup.string()
        .matches(tagAmenityServiceRegex, 'Tags must be letters, numbers, or commas')
        .required('tags are required'),

    amenities: Yup.string()
        .matches(tagAmenityServiceRegex, 'Amenities must be letters, numbers, or commas')
        .required('amenities are required'),

    services: Yup.string()
        .matches(tagAmenityServiceRegex, 'Services must be letters, numbers, or commas')
        .required('services are required'),
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