import React from "react";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { IGoogleLoginProps } from '../../types/authentication.types';
import { useGoogleLogin } from "@/hooks/auth/useGoogleLogin";
import { showError } from "@/utils/customToast";

export const GoogleLoginButton: React.FC<IGoogleLoginProps> = ({ role }) => {

    const { mutate: googleLoginFn } = useGoogleLogin(role)
    const handleSuccess = (credentialRes: CredentialResponse) => {
        if (credentialRes.credential) {
            googleLoginFn({ credential: credentialRes.credential, role });
        } else {
            console.log('No credential found')
        }
    }

    const handleError = () => {
        showError('Google login failed')
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
