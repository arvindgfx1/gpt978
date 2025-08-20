import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    try {
        let cookieStore;
        try {
            cookieStore = await cookies()
        } catch (cookieError) {
            console.warn('Failed to get cookies, using fallback:', cookieError);
            // Return a mock client that won't work but won't crash
            throw new Error('Cookies not available in this environment');
        }
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase environment variables are not configured');
        }

        return createServerClient(
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
    } catch (error) {
        console.error('Failed to create Supabase client:', error);
        throw new Error(`Failed to create Supabase client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
