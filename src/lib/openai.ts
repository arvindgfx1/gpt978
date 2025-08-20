import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
	baseURL: "https://api.closerouter.com/v1",
	apiKey: process.env.CLOSEROUTER_API_KEY,
});


