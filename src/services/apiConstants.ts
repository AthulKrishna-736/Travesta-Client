
export const AUTH_APIS = {
    login: '/auth/login',
    googleLogin: '/auth/google-login',
    signup: '/auth/signup',
    verifyOtp: '/auth/verifyOtp',
    forgotPass: '/auth/forgot-password',
    resendOtp: '/auth/resendOtp',
    resetPass: '/auth/reset-password',
    logout: '/auth/logout',
}

export const USER_APIS = {
    profile: '/users/profile',
    hotels: '/users/hotels',
    room: '/users/room',
    chat: '/users/chat',
    booking: '/users/bookings',
    cancelBooking: '/users/booking',
    wallet: '/users/wallet',
    amenities: '/users/amenities',
    payment: '/users/payment',
    transactions: '/users/transactions',
    access: '/users/chat/access',
    customRoomDates: '/users/room/custom',
    plans: '/users/plans',
    activePlan: '/users/plans/active',
    cancelPlan: '/users/plans/cancel',
}

export const VENDOR_APIS = {
    profile: '/vendor/profile',
    hotels: '/vendor/hotels',
    hotel: '/vendor/hotel',
    rooms: '/vendor/rooms',
    chat: '/vendor/chat',
    booking: '/vendor/bookings',
    amenities: '/vendor/amenities',
    transactions: '/users/transactions',
    analytics: '/vendor/analytics',
}

export const ADMIN_APIS = {
    customers: '/admin/customers',
    vendors: '/admin/vendors',
    amenities: '/admin/amenities',
    chat: '/admin/chat',
    plans: '/admin/plans',
    planHistory: '/admin/plans/history',
}