import React, { useState } from 'react';
import { forgotPass, verifyOtp } from '@/services/authService';
import { showError, showSuccess } from '@/utils/customToast';
import ForgotPass from '@/components/auth/ForgotPass';
import OtpModal from '@/components/auth/Otp';
import ResetPassModal from '@/components/auth/ResetPass';
import { useOtpVerify } from '@/hooks/auth/useOtpVerify';

const ForgotPassPage: React.FC = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const role = 'user';

  // Step 1: Send OTP
  const handleSendOtp = async (emailInput: string) => {
    try {
      const response = await forgotPass({ email: emailInput }, role);
      if (response.success) {
        setUserId(response.data);
        setShowOtpModal(true);
        showSuccess(response.message);
      }
    } catch (error: any) {
      showError(error.response.data.error);
    }
  };

  const { mutate: verifyOtpFn, isPending } = useOtpVerify(role, () => {
    setShowOtpModal(false);
    setShowResetModal(true);
  })

  // Step 2: Verify OTP
  const handleOtpSubmit = async (otp: string) => {
    verifyOtpFn({ userId, otp, purpose: 'reset' });
  };

  // Step 3: Handle Password Reset
  const handleResetPassword = async (newPassword: string) => {
    try {
      const response = await resetPassword({ userId, password: newPassword }, role);
      if (response.success) {
        showSuccess('Password reset successful! You can now login.');
        setShowResetModal(false);
      }
    } catch (err) {
      showError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <ForgotPass onSubmit={handleSendOtp} />

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSubmit={handleOtpSubmit}
        userId={userId}
        role={role}
        isLoading={isPending}
      />

      <ResetPassModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onSubmit={handleResetPassword}
      />
    </div>
  );
};

export default ForgotPassPage;
