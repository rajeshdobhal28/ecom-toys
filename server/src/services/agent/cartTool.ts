import { tool } from "@langchain/core/tools";
import z from "zod";
import { getCart, updateCart } from "../cartService";

export const cartTool = tool(async ({ userId, action, productId, quantity }) => {
    console.log("[Tool] Cart Service Tool called with action:", action);
    console.log("[Tool] Product ID:", productId);
    console.log("[Tool] Quantity:", quantity);

    if (action === "add") {
        try {
            const currentCart = await getCart(userId);

            const existingItemIndex = currentCart.findIndex((item: any) => item.id === productId);

            const itemsToSave = currentCart.map((item: any) => ({
                id: item.id,
                quantity: item.quantity
            }));

            if (existingItemIndex >= 0) {
                itemsToSave[existingItemIndex].quantity += quantity;
            } else {
                itemsToSave.push({ id: productId, quantity: quantity });
            }

            const resp = await updateCart(userId, itemsToSave);
            return JSON.stringify(resp);
        } catch (error: any) {
            console.error("[Tool Error] Failed to update cart:", error.message);
            return `Error adding to cart: ${error.message}. Please inform the user.`;
        }
    }

    return 'working on it';
},
    {
        name: "cart_service_tool",
        description: "Whenever user wants to add, remove or update items in cart, use this tool.",
        schema: z.object({
            userId: z.string().describe("User ID of the user"),
            action: z.enum(["add", "remove", "update"]),
            productId: z.string().describe("The exact UUID of the product. Do not use random numbers. Use the ID from the product search tool."),
            quantity: z.number().describe("Quantity of the product to be added/removed/updated"),
        })
    })