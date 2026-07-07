import { collection } from "../db/rag.js";
import { compiled_agent } from "../ai-workflows/query.work-flow.js";

const filterResult = (results) => {
    const THRESHOLD = 1.3;
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

const query = async (req, res) => {
    const { meeting_ids } = req.body;
    const { messages } = req.body;

    if (!meeting_ids || meeting_ids.length == 0) {
        return res.status(200).json({ message: "Meeting id is required", response: "Please select at least one meeting from where I can fetch the data." });
    }

    if (!messages) {
        return res.status(400).json({ message: "Messages is required" });
    }
    try {
        const stream = await compiled_agent.stream({
            meeting_ids: meeting_ids,
            messages: messages,
            gmail: req.user.gmail
        }, {
            streamMode: "messages"
        })
        var i = 0;
        for await (const chunk of stream) {
            // console.log(chunk[1].langgraph_node)
            if (chunk[1].langgraph_node !== "extract_query_type" && chunk[1].langgraph_node !== "grade_retrieval") res.write(chunk[0].content)

        }

        res.end();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export { query }