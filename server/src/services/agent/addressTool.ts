import { tool } from "@langchain/core/tools";
import z from "zod";
import { getAddresses } from "../addressService";

export const getAddressTool = tool(async ({ userId }) => {
    console.log("[Tool] Get Address Tool called for user:", userId);

    try {
        const addresses = await getAddresses(userId);

        if (!addresses || addresses.length === 0) {
            return "No saved addresses found for this user.";
        }

        // Format addresses for the LLM
        return addresses.map((addr: any) =>
            `- Address Details: ${addr.full_name}, ${addr.address}, ${addr.city}, ${addr.state} ${addr.pincode} (Phone: ${addr.phone_number}) ${addr.is_default ? '(DEFAULT)' : ''}\n   Secret_Address_ID_Do_Not_Show_User: ${addr.id}`
        ).join("\n\n");

    } catch (error: any) {
        console.error("[Tool Error] Failed to get addresses:", error.message);
        return `Error fetching addresses: ${error.message}`;
    }
},
    {
        name: "get_address_tool",
        description: "Call this tool to get the user's saved shipping addresses. Use this whenever you need an address ID to place an order.",
        schema: z.object({
            userId: z.string().describe("User ID of the user"),
        })
    });
