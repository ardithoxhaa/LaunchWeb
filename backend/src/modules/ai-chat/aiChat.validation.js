/**
 * AI Chat Validation Schemas
 */

import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().min(1),
    message: z.string().min(1).max(5000),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const createWebsiteFromAISchema = z.object({
  body: z.object({
    businessId: z.number().int().positive(),
    websiteStructure: z.object({
      name: z.string().min(1).max(160),
      industry: z.string().optional(),
      colors: z.record(z.any()).optional(),
      designSystem: z.record(z.any()).optional(),
      pages: z.array(z.object({
        name: z.string(),
        path: z.string(),
        sortOrder: z.number().optional(),
        meta: z.record(z.any()).optional(),
        components: z.array(z.object({
          type: z.string(),
          orderIndex: z.number(),
          props: z.record(z.any()).optional(),
          styles: z.record(z.any()).optional(),
        })),
      })),
      seo: z.record(z.any()).optional(),
    }),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});
