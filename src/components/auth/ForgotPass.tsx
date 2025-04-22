import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ForgotPassProps } from '@/types/Auth.Types';
import { forgotPasswordValidationSchema } from '@/utils/validations/authValidation';

const ForgotPass: React.FC<ForgotPassProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await forgotPasswordValidationSchema.validate({ email });
            onSubmit(email);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white shadow space-y-6"
        >
            <h2 className="text-2xl font-bold text-center text-blue-600">Forgot Password</h2>
            <p className="text-sm text-gray-600 text-center">
                Enter your registered email to receive an OTP.
            </p>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                />
            </div>

            {/* Display error message if validation fails */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Send OTP
            </Button>
        </form>
    );
};

export default ForgotPass;
