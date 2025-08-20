"use client";

import { signInWithGoogle } from "@/actions/auth";
import Icons from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const SignInPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSetupGuide, setShowSetupGuide] = useState(false);

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
            
            // Show more specific error messages
            if (error instanceof Error) {
                if (error.message.includes('Supabase environment variables are not configured')) {
                    // Show setup guide instead of alert
                    setShowSetupGuide(true);
                } else if (error.message.includes('OAuth failed')) {
                    alert('OAuth Error: ' + error.message);
                } else {
                    alert('Authentication Error: ' + error.message);
                }
            } else {
                alert('Failed to sign in with Google. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (showSetupGuide) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center justify-center gap-y-4 text-center w-full max-w-2xl mx-auto p-6">
                    <h2 className="text-2xl font-semibold text-red-600">
                        Configuration Required! ⚠️
                    </h2>
                    <div className="bg-muted p-4 rounded-lg text-left w-full">
                        <h3 className="font-semibold mb-2">To use Google OAuth, you need to:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Create a <code className="bg-background px-2 py-1 rounded">.env.local</code> file in your project root</li>
                            <li>Add your Supabase credentials:</li>
                        </ol>
                        <pre className="bg-background p-3 rounded mt-3 text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000`}
                        </pre>
                        <p className="mt-3 text-sm">
                            Get these values from: <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a>
                        </p>
                    </div>
                    <Button onClick={() => setShowSetupGuide(false)} variant="outline">
                        Back to Sign In
                    </Button>
                </div>
            </div>
        );
    }

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
