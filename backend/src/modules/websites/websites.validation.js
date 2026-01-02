import { z } from 'zod';

export const createWebsiteSchema = z.object({
  body: z.object({
    businessId: z.number().int().positive(),
    templateId: z.number().int().positive(),
    name: z.string().min(1).max(160),
    slug: z.string().min(1).max(160).optional(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const updateWebsiteSeoSchema = z.object({
  body: z.object({
    seo: z.record(z.any()),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const updateWebsiteSettingsSchema = z.object({
  body: z.object({
    settings: z.record(z.any()),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});

export const updateWebsiteStructureSchema = z.object({
  body: z.object({
    pages: z.array(
      z.object({
        name: z.string().min(1).max(120),
        path: z.string().min(1).max(200),
        sortOrder: z.number().int().min(0).default(0),
        meta: z.record(z.any()).default({}),
        components: z.array(
          z.object({
            type: z.string().min(1).max(60),
            orderIndex: z.number().int().min(0),
            props: z.record(z.any()).default({}),
            styles: z.record(z.any()).default({}),
          })
        ),
      })
    ),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});
