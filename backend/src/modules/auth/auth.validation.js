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

export const updateProfileSchema = z.object({
  body: z
    .object({
      email: z.string().email().max(255).optional(),
      name: z.string().min(1).max(120).optional(),
    })
    .refine((b) => Object.keys(b).length > 0, 'No fields to update'),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1).max(72),
    newPassword: z.string().min(8).max(72),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const logoutAllSchema = z.object({
  body: z.object({}).optional().default({}),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const bootstrapAdminSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72),
    name: z.string().min(1).max(120),
    bootstrapSecret: z.string().min(1),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});
