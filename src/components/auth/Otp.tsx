import { OtpModalProps } from '@/types/Auth.Types';
import React, { useState } from 'react';

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [otpValues, setOtpValues] = useState(Array(6).fill(''));
    const [otpError, setOtpError] = useState<string | null>(null);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otpValues];
        updatedOtp[index] = value;
        setOtpValues(updatedOtp);

        // Auto-focus next input
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (value && nextInput) {
            (nextInput as HTMLInputElement).focus();
        }
    };

    const validateOtp = () => {
        const otp = otpValues.join('');
        // OTP validation: It should be 6 digits
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Enter OTP</h2>
                <p className="text-center text-sm text-gray-600 mb-6">We’ve sent a 6-digit OTP to your email/phone.</p>

                {/* OTP Inputs */}
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

                {/* OTP Error */}
                {otpError && <p className="text-red-500 text-center mb-4">{otpError}</p>}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                >
                    Verify OTP
                </button>
            </div>
        </div>
    );
};

export default OtpModal;
