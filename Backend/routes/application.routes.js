import express from 'express';

import { applyToProject, getMyApplications, getProjectApplications, updateApplicationStatus, acceptApplication, rejectApplication } from '../controllers/application.controllers.js';
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyFreelancer, verifyClient } from "../middlewares/verifyRole.js";

const router = express.Router();

router.post("/apply", verifyToken, verifyFreelancer, applyToProject);
router.get("/my", verifyToken, verifyFreelancer, getMyApplications);
router.get("/:projectId", verifyToken, verifyClient, getProjectApplications);
router.patch("/:id/status", verifyToken, verifyClient, updateApplicationStatus);
router.put("/:id/accept", verifyToken, verifyClient, acceptApplication);
router.put("/:id/reject", verifyToken, verifyClient, rejectApplication);

export default router;