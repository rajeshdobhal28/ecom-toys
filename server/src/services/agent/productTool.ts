import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { query } from '../../db';
import { embeddingModel } from './utils';

export const productSearchTool = tool(async ({ searchQuery }) => {
    console.log(`[Tool] Searching for products related to: "${searchQuery}"`);

    const embedding = await embeddingModel.embedQuery(searchQuery);
    const pgVectorString = `[${embedding.join(',')}]`;

    const { rows: matchedProducts } = await query(`
        SELECT id, name, description, "category", "brand", price 
        FROM products 
        ORDER BY embedding <=> $1
        LIMIT 3;
    `, [pgVectorString]);

    if (!matchedProducts.length) {
        return "No matching products found in the database."
    }

    return matchedProducts.map(p =>
        `- ${p.name} ($${p.price}) in ${p.category} by ${p.brand}: ${p.description || "No description"}`
    ).join("\n");
},
    {
        name: "search_product",
        description: "Call this tool to search the database for toys/products related to the user's query. Always use this to check our inventory before answering questions about product availability or prices.",
        schema: z.object({
            searchQuery: z.string().describe("The search term or phsrase to look for products. e.g. 'educational toys', 'Lego', or 'cheap action figures'."),
        }),
    }
)