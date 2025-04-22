import React, { useState } from 'react';
import { ResetPassModalProps } from '@/types/Auth.Types';
import { Input } from '../ui/input';
import { resetPasswordValidationSchema } from '@/utils/validations/authValidation';

const ResetPassModal: React.FC<ResetPassModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        // Validate form data
        try {
            await resetPasswordValidationSchema.validate({ password, confirmPassword });
            onSubmit(password);
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Reset Password</h2>
                <p className="text-center text-sm text-gray-600 mb-6">
                    Please enter your new password below and confirm it to reset.
                </p>

                {/* Password Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <Input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Confirm Password Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <Input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default ResetPassModal;
