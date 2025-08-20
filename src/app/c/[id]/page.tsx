import { getChatWithMessages } from "@/actions/chat";
import ChatContainer from "@/components/chat-container";
import { createClient } from "@/lib";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>
}

const ChatIdPage = async ({ params }: Props) => {

    const { id } = await params;

    if (!id) {
        notFound();
    }

    let user = null;
    let messages: any[] = [];

    try {
        const supabase = await createClient();
        const { data: { user: userData } } = await supabase.auth.getUser();
        user = userData;
        const chats = await getChatWithMessages(id);
        messages = chats.messages || [];
    } catch (error) {
        console.warn('Supabase not configured during build:', error);
        // Provide fallback values during build time
        user = null;
        messages = [];
    }

    return (
        <div className="w-full h-full">
            <ChatContainer user={user} chatId={id} messages={messages} />
        </div>
    )
};

export default ChatIdPage
