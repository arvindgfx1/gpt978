import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@/lib";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const { message, instructions } = await req.json();
		if (!message || typeof message !== "string") {
			return new Response("Invalid request body", { status: 400 });
		}

		const system = `You are a helpful AI assistant that provides well-formatted responses using Markdown. ${
			instructions ? `Here are user instructions keep them in mind: ${instructions}` : ""
		} Follow these guidelines:

		## Formatting Rules
		- Use proper Markdown syntax for all formatting
		- For code blocks, specify the language after the opening backticks
		- Use tables for tabular data (directly as markdown, not in code blocks)
		- Use headings to structure your response
		- Use lists (numbered or bulleted) for step-by-step instructions
		- NEVER put markdown tables inside code blocks

		## Response Style
		- Be concise but thorough
		- Use bold (**text**) for emphasis
		- Use italics (*text*) for subtle emphasis
		- Use code blocks with language specification for code examples
		- Use blockquotes for important notes or warnings
		- Use markdown tables (not in code blocks) for comparing items or showing structured data
		`;

		const result = await streamText({
			model: openai("gpt-4o"),
			prompt: message,
			temperature: 0.7,
			system,
		});

		return result.toTextStreamResponse();
	} catch (err) {
		console.error("/api/chat/stream error", err);
		return new Response("Internal Server Error", { status: 500 });
	}
}



