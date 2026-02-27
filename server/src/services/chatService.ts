import logger from "../utils/logger";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { query } from "../db";
import { redisClient, connectRedis } from "../utils/redisClient";

export const chatModel = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    // timeout: 10000,
});

export const embeddingModel = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small'
});

export const getPgVectorString = async (message: string) => {
    const embedding = await embeddingModel.embedQuery(message);
    const pgVectorString = `[${embedding.join(',')}]`;
    return pgVectorString;
}

export const getContextString = async (pgVectorString: string) => {
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

export const getHistory = async (userId: string): Promise<BaseMessage[]> => {
    try {
        await connectRedis();
        const rawHistory = await redisClient.get(`chat_history:${userId}`);
        if (!rawHistory) return [];

        const parsed = JSON.parse(rawHistory);
        return parsed.map((msg: { type: string, content: string }) =>
            msg.type === 'human' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
        );
    } catch (e) {
        logger.error("Error fetching chat history from Redis", e);
        return [];
    }
}

export const saveHistory = async (userId: string, history: BaseMessage[]) => {
    try {
        await connectRedis();
        // Keep only last 10 messages to limit prompt size (5 turns)
        const recentHistory = history.slice(-10);

        const serialized = recentHistory.map(msg => ({
            type: msg instanceof HumanMessage ? 'human' : 'ai',
            content: msg.content
        }));

        // Save with 24 hour expiration (86400 seconds)
        await redisClient.setEx(`chat_history:${userId}`, 60 * 60 * 3, JSON.stringify(serialized));
    } catch (e) {
        logger.error("Error saving chat history to Redis", e);
    }
}

export const getopenAiResponse = async (contextString: string, message: string, history: BaseMessage[]) => {
    const systemPrompt = `You are a helpful, enthusiastic customer support assistant for WonderToys. 
        Use the following product information to answer the user's question. 
        If the user asks for a product you don't see in the context below, politely say you don't have it or don't know. 
        Do not make up products or prices.
        Please beautifully format your responses using Markdown. Use bolding for product names and bullet points for lists.

        AVAILABLE PRODUCTS CONTEXT:
        ${contextString}`;

    const messagesToLLM = [
        new SystemMessage(systemPrompt),
        ...history,
        new HumanMessage(message),
    ];

    const resp = await chatModel.invoke(messagesToLLM);
    return resp.content as string;
}

export const isDbQueryRequired = async (message: string) => {
    const classificationPrompt = `You are a router. Analyze the user's message and determine if they are asking about products, toys, prices, or shopping-related topics.
        If they are, respond with ONLY the word "YES".
        If it is just a greeting (like "hi" or "hello"), general chat, or a question completely unrelated to shopping, respond with ONLY the word "NO".
        User Message: "${message}"`;

    const resp = await chatModel.invoke([new HumanMessage(classificationPrompt)]);
    return (resp.content as string).trim().toUpperCase() === "YES";
}

export const getChatResponse = async (userId: string, message: string) => {
    try {
        logger.info("Sending message to AI for user", userId);

        let contextString = "";
        let dbQueryRequired = await isDbQueryRequired(message);
        if (!dbQueryRequired) {
            logger.info("No DB query required for message", message);
        } else {
            logger.info("DB query required for message", message);
            const pgVectorString = await getPgVectorString(message);
            contextString = await getContextString(pgVectorString);
        }

        // 1. Retrieve user's previous chat history from Redis
        const history = await getHistory(userId);

        // 2. Pass history to the LLM
        const openAiResponse = await getopenAiResponse(contextString, message, history);

        // 3. Save updated history back to Redis
        history.push(new HumanMessage(message));
        history.push(new AIMessage(openAiResponse));
        await saveHistory(userId, history);

        return openAiResponse;
    } catch (error) {
        logger.error("Error sending message to AI", error);
        throw new Error('Failed to get response from AI');
    }
}