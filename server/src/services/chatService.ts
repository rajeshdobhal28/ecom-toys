import logger from "../utils/logger";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { query } from "../db";

const chatModel = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    // timeout: 10000,
});

const embeddingModel = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small'
});

const getPgVectorString = async (message: string) => {
    const embedding = await embeddingModel.embedQuery(message);
    const pgVectorString = `[${embedding.join(',')}]`;
    return pgVectorString;
}

const getContextString = async (pgVectorString: string) => {
    const { rows: matchedProducts } = await query(`
            SELECT id, name, description, "category", "brand", price 
            FROM products 
            ORDER BY embedding <=> $1
            LIMIT 3;
        `, [pgVectorString]);

    // Format the products into a string so the LLM can read them
    const contextString = matchedProducts.map(p =>
        `- ${p.name} ($${p.price}) in ${p.category} by ${p.brand}: ${p.description || "No description"}`
    ).join("\n");

    return contextString;
}

const getopenAiResponse = async (contextString: string, message: string) => {
    const systemPrompt = `You are a helpful, enthusiastic customer support assistant for WonderToys. 
        Use the following product information to answer the user's question. 
        If the user asks for a product you don't see in the context below, politely say you don't have it or don't know. 
        Do not make up products or prices.
        Please beautifully format your responses using Markdown. Use bolding for product names and bullet points for lists.

        AVAILABLE PRODUCTS CONTEXT:
        ${contextString}`;

    const resp = await chatModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(message),
    ]);
    return resp.content as string;
}

export const getChatResponse = async (userId: string, message: string) => {
    try {
        logger.info("Sending message to AI for user", userId);

        const pgVectorString = await getPgVectorString(message);

        const contextString = await getContextString(pgVectorString);

        const openAiResponse = await getopenAiResponse(contextString, message);

        return openAiResponse;
    } catch (error) {
        logger.error("Error sending message to AI", error);
        throw new Error('Failed to get response from AI');
    }
}