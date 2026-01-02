import { z } from 'zod';

export const createTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(120),
    category: z.string().min(1).max(80),
    previewImageUrl: z.string().url().max(512).nullable().optional(),
    structure: z.record(z.any()),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const templateIdParamSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const updateTemplateSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).max(120).optional(),
      category: z.string().min(1).max(80).optional(),
      previewImageUrl: z.string().url().max(512).nullable().optional(),
      structure: z.record(z.any()).optional(),
    })
    .refine((b) => Object.keys(b).length > 0, 'No fields to update'),
  query: z.any().optional(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const userIdParamSchema = z.object({
  body: z.any().optional(),
  query: z.any().optional(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(['ADMIN', 'USER']),
  }),
  query: z.any().optional(),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
