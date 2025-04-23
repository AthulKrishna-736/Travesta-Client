import React, { useState } from 'react';
import { showError, showSuccess } from '@/utils/customToast';
import { register, verifyOtp } from '@/services/authService'; // make sure verifyOtpService is added
import SignUp from '@/components/auth/Signup';
import OtpModal from '@/components/auth/Otp';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');
    const role = "user";

    const handleSignup = async (values: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
        subscriptionType: string;
    }) => {
        try {
            const response = await register(values, role);
            console.log("User data: ", response);

            if (response.success && response.data?.userId) {
                showSuccess(response.data.message || "OTP sent to email!");
                setUserId(response.data.userId);
                setOtpModalOpen(true);
            } else {
                showError("Something went wrong!");
            }
        } catch (error: any) {
            showError(error.response.data.error);
            console.log('Error in signup: ', error);
        }
    };

    const handleOtpSubmit = async (otp: string) => {
        try {
            const response = await verifyOtp({ userId, otp, purpose: 'signup' }, role);
            console.log("after otp success: ", response)
            if (response.success) {
                showSuccess("OTP verified successfully!");
                setOtpModalOpen(false);
                navigate('/user/login');
            } else {
                showError(response.message || "OTP verification failed");
            }
        } catch (error: any) {
            showError("OTP verification failed. Try again.");
            console.log("OTP Error:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
            <div className="w-full max-w-2xl">
                <SignUp role={role} onSubmit={handleSignup} />
            </div>

            <OtpModal
                isOpen={isOtpModalOpen}
                onClose={() => setOtpModalOpen(false)}
                onSubmit={handleOtpSubmit}
                userId={userId}
                role={role}
            />
        </div>
    );
};

export default SignupPage;
