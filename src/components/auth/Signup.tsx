import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signupValidationSchema } from '@/utils/validations/authValidation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { ISignUpFormProps, TSignUpFormValues } from '@/types/auth.types';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC<ISignUpFormProps> = ({ role, onSubmit, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-gradient-to-br to-blue-200 from-white flex justify-center items-center">
            <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-xl shadow-lg bg-white overflow-hidden">

                {/* Left Image Side */}
                <div className="hidden md:flex w-full md:w-1/2 h-full">
                    <img
                        className='w-full h-full object-cover'
                        src="https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735"
                        alt="signupImage"
                    />
                </div>

                <div className="hidden md:block w-px bg-gray-300" />

                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            password: '',
                            confirmPassword: '',
                            subscriptionType: 'basic'
                        } as TSignUpFormValues}
                        validationSchema={signupValidationSchema}
                        onSubmit={(values) => {
                            onSubmit({ ...values, role });
                        }}
                    >
                        {() => (
                            <Form className="space-y-1.5">
                                <div className="text-center">
                                    <h1 className="text-3xl font-extrabold text-blue-600 font-[Poppins] tracking-tight">
                                        Welcome to <span className="text-blue-700">Travesta</span>
                                    </h1>
                                    <p className="text-sm text-gray-600">Create an account to get started</p>
                                </div>

                                {[
                                    { name: 'firstName', label: 'First Name' },
                                    { name: 'lastName', label: 'Last Name' },
                                    { name: 'email', label: 'Email', type: 'email' },
                                    { name: 'phone', label: 'Phone', type: 'tel' }
                                ].map(({ name, label, type = 'text' }) => (
                                    <div key={name} className="space-y-1">
                                        <Label htmlFor={name}>{label}</Label>
                                        <Field name={name}>
                                            {({ field }: any) => (
                                                <Input id={name} type={type} {...field} className="w-full" />
                                            )}
                                        </Field>
                                        <ErrorMessage name={name}>
                                            {(msg: string) => (
                                                <p className="text-red-500 text-sm mt-0 mb-0">{msg}</p>
                                            )}
                                        </ErrorMessage>
                                    </div>
                                ))}

                                {/* Password */}
                                <div className="space-y-[1px]">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Field name="password">
                                            {({ field }: any) => (
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    {...field}
                                                    className="pr-10 w-full"
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
                                    <ErrorMessage name="password">
                                        {(msg: string) => (
                                            <p className="text-red-500 text-sm mt-0 mb-0">{msg}</p>
                                        )}
                                    </ErrorMessage>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-[1px]">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Field name="confirmPassword">
                                            {({ field }: any) => (
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    {...field}
                                                    className="pr-10 w-full"
                                                />
                                            )}
                                        </Field>
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <ErrorMessage name="confirmPassword">
                                        {(msg: string) => (
                                            <p className="text-red-500 text-sm mt-0 mb-0">{msg}</p>
                                        )}
                                    </ErrorMessage>
                                </div>

                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                    {isLoading && <Loader2 className='animate-spin w-4 h-4' />}
                                    {isLoading ? 'Signing in...' : 'Signup'}
                                </Button>

                                {/* Already have an account? Login */}
                                <div className="text-sm text-center text-gray-600">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/${role}/login`)}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Log in
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

export default SignUp;
