import { z } from 'zod';

export const createBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(160),
    industry: z.string().min(1).max(80).optional().nullable(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});
