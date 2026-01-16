/**
 * AI Chat Controller
 * Handles HTTP requests for AI chat functionality
 */

import { aiChatService } from './aiChat.service.js';
import websitesService from '../websites/websites.service.js';

// Start a new conversation
export async function startConversation(req, res) {
  const userId = req.auth.userId;
  const conversation = await aiChatService.startConversation(userId);
  
  res.status(201).json({
    conversationId: conversation.id,
    messages: conversation.messages,
  });
}

// Send a message to the AI
export async function sendMessage(req, res) {
  const userId = req.auth.userId;
  const { conversationId, message } = req.validated.body;
  
  if (!conversationId || !message) {
    return res.status(400).json({
      error: { message: 'conversationId and message are required' },
    });
  }
  
  const response = await aiChatService.sendMessage(conversationId, message, userId);
  
  res.json({
    message: response.message,
    websiteStructure: response.websiteStructure,
    suggestedActions: response.suggestedActions,
    conversationContext: response.conversationContext,
  });
}

// Get conversation history
export async function getConversation(req, res) {
  const conversationId = req.params.conversationId;
  const messages = aiChatService.getHistory(conversationId);
  
  res.json({ messages });
}

// Create website from AI-generated structure
export async function createWebsiteFromAI(req, res) {
  const userId = req.auth.userId;
  const { businessId, websiteStructure } = req.validated.body;
  
  if (!businessId || !websiteStructure) {
    return res.status(400).json({
      error: { message: 'businessId and websiteStructure are required' },
    });
  }
  
  // Create the website using the AI-generated structure
  const website = await websitesService.createAIWebsite({
    userId,
    businessId,
    name: websiteStructure.name || 'AI Generated Website',
    structure: websiteStructure,
  });
  
  res.status(201).json({ website });
}

// Clear conversation
export async function clearConversation(req, res) {
  const conversationId = req.params.conversationId;
  aiChatService.clearConversation(conversationId);
  
  res.json({ success: true });
}
