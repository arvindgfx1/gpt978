import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // If environment variables are missing, allow the request to proceed
        // This prevents middleware failures during build time
        return NextResponse.next({
            request,
        })
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser()

        const publicPaths = [
            '/auth/signin',
            '/auth/signup',
            '/auth/callback',
            '/auth/auth-code-error',
            '/'
        ];

        if (
            !user &&
            !publicPaths.includes(request.nextUrl.pathname) 
            // !request.nextUrl.pathname.startsWith('/auth')
        ) {
            const url = request.nextUrl.clone()
            url.pathname = '/auth/signin'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    } catch (error) {
        // If there's any error with Supabase, allow the request to proceed
        // This prevents middleware failures from breaking the app
        console.error('Middleware error:', error)
        return NextResponse.next({
            request,
        })
    }
};
