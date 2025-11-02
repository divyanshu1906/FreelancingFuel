import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyFreelancer } from "../middlewares/verifyRole.js";
import { getFreelancerSummary, getAssignedProjects, getMyApplications } from "../controllers/freelancer.controllers.js";

const router = express.Router();

router.get("/summary", verifyToken, verifyFreelancer, getFreelancerSummary);
router.get("/projects", verifyToken, verifyFreelancer, getAssignedProjects);
router.get("/applications", verifyToken, verifyFreelancer, getMyApplications);

export default router;
