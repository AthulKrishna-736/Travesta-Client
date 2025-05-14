import VendorDashboard from '@/pages/vendor/VendorDash'
import VendorForgotPassPage from '@/pages/vendor/VendorForgotPassPage'
import VendorLoginPage from '@/pages/vendor/VendorLoginPage'
import VendorProfile from '@/pages/vendor/VendorProfile'
import VendorSignupPage from '@/pages/vendor/VendorSignupPage'
import ProtectGuestVendor from '@/ProtectRoutes/GuestVendor'
import ProtectVendor from '@/ProtectRoutes/ProtectVendor'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const VendorRoutes: React.FC = () => {
    return (
        <Routes>
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

        </Routes>
    )
}

export default VendorRoutes