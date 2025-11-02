import express from 'express';

import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from '../controllers/project.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyClient, verifyFreelancer } from '../middlewares/verifyRole.js';

const router = express.Router();

router.post('/create', verifyToken, createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;