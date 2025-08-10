"use client"

import { Message } from "@/actions";
import { cn } from "@/utils";
import Container from "./global/container";
import Markdown from './markdown';
import MessageOptions from "./message-options";

interface Props {
    index: number;
    message: Message;
    messages: Message[];
    isLoading: boolean;
}

const ChatMessage = ({ index, message, messages, isLoading }: Props) => {

    const isUser = message.role === "user";
    const isLastMessage = index === messages.length - 1;
    const showLoading = isLoading && isLastMessage && !isUser;

    return (
        <div
            className={cn(
                "flex gap-x-2 p-2 group/message",
                isUser ? "text-start" : "items-start my-3",
                isLastMessage ? "pb-80" : "",
            )}
        >
            {/* <div className="flex items-center justify-center select-none size-8 shrink-0">
                {message.role === "assistant" && (
                    <div className="flex items-center justify-center size-8  rounded-lg bg-zinc-10 bg-[#f5f5f4] border-border">
                        <Icons.logo className="flex size-4.5 text-foreground" />
                    </div>
                )}
            </div> */}
            <div className="relative flex-1 px-1 overflow-hidden">
                <div
                    data-id="message-content"
                    className={cn(
                        "flex flex-col grow",
                        message.role === "user" && "bg-muted text-foreground w-max max-w-[80%] ml-auto rounded-lg px-3 py-1.5",
                        !isUser && message.content.length <= 90 && "pt-1"
                    )}
                >
                    {showLoading ? (
                        <div className="flex items-center pt-2.5 animate-pulse">
                            <div className="w-2.5 h-2.5 rounded-full bg-foreground animate-pump" />
                        </div>
                    ) : message.role === "user" ? (
                        <div className="whitespace-pre-wrap break-words">
                            {message.content}
                        </div>
                    ) : (
                        <Markdown>
                            {message.content}
                        </Markdown>
                    )}
                </div>
                {!isLoading && !showLoading && (
                    <MessageOptions
                        message={message}
                        role={message.role}
                    />
                )}
            </div>
        </div>
    )
};

export default ChatMessage
