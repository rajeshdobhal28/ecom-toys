import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import logger from '../utils/logger';
import { getHistory, saveHistory } from './chatService';
import { chatAgent } from './agent/agent';

export const getAgentResponse = async (userId: string, message: string) => {
    try {
        logger.info("Sending message to Langgraph Agent for user", userId);

        const history = await getHistory(userId);

        // Dynamically inject the user ID into the graph's memory for this turn!
        const systemMessage = new SystemMessage(`CRITICAL: The current logged-in user's ID is "${userId}". Whenever a tool requires a userId, you MUST pass this exact ID.`);

        const messages = [systemMessage, ...history, new HumanMessage(message)];

        const agentResponse = await chatAgent.invoke({ messages })

        // console.log("agentResponse.messages ----->", agentResponse.messages);

        const finalMessage = agentResponse.messages[agentResponse.messages.length - 1];
        let agentResponseText = finalMessage.content as string;

        // --- NEW: Manually extract UI Tags from Tool messages ---
        // sometimes the LLM forgets to echo the tag!
        // So we look back through ALL messages the graph just generated
        for (const msg of agentResponse.messages) {
            // Check if this message was a Tool's raw output
            if (msg.name === 'cart_service_tool' || msg._getType() === 'tool') {
                const content = msg.content as string;
                if (content && content.includes('[UI_ACTION:')) {
                    // Find the exact tag using regex
                    const match = content.match(/\[UI_ACTION:[^\]]+\]/);
                    if (match && !agentResponseText.includes(match[0])) {
                        // Forcibly append it to the end of the AI's response text!
                        agentResponseText += ` \n${match[0]}`;
                    }
                }
            }
        }

        history.push(new AIMessage(agentResponseText));

        await saveHistory(userId, history);

        return agentResponseText;
    } catch (err) {
        logger.error("Error getting agent response", err);
        throw new Error("Failed to get agent response from AI");
    }
}