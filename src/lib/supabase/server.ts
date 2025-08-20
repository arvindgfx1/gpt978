import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    try {
        // First check environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase environment variables are not configured');
        }

        // Validate environment variables format
        if (!supabaseUrl.startsWith('https://') || !supabaseAnonKey.startsWith('eyJ')) {
            throw new Error('Invalid Supabase environment variable format');
        }

        // Try to get cookies, but handle failures gracefully
        let cookieStore;
        try {
            cookieStore = await cookies()
        } catch (cookieError) {
            console.warn('Failed to get cookies, this might be a build-time issue:', cookieError);
            // Return a mock client that won't work but won't crash
            throw new Error('Cookies not available in this environment - likely build time');
        }
        
        // Create the Supabase client
        const client = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        try {
                            return cookieStore.getAll()
                        } catch (error) {
                            console.warn('Failed to get cookies:', error);
                            return []
                        }
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch (error) {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                            console.warn('Failed to set cookies:', error);
                        }
                    },
                },
            }
        )

        return client;
    } catch (error) {
        console.error('Failed to create Supabase client:', error);
        
        // Provide a more specific error message
        if (error instanceof Error) {
            if (error.message.includes('Cookies not available')) {
                throw new Error('Server environment not compatible - try building or deploying');
            } else if (error.message.includes('environment variables')) {
                throw new Error('Supabase not configured - check your .env.local file');
            } else if (error.message.includes('Invalid Supabase')) {
                throw new Error('Invalid Supabase credentials - check your .env.local file');
            } else {
                throw new Error(`Supabase client creation failed: ${error.message}`);
            }
        } else {
            throw new Error('Unknown error creating Supabase client');
        }
    }
};
