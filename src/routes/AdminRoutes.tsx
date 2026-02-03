import NotFound from '@/components/auth/Page404'
import AdminAmenities from '@/pages/admin/AdminAmenities'
import AdminChatPage from '@/pages/admin/AdminChatPage'
import AdminDash from '@/pages/admin/AdminDash'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminPlansPage from '@/pages/admin/AdminPlansPage'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminWalletPage from '@/pages/admin/AdminWalletPage'
import VendorRequestPage from '@/pages/admin/VendorRequestPage'
import ProtectGuest from '@/ProtectRoutes/ProtectGuest'
import ProtectedUser from '@/ProtectRoutes/ProtectUser'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='*' element={<NotFound />} />

      <Route path='login' element={
        <ProtectGuest>
          <AdminLoginPage />
        </ProtectGuest>
      } />

      <Route path='home' element={
        <ProtectedUser allowedRoles={['admin']}>
          <AdminDash />
        </ProtectedUser>
      } />

      <Route path="users" element={
        <ProtectedUser allowedRoles={['admin']}>
          <AdminUsers />
        </ProtectedUser>
      }
      />

      <Route path='vendor-requests' element={
        <ProtectedUser allowedRoles={['admin']}>
          <VendorRequestPage />
        </ProtectedUser>
      }
      />

      <Route path='amenities' element={
        <ProtectedUser allowedRoles={['admin']}>
          <AdminAmenities />
        </ProtectedUser>
      }
      />

      <Route path='chat' element={
        <ProtectedUser allowedRoles={['admin']}>
          <AdminChatPage />
        </ProtectedUser>
      }
      />

      <Route path='subscription' element={
        <ProtectedUser allowedRoles={['admin']}>
          <AdminPlansPage />
        </ProtectedUser>
      }
      />

      <Route path='wallet' element={
        <ProtectedUser allowedRoles={['admin']}>
          <AdminWalletPage />
        </ProtectedUser>
      }
      />

    </Routes>
  )
}

export default AdminRoutes