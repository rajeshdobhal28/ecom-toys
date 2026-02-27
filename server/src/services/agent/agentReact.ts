import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { productSearchTool } from "./productTool";
import { checkOrderStatusTool } from "./orderTool";

const chatModel = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
});

const tools = [productSearchTool, checkOrderStatusTool];

export const chatAgent = createReactAgent({
    llm: chatModel,
    tools,
    messageModifier: `You are a helpful, enthusiastic customer support assistant for WonderToys. 
        Always use the provided tools to search for products when the user asks about toys, availability, or prices.
        If the user asks about their orders, use the check_order_status tool.
        
        If a tool returns no info, politely say you don't know based on the current data. 
        Do not make up products, orders, or prices.
        Please beautifully format your responses using Markdown. Use bolding for product names and bullet points for lists.`
});