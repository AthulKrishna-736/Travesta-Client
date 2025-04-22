import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import UserRoutes from './routes/UserRoutes';
import VendorRoutes from './routes/VendorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import NotFound from './components/auth/Page404';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/vendor/*" element={<VendorRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster richColors closeButton/>
    </>
  )
}

export default App