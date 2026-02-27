import { OpenAIEmbeddings } from "@langchain/openai";

export const embeddingModel = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small'
});