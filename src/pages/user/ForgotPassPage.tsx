import React, { useState } from 'react';
import { sendForgotPasswordOtp, verifyOtp } from '@/services/authService';
import { showError, showSuccess } from '@/utils/customToast';
import ForgotPass from '@/components/auth/ForgotPass';
import OtpModal from '@/components/auth/OtpModal'; // adjust path if needed

const ForgotPassPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSendOtp = async (emailInput: string) => {
    try {
      const res = await sendForgotPasswordOtp(emailInput); // Call your service
      setEmail(emailInput); // Save email for OTP verification
      setShowOtpModal(true);
      showSuccess('OTP sent successfully!');
    } catch (err) {
      showError('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    try {
      const response = await verifyOtp({ email, otp }); 
      showSuccess('OTP verified. Proceed to reset password.');
      setShowOtpModal(false);
    } catch (err) {
      showError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <ForgotPass onSubmit={handleSendOtp} />
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSubmit={handleOtpSubmit}
      />
    </div>
  );
};

export default ForgotPassPage;
