import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyClient } from "../middlewares/verifyRole.js";
import { getClientSummary, getClientProjects, getClientApplications } from "../controllers/client.controllers.js";

const router = express.Router();

// ✅ Route: Get client summary
router.get("/summary/:id", verifyToken, verifyClient, getClientSummary);

// ✅ Route: Get all projects created by a specific client
router.get("/projects", verifyToken, verifyClient, getClientProjects);

// ✅ Route: Get all applications received on the client’s projects
router.get("/applications", verifyToken, verifyClient, getClientApplications);


export default router;
