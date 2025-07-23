import NotFound from '@/components/auth/Page404'
import UserHotelPage from '@/pages/user/HotelPage'
import UserChatPage from '@/pages/user/UserChatPage'
import UserDashboard from '@/pages/user/UserDashboard'
import UserForgotPassPage from '@/pages/user/UserForgotPassPage'
import UserHomePage from '@/pages/user/UserHomePage'
import UserLoginPage from '@/pages/user/UserLoginPage'
import UserSignupPage from '@/pages/user/UserSignupPage'
import ProtectGuest from '@/ProtectRoutes/ProtectGuest'
import ProtectedUser from '@/ProtectRoutes/ProtectUser'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='*' element={<NotFound />} />

      <Route path='login' element={
        <ProtectGuest>
          <UserLoginPage />
        </ProtectGuest>
      } />

      <Route path='signup' element={
        <ProtectGuest>
          <UserSignupPage />
        </ProtectGuest>
      } />

      <Route path='forgot-password' element={
        <ProtectGuest>
          <UserForgotPassPage />
        </ProtectGuest>
      } />

      <Route path='home' element={
        <ProtectedUser>
          <UserHomePage />
        </ProtectedUser>
      } />

      <Route path='profile' element={
        <ProtectedUser>
          <UserDashboard />
        </ProtectedUser>
      } />

      <Route path='/hotels' element={
        <ProtectedUser>
          <UserHotelPage />
        </ProtectedUser>
      }
      />

      <Route path='chat' element={
        <ProtectedUser>
          <UserChatPage />
        </ProtectedUser>
      } />
    </Routes>
  )
}

export default UserRoutes