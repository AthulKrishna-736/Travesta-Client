import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginValidationSchema } from '@/utils/validations/authValidation';
import { ILoginFormProps } from '@/types/Auth.Types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Login: React.FC<ILoginFormProps> = ({ role, onSubmit, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-6">
            <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-2xl shadow-lg bg-white border overflow-hidden">
                {/* Left Side - Hidden on small screens */}
                <div className="hidden md:flex w-full md:w-1/2 bg-gray-100 flex-col items-center justify-center p-10 text-center text-gray-500">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                    <p className="text-base">Here will be an image or something cool 🙂</p>
                </div>

                {/* Vertical Divider - Hidden on small screens */}
                <div className="hidden md:block w-px bg-gray-300" />

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginValidationSchema}
                        onSubmit={(values) => onSubmit({ ...values })}
                    >
                        {() => (
                            <Form className="space-y-6">
                                <div className="text-center space-y-1">
                                    <h1 className="text-3xl font-extrabold text-blue-600 font-[Poppins] tracking-tight">
                                        Welcome to <span className="text-blue-700">Travesta</span>
                                    </h1>
                                    <p className="text-sm text-gray-600">Please login to continue</p>
                                </div>

                                <h2 className="text-xl font-semibold text-center capitalize text-gray-800">
                                    {role} Login
                                </h2>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Field name="email">
                                        {({ field }: any) => <Input id="email" type="email" {...field} />}
                                    </Field>
                                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                                </div>

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

                                <div className="text-right text-sm">
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:underline"
                                        onClick={() => navigate('/user/forgot-password')}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                    {isLoading && <Loader2 className='animate-spin w-4 h-4' />}
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Button>

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
                </div>
            </div>
        </div>
    );
};

export default Login;
