"use client";

import { signInWithGoogle } from "@/actions/auth";
import Icons from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const SignInPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        try {
            setIsLoading(true);
            const result = await signInWithGoogle();
            
            if (result && result.url) {
                // Redirect to the OAuth URL
                window.location.href = result.url;
            } else {
                throw new Error('No OAuth URL received');
            }
        } catch (error) {
            console.error('Error during Google sign in:', error);
            alert('Failed to sign in with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto text-center gap-y-3">
                <h2 className="text-2xl font-semibold">
                    Hello there! 👋
                </h2>
                <p className="text-sm text-muted-foreground">
                    By proceeding, you are creating a Browzai account and agreeing to our{" "}
                    <Link href="#" className="text-foreground">
                        Terms of Service
                    </Link>{" "}
                    and <Link href="#" className="text-foreground">
                        Privacy Policy
                    </Link>.
                </p>
                <Button
                    type="button"
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className="w-full"
                >
                    <Icons.google className="w-4 h-4 mr-2" />
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </Button>
                <p className="text-sm text-muted-foreground mt-">
                    New to Browzai?{" "}
                    <Link href="/auth/signup" className="text-foreground">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;
