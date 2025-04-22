import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signupValidationSchema } from '@/utils/validations/authValidation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { SignUpFormProps, SignUpFormValues } from '@/types/Auth.Types';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC<SignUpFormProps> = ({ role, onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    subscriptionType: 'basic'
                } as SignUpFormValues}
                validationSchema={signupValidationSchema}
                onSubmit={(values) => {
                    console.log('data: ', values)
                    onSubmit({ ...values, role });
                }}
            >
                {() => (
                    <Form className="w-full max-w-md mx-auto p-8 border rounded-2xl shadow-lg bg-white space-y-5">
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
                            <div key={name} className="space-y-[2px]">
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

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            Sign Up
                        </Button>

                        {/* Already have an account? Login */}
                        <div className="text-sm text-center text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/user/login')}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Log in
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SignUp;
