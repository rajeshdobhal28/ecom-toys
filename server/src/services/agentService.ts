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
        const agentResponseText = finalMessage.content as string;

        history.push(new AIMessage(agentResponseText));

        await saveHistory(userId, history);

        return agentResponseText;
    } catch (err) {
        logger.error("Error getting agent response", err);
        throw new Error("Failed to get agent response from AI");
    }
}