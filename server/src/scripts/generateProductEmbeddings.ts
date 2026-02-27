import { OpenAIEmbeddings } from "@langchain/openai";
import { query } from "../db";

const embeddingModel = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small'
});

const generateEmbeddings = async () => {
    try {
        console.log("Starting embedding generation...");

        // const { rows: products } = await query("SELECT * FROM products where embedding is NULL");
        const { rows: products } = await query("SELECT * FROM products");

        for (const product of products) {
            const productText = `Toy Name: ${product.name}. 
                Category: ${product.categoryName}. 
                Brand: ${product.brandName}. 
                Price: $${product.price}.
                Description: ${product.description || ""}`;

            const embedding = await embeddingModel.embedQuery(productText);
            console.log("embedding ---->", embedding);
            const pgVectorString = `[${embedding.join(',')}]`;
            console.log("pgVectorString ---->", pgVectorString);

            await query("UPDATE products SET embedding = $1 WHERE id = $2", [pgVectorString, product.id]);
        }
        console.log("All products embedding Done")
        process.exit(0);
    } catch (error) {
        console.error("Error generating embeddings", error);
    }
}

generateEmbeddings();