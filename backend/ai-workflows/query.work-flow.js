import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from "dotenv";
import { tool } from "@langchain/core/tools";
import { StateGraph, START, END, } from "@langchain/langgraph";
import { z } from "zod/v4";
import { collection } from "../db/rag.js";
import db from "../database/meet.db.js";
import getLLM from "./chatModel.js";

dotenv.config();

const llm = getLLM();

const filterResult = (results) => {
    const THRESHOLD = 2;
    if (!results.ids[0].length) {
        console.log("No results found")
        return [];
    }
    let filteredResults = [];
    for (let i = 0; i < results.ids[0].length; i++) {

        const distance = results.distances[0][i];

        if (distance <= THRESHOLD) {

            filteredResults.push({
                id: results.ids[0][i],
                document: results.documents[0][i],
                metadata: results.metadatas[0][i],
                distance,
            });
        }
    }

    return filteredResults;
}

const MessagesState = {

    messages: z.array(z.any()),

    meeting_ids: z.array(z.string()),

    query_type: z.string(),

    rewritten_query: z.string(),

    relevant_chunks: z.array(z.string()),

    context: z.string(),

    llm_response: z.string(),

    gmail: z.string(),

    retrieval_grade: z.string(),

    retrieval_count: z.number().default(0),
};

// const llm = new ChatOpenRouter({
//     model: "poolside/laguna-m.1:free",
//     apiKey: process.env.OPENROUTER_API_KEY,
//     temperature: 0.4,
// });



const extract_query_type = async (state) => {
    // console.log(state.messages)
    try {
        const result = await llm.invoke([
            {
                role: "system",
                content: `Classify the user query into ONE of these labels:

                1. SMALL_TALK
                - greetings
                - hello/hi
                - thanks
                - casual conversation
                - asking today's date/time
                - non-meeting queries

                2. SPECIFIC
                - asks about exact meeting details
                - asks what someone said
                - asks about a topic/person discussed
                - asks factual questions from meeting

                3. GENERAL
                - asks for meeting summary
                - asks for action items
                - asks for high level insights
                - asks for overall discussion

                Return ONLY one word:
                SMALL_TALK
                SPECIFIC
                GENERAL`
            },
            {
                role: "user",
                content: state.messages[state.messages.length - 1].content,
            },
        ])
        // console.log(result['content'])
        state.query_type = result['content']
        console.log("query type", state.query_type)
        state.retrieval_count = 0;
        return state;
    }
    catch (err) {
        console.log("Error in extract_query_type", err);
        return state;
    }
}

const query_type_router = (state) => {
    if (state.query_type === "SPECIFIC") {
        state.retrieval_count = 0;
        return "specific";
    }
    else if (state.query_type === "GENERAL") {
        return "general";
    }
    else {
        return "small_talk";
    }
}

const sepcific_query = async (state) => {
    const meeting_ids = state.meeting_ids;
    const query = [state.rewritten_query || state.messages[state.messages.length - 1].content];
    const results = await collection.query({
        queryTexts: [query],
        nResults: 10,
        include: ["metadatas", "documents", "distances"],
        where: {
            $and: [
                {
                    meeting_id: {
                        $in: meeting_ids
                    }
                },
                {
                    gmail: state.gmail
                }
            ]
        }
    });
    const filteredResult = filterResult(results);
    console.log("filteredResult", filteredResult)
    state.relevant_chunks = filteredResult;

    let context = ""
    for (const chunk of filteredResult) {
        context += chunk.document + "\n";
    }
    state.context = context;
    state.retrieval_count = state.retrieval_count + 1;

    return state;
}

const gradeRetrieval = async (state) => {
    const result = await llm.invoke([
        {
            role: "system",
            content: `
            You are a Retrieval Evaluator for a RAG system.

            Given a QUERY and RETRIEVED DOCUMENTS, decide if the documents are sufficient to
            fully answer the query (relevant + specific + complete enough, no outside knowledge needed).

            If NOT sufficient, rewrite the query to be more specific/keyword-rich for better retrieval.

            QUERY: ${state.messages[state.messages.length - 1].content}
            DOCUMENTS: ${state.context}

            Respond ONLY in this JSON format:
            {
            "verdict": "GOOD" | "BAD",
            "reasoning": "<1 sentence why>",
            "rewritten_query": "<better query, or null if GOOD>"
            }`
        }
    ])
    state.retrieval_grade = JSON.parse(result['content']).verdict;
    state.rewritten_query = JSON.parse(result['content']).rewritten_query;
    return state;
}

const retrieve_router = (state) => {

    if (state.retrieval_grade === "GOOD") {
        return "llm_call";
    }
    else if (state.retrieval_count >= 3) {
        return "end";
    }
    else {
        return "specific_query";
    }
}

const end_retrieval = async (state) => {
    state.context = null;
    return state;
}

const general_query = async (state) => {
    const meeting_ids = state.meeting_ids;
    console.log("meeting ids", meeting_ids)
    var context = ""
    for (const meeting_id of meeting_ids) {
        const result = await db.query("select * from chunk_summaries where meeting_id = $1", [meeting_id + " " + state.gmail]);
        for (const row of result.rows) {
            context += `sequence ${row.sequence_number} : summary: ${row.summary}`
        }
    }
    state.context = context;
    return state;
}

const small_talk = async (state) => {
    const query = state.messages[state.messages.length - 1].content;
    const result = await llm.invoke([
        ...state.messages
    ])
    state.llm_response = result['content']
    return state;
}

const llm_call = async (state) => {
    const result = await llm.invoke([
        {
            role: "system",
            content: `You are an AI meeting assistant.

                    Your primary task is to answer questions about a meeting using the provided meeting context.

                    Guidelines:
                    1. Use the meeting context as the main source of truth.
                    2. If the answer exists in the context, answer accurately and concisely.
                    3. If the context is incomplete or unrelated to the user’s question, you may answer using your general knowledge.
                    4. Clearly separate inferred/general answers from meeting-specific information when necessary.
                    5. Do not hallucinate details that are not present in the meeting context.
                    6. Maintain a natural conversational tone.

                    Meeting Context:
                    ${state.context || "No relevant meeting context available."}

                    User Question:
                    ${state.messages[state.messages.length - 1].content}

                    Answer:`,
        },
        ...state.messages
    ])
    state.llm_response = result['content']
    return state;
}


const agent = new StateGraph({ channels: MessagesState })
    .addNode("extract_query_type", extract_query_type)
    .addNode("specific_query", sepcific_query)
    .addNode("general_query", general_query)
    .addNode("small_talk", small_talk)
    .addNode("llm_call", llm_call)
    .addNode("grade_retrieval", gradeRetrieval)
    .addNode("end_retrieval", end_retrieval)
    .addEdge(START, "extract_query_type")
    .addConditionalEdges("extract_query_type", query_type_router, { specific: "specific_query", general: "general_query", small_talk: "small_talk" })
    .addEdge("specific_query", "grade_retrieval")
    .addConditionalEdges("grade_retrieval", retrieve_router, { llm_call: "llm_call", specific_query: "specific_query", end: "end_retrieval" })
    .addEdge("end_retrieval", "llm_call")
    .addEdge("general_query", "llm_call")
    .addEdge("small_talk", END)
    .addEdge("llm_call", END)


const compiled_agent = agent.compile();

// compiled_agent.invoke({
//     meeting_id: "gtth-454-fhh4",
//     message: "What is summary of meeting?",
// }).then((result) => {
//     console.log(result)
// })



export { compiled_agent };



