import ForgotPassPage from '@/pages/user/ForgotPassPage'
import LoginPage from '@/pages/user/LoginPage'
import SignupPage from '@/pages/user/SignupPage'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const UserRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='login' element={<LoginPage/>}/>
        <Route path='signup' element={<SignupPage/>}/>
        <Route path='forgot-password' element={<ForgotPassPage/>}/>
    </Routes>
  )
}

export default UserRoutes