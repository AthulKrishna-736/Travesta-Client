import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import UserRoutes from './routes/UserRoutes';
import VendorRoutes from './routes/VendorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import NotFound from './components/auth/Page404';
import { ErrorBoundary } from './utils/ErrorBoundary';
import { env } from './config/config';

const App: React.FC = () => {
  return (
    <>
      <GoogleOAuthProvider clientId={env.GOOGLE_ID}>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/user/*" element={<UserRoutes />} />
              <Route path="/vendor/*" element={<VendorRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Router>
        <Toaster richColors closeButton />
      </GoogleOAuthProvider>
    </>
  )
}

export default App