import { meeting_saved } from "./constants.js";
import client from "./redis-client.js";
import db from './database/meet.db.js'
const start = {}
const interval = setInterval(async () => {
    const currentTime = Date.now();
    console.log("heartBeat", currentTime)
    const meetings = await client.keys(`meeting:*`)
    meetings.forEach(async (gmail) => {
        const meeting = await client.hGetAll(`meeting:${gmail}`);
        if (!meeting.end_time || !meeting.start_time) {
            if (!start[meeting.meeting_id]) {
                start[meeting.meeting_id] = currentTime;
            } else if (currentTime - start[meeting.meeting_id] > 400000) {
                delete start[meeting.meeting_id];
                await client.del(`meeting:${gmail}`);
            }
            return;
        }
        if (currentTime - meeting.end_time > 1000000) {
            if (meeting.end_time - meeting.start_time > 200000) {
                if (meeting_saved[meeting.meeting_id]) return;
                meeting_saved[meeting.meeting_id] = true;
                if (start[meeting.meeting_id]) {
                    delete start[meeting.meeting_id];
                }
                try {
                    await db.query(`INSERT INTO meetings (meeting_id, gmail, duration, date_time, queries) VALUES ($1,$2,$3,$4,$5)`, [meeting.meeting_id, gmail, meeting.end_time - meeting.start_time, new Date().toLocaleString(), 0]);
                    await client.del(`meeting:${gmail}`);
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    });
}, 300000);
export default interval;