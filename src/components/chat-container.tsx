"use client";

import { Message } from "@/actions";
import { addMessageToChat, createNewChat, saveAssistantMessage } from "@/actions/chat";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { toast } from "sonner";
import ChatWrapper from "./chat-wrapper";

interface Props {
    user: User | null;
    chatId?: string;
    messages: Message[] | [];
}

const ChatContainer = ({ user, chatId, messages }: Props) => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [oMessages, setOMessages] = useState<Message[]>([]);

    // Don't render if user is null
    if (!user) {
        return null;
    }

    const handleSendMessage = async (message: string) => {
        setIsLoading(true);

        if (!message.trim()) return;

        const tempMessageId = `temp-${Date.now()}`;
        const userMessage: Message = {
            id: tempMessageId,
            chat_id: chatId || "",
            content: String(message),
            role: "user",
            created_at: new Date().toISOString(),
        };

        setOMessages((prev) => [...prev, userMessage]);

        try {
            if (chatId) {
                setIsAiLoading(true);
                // Save user message only; stream assistant from API
                await addMessageToChat(chatId, message, 'user');

                // Stream assistant reply
                let streamed = "";
                const res = await fetch('/api/chat/stream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, instructions: (user as any)?.user_metadata?.instructions })
                });
                const reader = res.body!.getReader();
                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    streamed += decoder.decode(value, { stream: true });
                    const aiMessageChunk: Message = {
                        id: `temp-ai-${Date.now()}`,
                        chat_id: chatId,
                        content: String(streamed),
                        role: 'assistant',
                        created_at: new Date().toISOString()
                    };
                    setOMessages(prev => {
                        // keep only the latest temp assistant message
                        const others = prev.filter(m => m.id.indexOf('temp-ai-') === -1);
                        return [...others, aiMessageChunk];
                    });
                }

                // Persist final streamed message
                await saveAssistantMessage(chatId, oMessages.find(m => m.id.startsWith('temp-ai-'))?.content || "");
                router.refresh();
            } else {
                setIsAiLoading(true);
                const { chatId: newChatId } = await createNewChat(message);

                // Stream for the first reply
                let streamed = "";
                const res = await fetch('/api/chat/stream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, instructions: (user as any)?.user_metadata?.instructions })
                });
                const reader = res.body!.getReader();
                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    streamed += decoder.decode(value, { stream: true });
                    const aiMessageChunk: Message = {
                        id: `temp-ai-${Date.now()}`,
                        chat_id: newChatId,
                        content: String(streamed),
                        role: 'assistant',
                        created_at: new Date().toISOString()
                    };
                    setOMessages(prev => {
                        const others = prev.filter(m => m.id.indexOf('temp-ai-') === -1);
                        return [...others, aiMessageChunk];
                    });
                }

                // Persist final streamed message
                await saveAssistantMessage(newChatId, oMessages.find(m => m.id.startsWith('temp-ai-'))?.content || "");
                router.push(`/c/${newChatId}`);
            }

            // NOTE: This is working
            // if(chatId) {
            //     await addMessageToChat(chatId, message, 'user');
            // } else {
            //     const newChatId = await createNewChat(message);
            //     router.push(`/c/${newChatId}`)
            // }
        } catch (error) {
            console.log("Error creating chat", error);
            toast.error("Error creating chat. Please try again");
            setOMessages(prev =>
                prev.filter(msg => msg.id !== tempMessageId)
            );
        } finally {
            setIsLoading(false);
            setIsAiLoading(false);
            setTimeout(() => {
                setOMessages([]);
            }, 1000);
        }
    };

    return (
        <ChatWrapper
            user={user}
            messages={messages}
            isLoading={isLoading}
            oMessages={oMessages}
            isAiLoading={isAiLoading}
            onSubmit={handleSendMessage}
        />
    )
};

export default ChatContainer
