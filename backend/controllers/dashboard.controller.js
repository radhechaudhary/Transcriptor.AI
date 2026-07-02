import db from "../database/meet.db.js";
import { meeting_saved } from "../constants.js";
import { collection } from "../db/rag.js";
import client from "../redis-client.js";

const fetchDashBoardInfo = async (req, res) => {
    try {
        const { gmail } = req.user;
        if (!gmail) {
            return res.status(400).json({
                success: false,
                message: "Gmail is required"
            })
        }
        // console.log("request_recieved", req.user)
        const meetingInfo = await db.query("SELECT meeting_id, name, date_time, duration FROM meetings WHERE gmail = $1  ", [gmail]);
        // console.log(meetingInfo.rows)
        const userInfo = await db.query("SELECT name, meetings, queries FROM users WHERE gmail = $1", [gmail]);
        let availableMeetings = 0;
        let total_queries = userInfo.rows[0].queries || 0;
        let total_meetings = userInfo.rows[0].meetings || 0;
        if (meetingInfo.rows.length > 0) {
            availableMeetings = meetingInfo.rows.length;

        }
        var currentMeeting = null;
        var current_recording = await client.hGetAll(`meeting:${req.user.gmail}`);
        console.log(current_recording)
        if (current_recording) {
            currentMeeting = { status: current_recording.status, name: current_recording.name, meeting_id: current_recording.meeting_id, duration: current_recording.end_time - current_recording.start_time }
        }
        return res.status(200).json({
            success: true,
            message: "Dashboard info fetched successfully",
            data: { total_meetings: total_meetings, queryMade: total_queries, availableMeetings: availableMeetings, meetings: meetingInfo.rows, currentMeeting }
        })
    } catch (error) {
        console.log("error_recieved", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const editCurrentMeetingName = async (req, res) => {
    var { meeting_id, name } = req.body;
    const gmail = req.user.gmail;
    if (!meeting_id || !name || !gmail) {
        return res.status(400).json({
            success: false,
            message: "Meeting ID and name and gmail is required"
        })
    }
    meeting_id = meeting_id + " " + gmail;
    var current_recording = await client.exists(`meeting:${req.user.gmail}`);
    if (!current_recording) {
        return res.status(400).json({
            success: false,
            message: "No active meeting"
        })
    }
    current_recording = await client.hGetAll(`meeting:${req.user.gmail}`);
    await client.hSet(`meeting:${req.user.gmail}`, "name", name);
    return res.status(200).json({
        success: true,
        message: "Meeting name edited successfully"
    })
}

const editMeetingName = async (req, res) => {
    var { meeting_id, name } = req.body;
    if (!meeting_id || !req.user.gmail) {
        return res.status(400).json({
            success: false,
            message: "Meeting ID and gmail is required"
        })
    }

    // if (!meeting_saved[meeting_id]) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "No active meeting"
    //     })
    // }
    try {
        await db.query(`UPDATE meetings SET name = $1 WHERE meeting_id = $2 and gmail = $3`, [name, meeting_id.split(" ")[0], req.user.gmail]);
        // delete meeting_saved[meeting_id];
        // delete meeting_name[meeting_id];
    }
    catch (err) {
        console.log(err)
    }
    return res.status(200).json({
        success: true,
        message: "Meeting name edited successfully"
    })
}

const fetchMeetingInfo = async (req, res) => {
    const meeting_id = req.params.meeting_id
    const gmail = req.user.gmail;
    if (!meeting_id || !gmail) {
        return res.status(400).json({
            success: false,
            message: "Meeting ID and gmail is required"
        })
    }
    try {
        const data = await db.query('select insights, topics, decisions_made, summary from meeting_info where meeting_id = $1 and gmail = $2', [meeting_id, gmail]);
        const meeting_info = await db.query("SELECT name, date_time, duration FROM meetings WHERE gmail = $1 and meeting_id = $2  ", [gmail, meeting_id]);
        // Fetch transcript chunks from ChromaDB
        let transcript = "";
        try {
            const chromaRes = await collection.get({
                where: {
                    $and: [
                        {
                            meeting_id: meeting_id
                        },
                        {
                            gmail: gmail
                        }
                    ]
                }
            });
            if (chromaRes && chromaRes.documents && chromaRes.documents.length > 0) {
                const sortedChunks = chromaRes.documents
                    .map((doc, idx) => ({
                        document: doc,
                        metadata: chromaRes.metadatas[idx]
                    }))
                    .sort((a, b) => (a.metadata?.startTime || 0) - (b.metadata?.startTime || 0));

                transcript = sortedChunks.map(c => c.document).join("\n");
            }
        } catch (chromaErr) {
            console.log("Error fetching transcript from ChromaDB:", chromaErr);
        }

        return res.status(200).json({ ...data.rows[0], ...meeting_info.rows[0], transcript })
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

const delete_meeting = async (req, res) => {
    const { meeting_id } = req.params;
    const { gmail } = req.user;
    if (!meeting_id || !gmail) {
        return res.status(400).json({
            success: false,
            message: "Meeting ID and gmail is required"
        })
    }
    try {
        await db.query(' delete from meetings where gmail = $1 and meeting_id = $2', [gmail, meeting_id])
        await db.query(' delete from meeting_info where gmail = $1 and meeting_id = $2', [gmail, meeting_id])
        await db.query('update users set meetings = meetings-1 where gmail = $1', [gmail])
        const meeting_id = meeting_id + " " + gmail
        if (meeting_saved[meeting_id]) delete meeting_saved[meeting_id]
        res.status(200).json({ status: true })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ status: false })
    }
}

export { fetchDashBoardInfo, editCurrentMeetingName, editMeetingName, fetchMeetingInfo, delete_meeting }