import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib'

export async function GET(request: Request) {
    console.log("Starting callback route", request)
    const { searchParams, origin } = new URL(request.url)
    console.log("Callback route received URL:", request.url, searchParams, origin)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    console.log("Callback route received next:", next, 'code:', code)

    if (code) {
        console.log("Callback route received code:", code)
        try {
            const supabase = await createClient()
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            console.log("Callback route exchangeCodeForSession result:", error ? 'Error' : 'Success')
            if (!error) {
                const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
                const isLocalEnv = process.env.NODE_ENV === 'development'
                if (isLocalEnv) {
                    // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                    return NextResponse.redirect(`${origin}${next}`)
                } else if (forwardedHost) {
                    console.log("Callback route received X-Forwarded-Host:", forwardedHost)
                    return NextResponse.redirect(`https://${forwardedHost}${next}`)
                } else {
                    console.log("Callback route did not receive X-Forwarded-Host")
                    return NextResponse.redirect(`${origin}${next}`)
                }
            }
        } catch (error) {
            console.warn('Supabase not configured during build:', error);
            // During build time, just redirect to error page
            return NextResponse.redirect(`${origin}/auth/auth-code-error`)
        }
    }

    console.log("Callback route did not receive code")

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}