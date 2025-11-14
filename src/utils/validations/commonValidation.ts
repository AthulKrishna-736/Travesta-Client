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
        .max(30, 'Hotel name must be at most 30 characters')
        .required('Hotel name is required'),

    description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .max(3000, 'Description must be at most 1000 characters')
        .required('Description is required'),

    address: Yup.string()
        .min(5, 'Address must be at least 5 characters')
        .max(50, 'Address must be at most 50 characters')
        .required('Address is required'),

    state: Yup.string()
        .matches(nameRegex, 'State must contain only letters and spaces')
        .max(20, 'State must be at most 20 characters')
        .required('State is required'),

    city: Yup.string()
        .matches(nameRegex, 'City must contain only letters and spaces')
        .max(20, 'City must be at most 20 characters')
        .required('City is required'),

    checkInTime: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (use 24-hour, e.g., 14:00)')
        .required('Check-in time is required'),

    checkOutTime: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (use 24-hour, e.g., 12:00)')
        .required('Check-out time is required'),

    minGuestAge: Yup.number()
        .typeError('Must be a number')
        .min(18, 'Guest age must be at least 18')
        .max(100, 'Guest age seems invalid')
        .required('Minimum guest age is required'),

    petsAllowed: Yup.boolean()
        .required('Pets allowed field is required')
        .transform((_, v) => v === 'true'),

    outsideFoodAllowed: Yup.boolean()
        .required('Outside food allowed field is required')
        .transform((_, v) => v === 'true'),

    specialNotes: Yup.string()
        .min(10, 'Special notes must be at least 10 characters')
        .max(3000, 'Special notes must be at most 2000 characters')
        .required('Special notes is required'),
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
        .min(5, "Description must be at least 5 characters")
        .max(100, "Description must be less than 100 characters"),
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


//ratings
export const ratingSchema = Yup.object({
    hospitality: Yup.number()
        .required("Hospitality rating is required")
        .min(1, "Minimum rating is 1 star")
        .max(5, "Maximum rating is 5 stars"),

    cleanliness: Yup.number()
        .required("Cleanliness rating is required")
        .min(1, "Minimum rating is 1 star")
        .max(5, "Maximum rating is 5 stars"),

    facilities: Yup.number()
        .required("Facilities rating is required")
        .min(1, "Minimum rating is 1 star")
        .max(5, "Maximum rating is 5 stars"),

    room: Yup.number()
        .required("Room rating is required")
        .min(1, "Minimum rating is 1 star")
        .max(5, "Maximum rating is 5 stars"),

    moneyValue: Yup.number()
        .required("Value for money rating is required")
        .min(1, "Minimum rating is 1 star")
        .max(5, "Maximum rating is 5 stars"),

    review: Yup.string()
        .required("Review is required")
        .min(20, "Review must be at least 20 characters")
        .max(400, "Review cannot exceed 400 characters"),
});
