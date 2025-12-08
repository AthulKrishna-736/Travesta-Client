import React, { useState } from 'react';
import ForgotPass from '@/components/auth/ForgotPass';
import OtpModal from '@/components/auth/Otp';
import ResetPassModal from '@/components/auth/ResetPass';
import { useOtpVerify } from '@/hooks/auth/useOtpVerify';
import { useForgotPass } from '@/hooks/auth/useForgotPass';
import { useResetPass } from '@/hooks/auth/useResetPass';
import { useNavigate } from 'react-router-dom';
import { TRoles } from '@/types/auth.types';

const ForgotPassPage: React.FC = () => {
  const navigate = useNavigate()
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const role: Exclude<TRoles, 'admin'> = "user";


  //step 1 send email
  const { mutate: forgotPassFn, isPending: isLoadingForgot } = useForgotPass(role, (userId: string) => {
    setUserId(userId);
    setShowOtpModal(true);
  })

  const handleSendOtp = (email: string) => {
    forgotPassFn({ email })
  };

  //step 2 verify otp
  const { mutate: verifyOtpFn, isPending: isLoadingVerify } = useOtpVerify(role, (email: string) => {
    setShowOtpModal(false);
    setShowResetModal(true);
    setEmail(email)
  })

  const handleOtpSubmit = async (otp: string) => {
    verifyOtpFn({ userId, otp, purpose: 'reset' });
  };

  //step 3 reset password
  const { mutate: resetPassFn, isPending: isLoadingReset } = useResetPass(role, () => {
    setShowResetModal(false)
    navigate(`/${role}/login`)
  })
  const handleResetPassword = async (password: string) => {
    resetPassFn({ email, password })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br to-blue-200 from-white px-4">
      <ForgotPass onSubmit={handleSendOtp} isLoading={isLoadingForgot} />

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSubmit={handleOtpSubmit}
        userId={userId}
        role={role}
        isLoading={isLoadingVerify}
        purpose='reset'
      />

      <ResetPassModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onSubmit={handleResetPassword}
        isLoading={isLoadingReset}
      />
    </div>
  );
};

export default ForgotPassPage;
