import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib';

export async function middleware(request: NextRequest) {
    try {
        return await updateSession(request)
    } catch (error) {
        // If middleware fails, allow the request to proceed
        // This prevents the entire app from breaking due to middleware errors
        console.error('Main middleware error:', error)
        return new Response('OK', { status: 200 })
    }
};

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
