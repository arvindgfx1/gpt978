import { getUserChats } from "@/actions/chat";
import DesktopHeader from "@/components/desktop-header";
import DesktopSidebar from "@/components/desktop-sidebar";
import Providers from "@/components/global/providers";
import InstructionsModal from "@/components/instructions-modal";
import MainWrapper from "@/components/main-wrapper";
import MobileHeader from "@/components/mobile-header";
import SearchModal from "@/components/search-modal";
import SettingsModal from "@/components/settings-modal";
import { createClient } from "@/lib";
import "@/styles/globals.css";
import { cn, generateMetadata } from "@/utils";
import { Inter } from "next/font/google";

const font = Inter({
    subsets: ["latin"],
});

export const metadata = generateMetadata();

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    let user = null;
    let chats: any[] = [];
    let hasSupabaseError = false;

    try {
        const supabase = await createClient();
        const { data: { user: userData } } = await supabase.auth.getUser();
        user = userData;
        chats = await getUserChats();
    } catch (error) {
        console.warn('Supabase not configured or failed during build:', error);
        
        // Set flag to indicate Supabase is not available
        hasSupabaseError = true;
        
        // Provide fallback values during build time or when Supabase is not configured
        user = null;
        chats = [];
        
        // Log the specific error for debugging
        if (error instanceof Error) {
            console.warn('Error details:', error.message);
            
            // Check if this is a configuration issue
            if (error.message.includes('not configured')) {
                console.warn('This is a configuration issue - check your .env.local file');
            } else if (error.message.includes('Cookies not available')) {
                console.warn('This is a server environment issue - likely during build time');
            }
        }
    }

    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-screen bg-background text-foreground antialiased",
                    font.className,
                )}
            >
                <Providers>
                    <SearchModal chats={chats} />
                    <SettingsModal user={user} />
                    <InstructionsModal user={user} />
                    <DesktopHeader user={user} />
                    <MobileHeader user={user} chats={chats} />
                    <div className="relative flex grow h-dvh w-full mx-auto overflow-auto -14 z-0">
                        <DesktopSidebar user={user} chats={chats} />
                        <MainWrapper user={user}>
                            {children}
                        </MainWrapper>
                    </div>
                    
                    {/* Show configuration warning if Supabase is not available */}
                    {hasSupabaseError && (
                        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded shadow-lg max-w-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">
                                        Configuration Required
                                    </p>
                                    <p className="text-sm mt-1">
                                        Supabase is not configured. Create a .env.local file with your credentials.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Providers>
            </body>
        </html>
    );
};
