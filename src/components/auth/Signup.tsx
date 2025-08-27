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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8 overflow-hidden flex items-center justify-center">
            <div className='flex w-full max-w-4xl h-[650px] rounded-2xl shadow-lg bg-white border overflow-hidden'>

                <div className='hidden md:flex w-1/2 bg-gray-100 items-center justify-center text-center text-gray-500 p-6'>
                    <p>Image will be added later</p>
                </div>

                <div className="hidden md:block w-px bg-gray-300" />

                <div className='w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 md:px-12 overflow-y-auto max-h-[650px]'>
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
                            <Form className="space-y-4 w-full">
                                <div className="text-center space-y-1">
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
                                <div className="space-y-[2px]">
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
                                <div className="space-y-[2px]">
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
