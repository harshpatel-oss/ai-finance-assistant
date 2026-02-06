import express from 'express';
import { financeAssistantController } from '../controllers/ai.controller.js';

const router = express.Router();

// Route for AI-powered financial insights
router.post('/ai-assistant', financeAssistantController);  
export default router;




