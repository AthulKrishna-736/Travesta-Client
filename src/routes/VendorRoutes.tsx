import VendorForgotPassPage from '@/pages/vendor/VendorForgotPassPage'
import VendorLoginPage from '@/pages/vendor/VendorLoginPage'
import VendorSignupPage from '@/pages/vendor/VendorSignupPage'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const VendorRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='login' element={<VendorLoginPage/>} />
            <Route path='signup' element={<VendorSignupPage/>} />
            <Route path='forgot-password' element={<VendorForgotPassPage/>} />
            
        </Routes>
    )
}

export default VendorRoutes