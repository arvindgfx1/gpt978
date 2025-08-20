"use server";

import { createClient } from "@/lib";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
    try {
        console.log('Environment variables check:')
        console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
        console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
        console.log('NEXT_SITE_URL:', process.env.NEXT_SITE_URL)

        // Check if required environment variables are set
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            throw new Error('Supabase environment variables are not configured. Please check your .env.local file.')
        }

        const supabase = await createClient()
        console.log('Supabase client created successfully')

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

        console.log('OAuth response:', { data, error })

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
