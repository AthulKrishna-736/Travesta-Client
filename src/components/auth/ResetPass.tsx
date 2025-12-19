import React, { useState } from 'react';
import { IResetPassModalProps } from '../../types/authentication.types';
import { Input } from '../ui/input';
import { resetPasswordValidationSchema } from '@/utils/validations/authValidation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const ResetPassModal: React.FC<IResetPassModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
                {/* Close Button */}
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-2xl">
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Reset Password</h2>
                <p className="text-center text-sm text-gray-600 mb-6">
                    Please enter your new password below and confirm it to reset.
                </p>

                {/* Formik Form */}
                <Formik
                    initialValues={{ password: '', confirmPassword: '' }}
                    validationSchema={resetPasswordValidationSchema}
                    onSubmit={(values) => {
                        onSubmit(values.password);
                    }}
                >
                    {() => (
                        <Form className="space-y-4">
                            {/* Password Input */}
                            <div className="mb-4 relative">
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </Label>
                                <Field name="password">
                                    {({ field }: any) => (
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showPass ? 'text' : 'password'}
                                                placeholder="Enter new password"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black">
                                                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage name="password" component="p" className="text-red-500 text-sm text-center mt-1" />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="mb-6 relative">
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </Label>
                                <Field name="confirmPassword">
                                    {({ field }: any) => (
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showConfirmPass ? 'text' : 'password'}
                                                placeholder="Confirm new password"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black">
                                                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="p"
                                    className="text-red-500 text-sm text-center mt-1"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium flex items-center justify-center gap-2">
                                {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ResetPassModal;
