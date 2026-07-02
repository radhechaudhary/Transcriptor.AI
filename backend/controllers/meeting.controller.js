import { meeting_saved } from "../constants.js";
import db from "../database/meet.db.js";
import getLLM from "../ai-workflows/chatModel.js";
import client from "../redis-client.js";


const startMeeting = async (req, res) => {
    var { meeting_id } = req.body;
    if (!meeting_id) {
        return res.status(400).json({
            success: false,
            message: "Meeting ID is required"
        })
    }

    meeting_id = meeting_id + " " + req.user.gmail;
    if (meeting_saved[meeting_id]) {
        return res.status(400).json({
            success: false,
            message: "Meeting is already saved"
        })
    }
    const current_meeting = await client.exists(`meeting:${req.user.gmail}`);
    if (current_meeting !== 0) {
        await client.hSet(`meeting:${req.user.gmail}`,
            'status',
            "active"
        );
        console.log("meeting resumed");
        return res.status(200).json({
            success: true,
            message: "Meeting resumed"
        })
    }
    await client.hSet(`meeting:${req.user.gmail}`, {
        'status': "active",
        "meeting_id": meeting_id,
        "start_time": Date.now(),
        "name": meeting_id.split(" ")[0],
    }
    );
    console.log("meeting started");
    return res.status(200).json({
        success: true,
        message: "Meeting started"
    })
}

const endMeeting = async (req, res) => {

    var { meeting_id } = req.body;
    if (!meeting_id) {
        return res.status(400).json({
            success: false,
            message: "Meeting ID is required"
        })
    }
    meeting_id = meeting_id + " " + req.user.gmail;
    var current_meeting = await client.exists(`meeting:${req.user.gmail}`);
    if (!current_meeting) {
        return res.status(400).json({
            success: false,
            message: "No active meeting"
        })
    }
    current_meeting = await client.hGetAll(`meeting:${req.user.gmail}`);
    console.log(current_meeting)
    if (!current_meeting.start_time || !current_meeting.end_time) {
        await client.del(`meeting:${req.user.gmail}`);
        delete meeting_status[meeting_id];
        return res.status(400).json({
            success: false,
            message: "Not recorded till now"
        })
    }
    console.log("meeting ended")
    meeting_saved[meeting_id] = true;
    current_meeting = await client.hGetAll(`meeting:${req.user.gmail}`);
    const duration = Date.now() - parseInt(current_meeting.start_time);

    try {
        var context = ""
        // console.log(meeting_id)
        const result = await db.query("select * from chunk_summaries where meeting_id = $1", [meeting_id]);
        for (const row of result.rows) {
            context += `sequence ${row.sequence_number} : summary: ${row.summary} //`
        }
        const llm = getLLM()
        // console.log(context)
        const llm_response = await llm.invoke(`You are a meeting summarizer.
            Analyze the meeting transcript and return ONLY valid JSON.
            Transcript:
            ${context}
            Schema:
            {
            "insights": ["string"],
            "decisions_made": ["string"],
            "topics": ["string"],
            "summary": "string"
            }

            Return only the JSON object. No markdown. No explanations.
            `);
        console.log("llm_response", llm_response)
        const summaryData = JSON.parse(llm_response.text)
        const { insights, decisions_made, topics, summary } = summaryData;
        await db.query('INSERT INTO meeting_info (meeting_id, gmail, insights, decisions_made, topics, summary) VALUES ($1,$2,$3,$4,$5,$6)', [meeting_id.split(" ")[0], req.user.gmail, insights, decisions_made, topics, summary]);
        await db.query(`INSERT INTO meetings (meeting_id, gmail, name,   duration, date_time, queries) VALUES ($1,$2,$3,$4,$5,$6)`, [meeting_id.split(" ")[0], req.user.gmail, meeting_name[meeting_id] || meeting_id.split(" ")[0], duration, new Date().toLocaleString(), 0]);
        await db.query(`UPDATE users SET meetings = meetings + 1 WHERE gmail = $1`, [req.user.gmail]);
        await client.del(`meeting:${req.user.gmail}`);
    }
    catch (err) {
        console.log(err)
    }
    return res.status(200).json({
        success: true,
        message: "Meeting ended"
    })
}

const pauseMeeting = async (req, res) => {
    var { meeting_id } = req.body;
    if (!meeting_id) {
        return res.status(400).json({
            success: false,
            message: "Meeting ID is required"
        })
    }
    if (!meeting_id) {
        return res.status(400).json({
            success: false,
            message: "Meeting ID is required"
        })
    }
    var current_meeting = await client.exists(`meeting:${req.user.gmail}`);
    if (!current_meeting) {
        return res.status(400).json({
            success: false,
            message: "No active meeting"
        })
    }
    meeting_id = meeting_id + " " + req.user.gmail;
    current_meeting = await client.hGetAll(`meeting:${req.user.gmail}`);
    if (current_meeting.status === "paused") {
        return res.status(400).json({
            success: false,
            message: "Meeting is already paused"
        })
    }
    await client.hSet(`meeting:${req.user.gmail}`, "status", "paused");
    console.log("meeting paused")
    return res.status(200).json({
        success: true,
        message: "Meeting paused"
    })
}

export { startMeeting, endMeeting, pauseMeeting }