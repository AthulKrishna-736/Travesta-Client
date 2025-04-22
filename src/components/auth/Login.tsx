import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← ADD THIS
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginValidationSchema } from '@/utils/validations/authValidation';
import { LoginFormProps } from '@/types/Auth.Types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC<LoginFormProps> = ({ role, onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // ← ADD THIS

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={(values) => {
                onSubmit({ ...values });
            }}
        >
            {() => (
                <Form className="max-w-md mx-auto p-8 border rounded-2xl shadow-lg space-y-6 bg-white">
                    {/* Welcome Section */}
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl font-extrabold text-blue-600 font-[Poppins] tracking-tight">
                            Welcome to <span className="text-blue-700">Travesta</span>
                        </h1>
                        <p className="text-sm text-gray-600">Please login to continue</p>
                    </div>

                    {/* Role-specific heading */}
                    <h2 className="text-xl font-semibold text-center capitalize text-gray-800">
                        {role} Login
                    </h2>

                    {/* Email Field */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Field name="email">
                            {({ field }: any) => <Input id="email" type="email" {...field} />}
                        </Field>
                        <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Password Field with Icon */}
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Field name="password">
                                {({ field }: any) => (
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...field}
                                        className="pr-10"
                                    />
                                )}
                            </Field>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Login
                    </Button>

                    {/* Signup Redirect */}
                    <div className="text-center text-sm text-gray-600">
                        Don’t have an account?{' '}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline font-medium"
                            onClick={() => navigate('/user/signup')}
                        >
                            Sign up
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default Login;
