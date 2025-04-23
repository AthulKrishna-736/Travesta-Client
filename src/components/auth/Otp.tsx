import { resendOtp } from '@/services/authService';
import { OtpModalProps } from '@/types/Auth.Types';
import { showError, showSuccess } from '@/utils/customToast';
import React, { useState, useEffect } from 'react';

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose, onSubmit, userId, role }) => {
    const [otpValues, setOtpValues] = useState(Array(6).fill(''));
    const [otpError, setOtpError] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let countdown: NodeJS.Timeout;
        if (isOpen && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }

        return () => clearInterval(countdown);
    }, [isOpen, timer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otpValues];
        updatedOtp[index] = value;
        setOtpValues(updatedOtp);

        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (value && nextInput) {
            (nextInput as HTMLInputElement).focus();
        }
    };

    const validateOtp = () => {
        const otp = otpValues.join('');
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            setOtpError('OTP must be exactly 6 digits.');
            return false;
        }
        setOtpError(null);
        return true;
    };

    const handleSubmit = () => {
        const otp = otpValues.join('');
        if (validateOtp()) {
            onSubmit(otp);
        }
    };

    const handleResend = async () => {
        try {
            const response = await resendOtp({ userId }, role);
            if (response.success) {
                showSuccess(response.message || "OTP resent successfully!");
                setTimer(60);
                setCanResend(false);
                setOtpValues(Array(6).fill(''));
            } else {
                showError(response.message || "Failed to resend OTP");
            }
        } catch (error: any) {
            console.error("Resend OTP Error:", error);
            showError(error.response.data.error || "Error while resending OTP");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Enter OTP</h2>
                <p className="text-center text-sm text-gray-600 mb-4">
                    We’ve sent a 6-digit OTP to your email/phone.
                </p>

                <div className="flex justify-center gap-2 mb-6">
                    {otpValues.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:border-blue-500"
                        />
                    ))}
                </div>

                {otpError && <p className="text-red-500 text-center mb-4">{otpError}</p>}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                >
                    Verify OTP
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <span>Resend OTP in {timer} sec</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpModal;
