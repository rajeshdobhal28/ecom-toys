import { tool } from "@langchain/core/tools";
import { z } from "zod";
import logger from "../../utils/logger";
import { getOrders } from "../orderService";


export const checkOrderStatusTool = tool(async ({ userId }) => {
    console.log(`[Tool] Checking order status for user: ${userId}`);

    try {
        const orders = await getOrders(userId);
        if (!orders || orders.length === 0) {
            return "You do not have any recent orders.";
        }

        return orders.map((o: any) =>
            `- Order ID: ${o.id}, Status: ${o.status}, Product: ${o.product_name} (Qty: ${o.quantity}), Total: $${o.total_price}, Date: ${new Date(o.created_at).toLocaleDateString()}`
        ).join("\n");

    } catch (err) {
        logger.error("Error checking order status", err);
        return "I'm sorry, I encountered an error while trying to fetch your orders.";
    }
}, {
    name: "check_order_status",
    description: "Call this tool when the user asks about their recent orders, order history, or the status of a specific purchase. You MUST pass the user's ID to this tool.",
    schema: z.object({
        userId: z.string().describe("The ID of the user asking about their orders")
    })
})