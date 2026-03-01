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
            return `Successfully updated the cart! [UI_ACTION:CART_UPDATED] \n\n DB Response: ${JSON.stringify(resp)}`;
        } catch (error: any) {
            console.error("[Tool Error] Failed to update cart:", error.message);
            return `Error adding to cart: ${error.message}. Please inform the user.`;
        }
    } else if (action === "remove") {
        try {
            const currentCart = await getCart(userId);
            const itemsToSave = currentCart
                .filter((item: any) => item.id !== productId)
                .map((item: any) => ({
                    id: item.id,
                    quantity: item.quantity
                }));

            const resp = await updateCart(userId, itemsToSave);
            return `Successfully removed the item from the cart! [UI_ACTION:CART_UPDATED] \n\n DB Response: ${JSON.stringify(resp)}`;
        } catch (error: any) {
            console.error("[Tool Error] Failed to remove from cart:", error.message);
            return `Error removing from cart: ${error.message}. Please inform the user.`;
        }
    } else if (action === "update") {
        try {
            const currentCart = await getCart(userId);
            const itemsToSave = currentCart.map((item: any) => ({
                id: item.id,
                quantity: item.quantity
            }));

            const existingItemIndex = itemsToSave.findIndex((item: any) => item.id === productId);
            if (existingItemIndex >= 0) {
                if (quantity <= 0) {
                    itemsToSave.splice(existingItemIndex, 1);
                } else {
                    itemsToSave[existingItemIndex].quantity = quantity;
                }
            } else if (quantity > 0) {
                itemsToSave.push({ id: productId, quantity: quantity });
            }

            const resp = await updateCart(userId, itemsToSave);
            return `Successfully updated the cart! [UI_ACTION:CART_UPDATED] \n\n DB Response: ${JSON.stringify(resp)}`;
        } catch (error: any) {
            console.error("[Tool Error] Failed to update cart:", error.message);
            return `Error updating cart: ${error.message}. Please inform the user.`;
        }
    } else if (action === "clear") {
        try {
            console.log("[Tool] Cart Service Tool called with action: clear");
            const resp = await updateCart(userId, []);
            return `Successfully cleared the cart! [UI_ACTION:CART_UPDATED] \n\n DB Response: ${JSON.stringify(resp)}`;
        } catch (error: any) {
            console.error("[Tool Error] Failed to clear cart:", error.message);
            return `Error clearing cart: ${error.message}. Please inform the user.`;
        }
    }

    return 'working on it';
},
    {
        name: "cart_service_tool",
        description: "Whenever user wants to add, remove or update items in cart, use this tool.",
        schema: z.object({
            userId: z.string().describe("User ID of the user"),
            action: z.enum(["add", "remove", "update", "clear"]),
            productId: z.string().describe("The exact UUID of the product. Do not use random numbers. Use the ID from the product search tool."),
            quantity: z.number().describe("Quantity of the product to be added/removed/updated"),
        })
    })