import NotFound from '@/components/auth/Page404'
import VendorBookingListPage from '@/pages/vendor/VendorBookingList'
import VendorChatPage from '@/pages/vendor/VendorChatPage'
import VendorCouponPage from '@/pages/vendor/VendorCouponPage'
import VendorDashboard from '@/pages/vendor/VendorDash'
import VendorForgotPassPage from '@/pages/vendor/VendorForgotPassPage'
import VendorHotelDashboard from '@/pages/vendor/VendorHotelDashboard'
import VendorHotelsPage from '@/pages/vendor/VendorHotelPage'
import VendorLoginPage from '@/pages/vendor/VendorLoginPage'
import VendorOfferPage from '@/pages/vendor/VendorOfferPage'
import VendorProfile from '@/pages/vendor/VendorProfile'
import VendorSignupPage from '@/pages/vendor/VendorSignupPage'
import VendorWalletPage from '@/pages/vendor/VendorWallet'
import ProtectGuest from '@/ProtectRoutes/ProtectGuest'
import ProtectedUser from '@/ProtectRoutes/ProtectUser'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const VendorRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='*' element={<NotFound />} />

            <Route path='login' element={
                <ProtectGuest>
                    <VendorLoginPage />
                </ProtectGuest>
            } />

            <Route path='signup' element={
                <ProtectGuest>
                    <VendorSignupPage />
                </ProtectGuest>
            } />

            <Route path='forgot-password' element={
                <ProtectGuest>
                    <VendorForgotPassPage />
                </ProtectGuest>
            } />

            <Route path='home' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorDashboard />
                </ProtectedUser>
            } />

            <Route path='profile' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorProfile />
                </ProtectedUser>
            }
            />

            <Route path='hotels' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorHotelsPage />
                </ProtectedUser>
            }
            />

            <Route path='messages' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorChatPage />
                </ProtectedUser>
            }
            />

            <Route path='bookings' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorBookingListPage />
                </ProtectedUser>
            }
            />

            <Route path='wallet' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorWalletPage />
                </ProtectedUser>
            }
            />

            <Route path='hotel-dashboard/:hotelId' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorHotelDashboard />
                </ProtectedUser>
            }
            />

            <Route path='coupons' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorCouponPage />
                </ProtectedUser>
            }
            />

            <Route path='offers' element={
                <ProtectedUser allowedRoles={['vendor']}>
                    <VendorOfferPage />
                </ProtectedUser>
            }
            />

        </Routes>
    )
}

export default VendorRoutes