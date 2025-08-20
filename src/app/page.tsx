import ChatContainer from "@/components/chat-container";
import Container from "@/components/global/container";
import Icons from "@/components/global/icons";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Home = async () => {

    let user = null;
    let hasSupabaseError = false;

    // Completely wrap everything in error handling
    try {
        // Only try to create Supabase client if environment variables are available
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            try {
                const supabase = await createClient();
                const { data: { user: userData } } = await supabase.auth.getUser();
                user = userData;
            } catch (supabaseError) {
                console.warn('Supabase client creation failed:', supabaseError);
                hasSupabaseError = true;
                user = null;
            }
        } else {
            console.warn('Supabase environment variables not configured');
            hasSupabaseError = true;
            user = null;
        }
    } catch (error) {
        console.warn('Unexpected error in home page:', error);
        hasSupabaseError = true;
        user = null;
    }

    // Ensure we always have safe values
    if (!user) user = null;

    if (user) {
        return (
            <div className="flex items-center justify-center w-full relative h-dvh group overflow-auto transition-all duration-300 ease-in-out z-0">
                {/* <div className="absolute -z-10 bottom-0 left-1/2 -translate-x-1/2 bg-orange-500 rounded-full w-1/4 h-1/6 blur-[10rem] hidden lg:block opacity-20"></div> */}

                <div className="fixed -z-10 top-0 left-1/2 -translate-x-1/2 bg-blue-500 rounded-full w-full h-1/6 blur-[10rem] hidden lg:block opacity-10"></div>
                <div className="fixed -z-10 top-0 left-1/2 -translate-x-1/2 bg-amber-500 rounded-full w-3/4 h-1/6 blur-[10rem] hidden lg:block opacity-10"></div>
                <div className="fixed -z-10 top-1/8 left-1/4 -translate-x-1/4 bg-orange-500 rounded-full w-1/3 h-1/6 blur-[10rem] mix-blend-multiply hidden lg:block opacity-20"></div>
                <div className="fixed -z-10 top-1/8 right-1/4 translate-x-1/4 bg-sky-500 rounded-full w-1/3 h-1/6 blur-[10rem] mix-blend-multiply hidden lg:block opacity-20"></div>

                <ChatContainer user={user} messages={[]} />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Container animation="fadeUp">
                <div className="flex flex-col items-center max-w-xl px-2 mx-auto sm:px-0">
                    <Icons.icon className="size-12" />
                    <h1 className="mt-6 text-3xl font-medium text-center">
                        The intelligent AI companion
                    </h1>
                    <p className="w-full mt-4 text-center text-muted-foreground text-balance">
                        Browzai is your creative companion, effortlessly generating content, diagrams, and images
                    </p>
                    <Link href="/auth/signin" className={buttonVariants({ className: "mt-6" })}>
                        Start creating
                        <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                    </Link>
                    
                    {/* Show configuration warning if Supabase is not available */}
                    {hasSupabaseError && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
                            <p className="text-sm text-yellow-800 text-center">
                                ⚠️ Supabase not configured. Some features may not work until you set up your environment variables.
                            </p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
};

export default Home
