import NotFound from '@/components/auth/Page404'
import VendorBookingListPage from '@/pages/vendor/VendorBookingList'
import VendorChatPage from '@/pages/vendor/VendorChatPage'
import VendorDashboard from '@/pages/vendor/VendorDash'
import VendorForgotPassPage from '@/pages/vendor/VendorForgotPassPage'
import VendorHotelsPage from '@/pages/vendor/VendorHotelPage'
import VendorLoginPage from '@/pages/vendor/VendorLoginPage'
import VendorProfile from '@/pages/vendor/VendorProfile'
import VendorSignupPage from '@/pages/vendor/VendorSignupPage'
import VendorWalletPage from '@/pages/vendor/VendorWallet'
import ProtectGuestVendor from '@/ProtectRoutes/GuestVendor'
import ProtectVendor from '@/ProtectRoutes/ProtectVendor'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const VendorRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='*' element={<NotFound />} />


            <Route path='login' element={
                <ProtectGuestVendor>
                    <VendorLoginPage />
                </ProtectGuestVendor>
            } />

            <Route path='signup' element={
                <ProtectGuestVendor>
                    <VendorSignupPage />
                </ProtectGuestVendor>
            } />

            <Route path='forgot-password' element={
                <ProtectGuestVendor>
                    <VendorForgotPassPage />
                </ProtectGuestVendor>
            } />

            <Route path='home' element={
                <ProtectVendor>
                    <VendorDashboard />
                </ProtectVendor>
            } />

            <Route path='profile' element={
                <ProtectVendor>
                    <VendorProfile />
                </ProtectVendor>
            }
            />

            <Route path='hotels' element={
                <ProtectVendor>
                    <VendorHotelsPage />
                </ProtectVendor>
            }
            />

            <Route path='messages' element={
                <ProtectVendor>
                    <VendorChatPage />
                </ProtectVendor>
            }
            />

            <Route path='bookings' element={
                <ProtectVendor>
                    <VendorBookingListPage />
                </ProtectVendor>
            }
            />

            <Route path='wallet' element={
                <ProtectVendor>
                    <VendorWalletPage />
                </ProtectVendor>
            }
            />

        </Routes>
    )
}

export default VendorRoutes