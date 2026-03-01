import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";

import { productSearchTool } from "./productTool";
import { checkOrderStatusTool } from "./orderTool";
import { cartTool } from "./cartTool";
import { getAddressTool } from "./addressTool";
import { placeOrderTool } from "./placeOrderTool";

const chatModel = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
});

const tools = [productSearchTool, checkOrderStatusTool, cartTool, getAddressTool, placeOrderTool];

const modelWithTools = chatModel.bindTools(tools);

const callModel = async (state: typeof MessagesAnnotation.State) => {
    console.log("--- N1: Calling the LLM ---");

    const systemPrompt = `You are a helpful customer support assistant for WonderToys. 
        Use your tools to answer questions about products and orders.
        Use cart tool to add, remove or update items in cart. Use product search tool to search for products in order to add them to cart.
        
        CRITICAL RULE: When placing an order, FIRST use get_address_tool. If the user has multiple addresses and hasn't specified which one to use, you MUST ask them which address they want to ship to BEFORE calling place_order_tool.
        CRITICAL RULE: Before placing an order ask for confirmation from the user with details of toys and shipping address.
        CRITICAL RULE: When adding items to the cart, FIRST use search_product to get the exact Product ID. NEVER invent or guess a Product ID.
        CRITICAL RULE: Do not show any kind of uuid / id to user.
        CRITICAL RULE: If any tool returns a string starting with [UI_ACTION:, you MUST append that EXACT tag string to the very end of your message to the user, word for word.

        If a tool returns no info, politely say you don't know based on the current data. 
        Do not make up products, orders, or prices.
        Please beautifully format your responses using Markdown. Use bolding for product names and bullet points for lists.`;

    const response = await modelWithTools.invoke([
        { role: "system", content: systemPrompt },
        ...state.messages,
    ]);

    return { messages: [response] };
}

const toolNode = new ToolNode(tools);


// 4. Define the routing logic
// After the LLM runs, we check its output. Did it decide to call a tool?
const shouldContinue = (state: typeof MessagesAnnotation.State) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    // If the LLM made a tool call (e.g., asked to search products), 
    // we route to the "tools" node.
    if (lastMessage.additional_kwargs?.tool_calls?.length) {
        console.log("--- R1: Routing to Tools ---");
        return "tools";
    }

    // Otherwise, the LLM just gave a conversational answer. 
    // We route to the special END node to finish the graph.
    console.log("--- R1: Routing to END ---");
    return "__end__";
}

const graphBuilder = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

export const chatAgent = graphBuilder.compile();