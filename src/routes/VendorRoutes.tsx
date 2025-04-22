import LoginPage from '@/pages/user/LoginPage'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const VendorRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='login' element={<LoginPage/>} />
        </Routes>
    )
}

export default VendorRoutes