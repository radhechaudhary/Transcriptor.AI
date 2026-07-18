import { meeting_saved } from "./constants.js";
import client from "./redis-client.js";
import db from './database/meet.db.js'
const start = {}
const interval = setInterval(async () => {
    const currentTime = Date.now();
    console.log("heartBeat", currentTime)
    const meetings = await client.keys(`meeting:*`)
    // console.log("meetings", meetings)
    meetings.forEach(async (meeting_id) => {
        // console.log(gmail)
        const meeting = await client.hGetAll(meeting_id);
        console.log("meeting", meeting)
        if (!meeting.end_time || !meeting.start_time) {
            await client.del(meeting_id);
            return;
        }
        if (currentTime - meeting.end_time > 1000000) {
            if (meeting.end_time - meeting.start_time > 200000) {
                if (meeting_saved[meeting.meeting_id]) return;
                meeting_saved[meeting.meeting_id] = true;
                try {
                    await db.query(`INSERT INTO meetings (meeting_id, gmail, duration, date_time, queries) VALUES ($1,$2,$3,$4,$5)`, [meeting.meeting_id, gmail, meeting.end_time - meeting.start_time, new Date().toLocaleString(), 0]);
                    await client.del(meeting_id);
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    });
}, 300000);
export default interval;