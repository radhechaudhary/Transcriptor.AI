import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
dotenv.config();

const client = new ChromaClient({
    path: process.env.CHROMA_URL,

})

const collection = await client.getOrCreateCollection({
    name: "meet-chunks",

});

export { collection };