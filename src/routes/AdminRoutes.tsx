import AdminDash from '@/pages/admin/AdminDash'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminUsers from '@/pages/admin/AdminUsers'
import VendorRequestPage from '@/pages/admin/VendorRequestPage'
import ProtectAdminGuest from '@/ProtectRoutes/GuestAdmin'
import ProtectedAdmin from '@/ProtectRoutes/ProtectAdmin'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
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

    </Routes>
  )
}

export default AdminRoutes