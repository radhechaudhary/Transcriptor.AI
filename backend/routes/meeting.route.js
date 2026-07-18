import { Router } from "express";
import { startMeeting, endMeeting, pauseMeeting } from "../controllers/meeting.controller.js";
const router = Router();
import { verifySession } from "../middlewares/verifySession.middleware.js";

router.post("/start-meeting", verifySession, startMeeting);
router.post("/end-meeting", verifySession, endMeeting);
router.post("/pause-meeting", verifySession, pauseMeeting);

export default router;