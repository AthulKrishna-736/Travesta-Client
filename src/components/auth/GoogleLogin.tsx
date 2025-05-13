import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import { IGoogleLoginProps } from "@/types/Auth.Types";
import { useGoogleLogin } from "@/hooks/auth/useGoogleLogin";

export const GoogleLoginButton: React.FC<IGoogleLoginProps> = ({ role })=> {

    const { mutate: googleLoginFn } = useGoogleLogin(role)
    const handleSuccess = (credentialRes: any) => {
        if (credentialRes?.credential) {
            googleLoginFn({ credential: credentialRes.credential, role });
        } else {
            console.log('No credential found')
        }
    }

    const handleError = () => {
        console.log('Google login failed: ')
    }

    return (
        <div className="w-full flex justify-center mt-4">
            <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            width={100}
            size="large"
            shape="rectangular"
            text="continue_with"
            />
        </div>
    )
}
