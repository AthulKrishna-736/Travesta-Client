
export enum AUTH_APIS {
    login = '/auth/login',
    googleLogin = '/auth/google-login',
    signup = '/auth/signup',
    verifyOtp = '/auth/verifyOtp',
    forgotPass = '/auth/forgot-password',
    resendOtp = '/auth/resendOtp',
    resetPass = '/auth/reset-password',
    logout = '/auth/logout',
}

export enum USER_APIS {
    profile = '/users/profile',
    hotels = '/users/hotels',
    chat = '/users/chat',
    booking = '/users/bookings',
    wallet = '/users/wallet',
    amenities = '/users/amenites',
    payement = '/users/payment',
    transactions = '/users/transactions',
}

export enum VENDOR_APIS {
    profile = '/vendor/profile',
    hotels = '/vendor/hotels',
    rooms = '/vendor/rooms',
    chat = '/vendor/chat',
    booking = '/vendor/bookings',
    amenities = '/vendor/amenities',
    transactions = '/users/transactions',
}

export enum ADMIN_APIS {
    customers = '/admin/customers',
    vendors = '/admin/vendors',
    amenities = '/admin/amenities',
    chat = '/admin/chat',
}