import { useResendOtp } from '@/hooks/auth/useResendOtp';
import { IOtpModalProps } from '@/types/Auth.Types';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const OtpModal: React.FC<IOtpModalProps> = ({ isOpen, onClose, onSubmit, userId, role, isLoading, purpose }) => {
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

    //track on change values of input filed
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

    //track keyboard event of input filed
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Backspace') {
            if (otpValues[index] == '') {
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) {
                    (prevInput as HTMLInputElement).focus()
                }
            } else {
                const updatedOtp = [...otpValues];
                updatedOtp[index] = '';
                setOtpValues(updatedOtp)
            }
        }
    }

    //paste clipboard for copy and paste to input filed
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const paste = e.clipboardData.getData('text').trim()
        if (/^\d{6}$/.test(paste)) {
            setOtpValues(paste.split(''));
            setOtpError(null)
        } else {
            setOtpError("Pasted OTP must be exactly 6 digits.");
        }
    }

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


    const { mutate: resendOtpFn, isPending: isResending } = useResendOtp(role, purpose, () => {
        setTimer(60);
        setCanResend(false)
        setOtpValues(Array(6).fill(''))
    })

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-2xl">
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Enter OTP</h2>
                <p className="text-center text-sm text-gray-600 mb-4">
                    We’ve sent a 6-digit OTP to your email/phone.
                </p>

                <div className="flex justify-center gap-2 mb-6">
                    {otpValues.map((digit, index) => (
                        <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={(e) => handlePaste(e)}
                            className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:border-blue-500"
                        />
                    ))}
                </div>

                {otpError && <p className="text-red-500 text-center mb-4">{otpError}</p>}

                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <button
                        onClick={() => resendOtpFn({ userId })}
                        disabled={!canResend || isResending}
                        className={`text-blue-600 hover:underline font-medium ${(!canResend || isResending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isResending
                            ? 'Resending...'
                            : canResend
                                ? 'Resend OTP'
                                : `Resend OTP in ${timer} sec`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpModal;
