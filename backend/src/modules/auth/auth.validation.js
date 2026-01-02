import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72),
    name: z.string().min(1).max(120),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1).max(72),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const refreshSchema = z.object({
  body: z.object({}).optional().default({}),
  query: z.any().optional(),
  params: z.any().optional(),
});
