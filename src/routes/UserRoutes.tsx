import NotFound from '@/components/auth/Page404'
import UserHotelPage from '@/pages/user/UserHotelPage'
import UserAboutPage from '@/pages/user/UserAboutUsPage'
import UserBookingListPage from '@/pages/user/UserBookingListPage'
import UserChatPage from '@/pages/user/UserChatPage'
import UserCheckoutPage from '@/pages/user/UserCheckout'
import UserDashboard from '@/pages/user/UserDashboard'
import UserForgotPassPage from '@/pages/user/UserForgotPassPage'
import UserHomePage from '@/pages/user/UserHomePage'
import UserHotelDetailPage from '@/pages/user/UserHotelDetailPage'
import UserLoginPage from '@/pages/user/UserLoginPage'
import UserSignupPage from '@/pages/user/UserSignupPage'
import UserWallet from '@/pages/user/UserWallet'
import ProtectGuest from '@/ProtectRoutes/ProtectGuest'
import ProtectedUser from '@/ProtectRoutes/ProtectUser'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SubscriptionPage from '@/pages/user/UserSubscriptionPage'

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

      <Route path='hotels' element={<UserHotelPage />} />

      <Route path="hotels/:hotelId" element={<UserHotelDetailPage />} />

      <Route path='chat' element={
        <ProtectedUser>
          <UserChatPage />
        </ProtectedUser>
      } />

      <Route path='booking' element={
        <ProtectedUser>
          <UserBookingListPage />
        </ProtectedUser>
      } />

      <Route path='wallet' element={
        <ProtectedUser>
          <UserWallet />
        </ProtectedUser>
      } />

      <Route path='checkout' element={<UserCheckoutPage />} />

      <Route path='subscription' element={
        <ProtectedUser>
          <SubscriptionPage />
        </ProtectedUser>
      } />

      <Route path='about-us' element={<UserAboutPage />} />

    </Routes>
  )
}

export default UserRoutes