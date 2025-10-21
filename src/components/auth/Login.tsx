import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginValidationSchema } from '@/utils/validations/authValidation';
import { ILoginFormProps, TRoles } from '@/types/auth.types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleLoginButton } from './GoogleLogin';

const Login: React.FC<ILoginFormProps> = ({ role, onSubmit, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br to-blue-200 from-white">
            <div className="flex flex-col md:flex-row h-140 w-full max-w-4xl rounded-xl shadow-lg bg-white overflow-y-auto">
                {/* Left Side - Hidden on small screens */}
                <div className="hidden md:flex h-full md:w-1/2">
                    <img
                        className='w-full h-full object-cover'
                        src='https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764'
                        alt='loginImage'
                    />
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 px-10 py-8">
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginValidationSchema}
                        onSubmit={(values) => onSubmit({ ...values })}
                    >
                        {() => (
                            <Form className="space-y-3 flex flex-col h-full justify-between">
                                <div className="text-center space-y-1">
                                    <h1 className="text-3xl font-extrabold text-blue-600 font-[Poppins] tracking-tight">
                                        Welcome to <span className="text-blue-700">Travesta</span>
                                    </h1>
                                    <p className="text-sm text-gray-600">Please login to continue</p>
                                    <h2 className="text-xl font-semibold text-center capitalize text-gray-800">
                                        {role} Login
                                    </h2>
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor="email">Email</Label>
                                    <Field name="email">
                                        {({ field }: any) => <Input id="email" type="email" {...field} />}
                                    </Field>
                                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />

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

                                    {role !== 'admin' && (
                                        <div className="text-right text-sm">
                                            <button
                                                type="button"
                                                className="text-blue-600 hover:underline"
                                                onClick={() => navigate(`/${role}/forgot-password`)}
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                        {isLoading && <Loader2 className='animate-spin w-4 h-4' />}
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </div>

                                {role !== 'admin' && (
                                    <>
                                        <div className="flex items-center my-4">
                                            <div className="flex-grow h-px bg-gray-300"></div>
                                            <span className="px-4 text-gray-500 text-sm">OR</span>
                                            <div className="flex-grow h-px bg-gray-300"></div>
                                        </div>

                                        <GoogleLoginButton role={role as Exclude<TRoles, 'admin'>} />

                                        <div className="text-center text-sm text-gray-600">
                                            Don’t have an account?{' '}
                                            <button
                                                type="button"
                                                className="text-blue-600 hover:underline font-medium"
                                                onClick={() => navigate(`/${role}/signup`)}
                                            >
                                                Sign up
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Login;
