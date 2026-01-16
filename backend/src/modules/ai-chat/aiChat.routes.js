/**
 * AI Chat Routes
 */

import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';

import {
  sendMessageSchema,
  createWebsiteFromAISchema,
} from './aiChat.validation.js';

import {
  startConversation,
  sendMessage,
  getConversation,
  createWebsiteFromAI,
  clearConversation,
} from './aiChat.controller.js';

const router = Router();

router.use(requireAuth);

// Start a new conversation
router.post('/conversations', asyncHandler(startConversation));

// Send a message
router.post('/messages', validate(sendMessageSchema), asyncHandler(sendMessage));

// Get conversation history
router.get('/conversations/:conversationId', asyncHandler(getConversation));

// Create website from AI structure
router.post('/create-website', validate(createWebsiteFromAISchema), asyncHandler(createWebsiteFromAI));

// Clear conversation
router.delete('/conversations/:conversationId', asyncHandler(clearConversation));

export default router;
