import AdminDash from '@/pages/admin/AdminDash'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
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
    </Routes>
  )
}

export default AdminRoutes