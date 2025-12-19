import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { IForgotPassProps } from '../../types/auth.types';
import { forgotPasswordValidationSchema } from '@/utils/validations/authValidation';
import { Loader2 } from 'lucide-react';

const ForgotPass: React.FC<IForgotPassProps> = ({ onSubmit, isLoading }) => {
    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white shadow space-y-6">
            <h2 className="text-2xl font-bold text-center text-blue-600">Forgot Password</h2>
            <p className="text-sm text-gray-600 text-center">
                Enter your registered email to receive an OTP.
            </p>

            <Formik
                initialValues={{ email: '' }}
                validationSchema={forgotPasswordValidationSchema}
                onSubmit={(values) => {
                    onSubmit(values.email);
                }}
            >
                {() => (
                    <Form className="space-y-6">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Field name="email">
                                {({ field }: any) => (
                                    <Input
                                        {...field}
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="email" component="p" className="text-red-500 text-sm text-center mt-1" />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading && <Loader2 className='animate-spin w-4 h-4' />}
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ForgotPass;
