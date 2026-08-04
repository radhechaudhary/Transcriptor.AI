import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import interval from "./heatbeat.js";

console.log("=== Backend started ===");

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://192.168.1.14:5173", "http://dashboard:5173", "http://localhost:5174", "https://meet.google.com", "https://meet-transcriptor.vercel.app"], // frontend URL
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const server = createServer(app);

import uploadChunkRouter from "./routes/upload-chunk.route.js";

app.use("/data", uploadChunkRouter);

import queryRouter from "./routes/query.route.js";

app.use("/chat-query", queryRouter);

import userRouter from "./routes/user.route.js";

app.use("/user", userRouter);

import meetingRouter from "./routes/meeting.route.js";

app.use("/meeting", meetingRouter);

import dashboardRouter from "./routes/dashboard.route.js";

app.use("/dashboard", dashboardRouter);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});