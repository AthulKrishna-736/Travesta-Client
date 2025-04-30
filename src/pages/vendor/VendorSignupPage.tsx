import React, { useState } from 'react';
import SignUp from '@/components/auth/Signup';
import OtpModal from '@/components/auth/Otp';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '@/hooks/auth/useSignup';
import { useOtpVerify } from '@/hooks/auth/useOtpVerify';
import { TRoles } from '@/types/auth.types';

const VendorSignupPage: React.FC = () => {
    const [isOtpModalOpen, setOtpModalOpen] = useState(false);
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');
    const role: Exclude<TRoles, 'admin'> = "vendor";

    const { mutate: signupUser, isPending: isSignupLoading } = useSignup(role, (userId) => {
        setUserId(userId)
        setOtpModalOpen(true)
    })

    const { mutate: verifyOtp, isPending: isOtploading } = useOtpVerify(role, () => {
        setOtpModalOpen(false)
        navigate(`/${role}/login`);
    })

    const handleOtpSubmit = (otp: string) => {
        verifyOtp({ userId, otp, purpose: 'signup' });
    };

    return (
        <>
            <SignUp role={role} onSubmit={signupUser} isLoading={isSignupLoading} />
            <OtpModal
                isOpen={isOtpModalOpen}
                onClose={() => setOtpModalOpen(false)}
                onSubmit={handleOtpSubmit}
                userId={userId}
                role={role}
                isLoading={isOtploading}
            />
        </>
    );
};

export default VendorSignupPage;
