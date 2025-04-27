import React from 'react';
import { IResetPassModalProps } from '@/types/Auth.Types';
import { Input } from '../ui/input';
import { resetPasswordValidationSchema } from '@/utils/validations/authValidation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const ResetPassModal: React.FC<IResetPassModalProps> = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
                {/* Close Button */}
                <Button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl">
                    ×
                </Button>

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
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {/* Password Input */}
                            <div className="mb-4">
                                <Label className="block text-sm font-medium text-gray-700 mb-1">New Password </Label>
                                <Field name="password">
                                    {({ field }: any) => (
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Enter new password"
                                            required
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="password" component="p" className="text-red-500 text-sm text-center mt-1" />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="mb-6">
                                <Label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</Label>
                                <Field name="confirmPassword">
                                    {({ field }: any) => (
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    )}
                                </Field>
                                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm text-center mt-1" />
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium">
                                {isSubmitting && <Loader2 className='animate-spin w-4 h-4' />}
                                {isSubmitting ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ResetPassModal;
