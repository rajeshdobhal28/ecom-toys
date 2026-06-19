import { tool } from "@langchain/core/tools";
import z from "zod";
import { query } from "../../db";
import { getCart, updateCart } from "../cartService";
import { createOrder } from "../orderService";
import { getProducts } from "../productService";

export const placeOrderTool = tool(async ({ userId, addressId }) => {
    console.log("[Tool] Place Order Tool called with Address ID:", addressId);

    try {
        // 1. Get the user's cart
        const cartItems = await getCart(userId);

        if (!cartItems || cartItems.length === 0) {
            return "Failed to place order: The user's cart is empty.";
        }

        // Format cart items for the createOrder service
        const items = cartItems.map((item: any) => ({
            productId: item.id,
            quantity: Number(item.quantity),
        }));

        // 2. Get the user's email
        const userRes = await query("SELECT email FROM users WHERE id = $1", [userId]);
        if (userRes.rows.length === 0) {
            return "Failed to place order: Could not find user email.";
        }
        const userEmail = userRes.rows[0].email;

        // 3. Compute the total the same way createOrder snapshots line items
        // (discounted_price falling back to price) so the total matches.
        const dbProducts = await getProducts({ ids: items.map((i: any) => i.productId) }, true);
        const priceMap: Record<string, number> = {};
        dbProducts.forEach((p: any) => {
            priceMap[p.id] = Number(p.discounted_price || p.price);
        });
        const total_price = items.reduce(
            (sum: number, i: any) => sum + (priceMap[i.productId] || 0) * i.quantity,
            0
        );

        // 4. Place the order as Cash on Delivery
        const createdOrder = await createOrder({
            userId,
            userEmail,
            addressId,
            items,
            total_price,
            status: "Processing",
            payment_status: "processing",
            payment_gateway: "COD",
            payment_order_id: `cod_${Date.now()}`,
        });

        // 5. Clear the cart after successful order placement
        await updateCart(userId, []);

        return `Successfully placed the order (Cash on Delivery)! Order ID: ${createdOrder.id}. Total: ₹${total_price.toFixed(2)}. The user's cart has been cleared.`;
    } catch (error: any) {
        console.error("[Tool Error] Failed to place order:", error);
        return `Failed to place order: ${error.message}`;
    }
},
    {
        name: "place_order_tool",
        description: "Call this tool to place an order for the items currently in the user's cart. You MUST have a valid address ID to use this tool.",
        schema: z.object({
            userId: z.string().describe("User ID of the user"),
            addressId: z.string().describe("The exact UUID of the shipping address. Use the get_address_tool to find this first.")
        })
    });
