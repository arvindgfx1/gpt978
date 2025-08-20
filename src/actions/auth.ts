"use server";

import { createClient } from "@/lib";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
    try {
        const supabase = await createClient()

        // Use environment variable or fallback to localhost for development
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_SITE_URL || 'http://localhost:3000'
        const auth_callback_url = `${siteUrl}/auth/callback`

        console.log('Starting Google OAuth with callback URL:', auth_callback_url)

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: auth_callback_url,
            },
        })

        if (error) {
            console.error("Google OAuth error:", error)
            throw new Error(`OAuth failed: ${error.message}`)
        }

        if (!data.url) {
            console.error("No OAuth URL received from Supabase")
            throw new Error("OAuth URL not received")
        }

        console.log('OAuth URL received:', data.url)
        return { url: data.url }
    } catch (error) {
        console.error('Unexpected error during Google sign in:', error)
        throw error
    }
};

export const signOut = async () => {
    try {
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect("/")
    } catch (error) {
        console.error('Error during sign out:', error)
        redirect("/")
    }
};
