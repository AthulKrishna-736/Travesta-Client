import NotFound from '@/components/auth/Page404'
import AdminAmenities from '@/pages/admin/AdminAmenities'
import AdminChatPage from '@/pages/admin/AdminChatPage'
import AdminDash from '@/pages/admin/AdminDash'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminPlansPage from '@/pages/admin/AdminPlansPage'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminWalletPage from '@/pages/admin/AdminWalletPage'
import VendorRequestPage from '@/pages/admin/VendorRequestPage'
import ProtectAdminGuest from '@/ProtectRoutes/GuestAdmin'
import ProtectedAdmin from '@/ProtectRoutes/ProtectAdmin'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='*' element={<NotFound />} />

      <Route path='login' element={
        <ProtectAdminGuest>
          <AdminLoginPage />
        </ProtectAdminGuest>
      } />

      <Route path='dashboard' element={
        <ProtectedAdmin>
          <AdminDash />
        </ProtectedAdmin>
      } />

      <Route path="users" element={
        <ProtectedAdmin>
          <AdminUsers />
        </ProtectedAdmin>
      }
      />

      <Route path='vendor-requests' element={
        <ProtectedAdmin>
          <VendorRequestPage />
        </ProtectedAdmin>
      }
      />

      <Route path='amenities' element={
        <ProtectedAdmin>
          <AdminAmenities />
        </ProtectedAdmin>
      }
      />

      <Route path='chat' element={
        <ProtectedAdmin>
          <AdminChatPage />
        </ProtectedAdmin>
      }
      />

      <Route path='subscription' element={
        <ProtectedAdmin>
          <AdminPlansPage />
        </ProtectedAdmin>
      }
      />

      <Route path='wallet' element={
        <ProtectedAdmin>
          <AdminWalletPage />
        </ProtectedAdmin>
      }
      />

    </Routes>
  )
}

export default AdminRoutes