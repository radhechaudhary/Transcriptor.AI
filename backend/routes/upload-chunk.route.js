import { Router } from "express";
import { uploadChunk } from "../controllers/upload-chunk.controller.js";
import { verifySession } from "../middlewares/verifySession.middleware.js";

const router = Router();

router.post("/upload-chunk", verifySession, uploadChunk);

export default router;
