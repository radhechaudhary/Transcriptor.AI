import { Router } from "express";
import { startMeeting, endMeeting, pauseMeeting, resumeMeeting } from "../controllers/meeting.controller.js";
const router = Router();
import { verifySession } from "../middlewares/verifySession.middleware.js";

router.post("/start-meeting", verifySession, startMeeting);
router.post("/end-meeting", verifySession, endMeeting);
router.post("/pause-meeting", verifySession, pauseMeeting);
router.post("/resume-meeting", verifySession, resumeMeeting);

export default router;