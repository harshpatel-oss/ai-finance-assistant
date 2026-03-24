import express from 'express';
import { financeAssistantController } from '../controllers/ai.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route for AI-powered financial insights (authenticated)
router.post('/ai-assistant', verifyJWT, financeAssistantController);
export default router;




