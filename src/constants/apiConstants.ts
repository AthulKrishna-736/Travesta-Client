export const AUTH_APIS = {
    login: '/login',
    googleLogin: '/google-login',
    signup: '/signup',
    verifyOtp: '/otp/verify',
    forgotPass: '/forgot-password',
    resendOtp: '/otp/resend',
    resetPass: '/reset-password',
    logout: '/logout',
}

export const USER_APIS = {
    profile: '/users/profile',
    hotels: '/users/hotels',
    rooms: '/users/rooms',
    chat: '/users/chat',
    changePass: '/users/password',
    bookings: '/users/bookings',
    wallets: '/users/wallets',
    amenities: '/users/amenities',
    payments: '/users/payments',
    transactions: '/users/transactions',
    access: '/users/chat/access',
    plans: '/users/plans',
    ratings: '/users/ratings',
    coupons: '/users/coupons',
    notifications: '/users/notifications',
}

export const VENDOR_APIS = {
    profile: '/vendor/profile',
    hotels: '/vendor/hotels',
    rooms: '/vendor/rooms',
    chat: '/vendor/chat',
    booking: '/vendor/bookings',
    amenities: '/vendor/amenities',
    transactions: '/users/transactions',
    analytics: '/vendor/analytics',
    ratings: '/vendor/ratings',
    coupon: '/vendor/coupons',
    offers: '/vendor/offers'
}

export const ADMIN_APIS = {
    users: '/admin/users',
    vendors: '/admin/vendors',
    amenities: '/admin/amenities',
    chat: '/admin/chat',
    plans: '/admin/plans',
    planHistory: '/admin/plans/history',
    analytics: '/admin/analytics'
}