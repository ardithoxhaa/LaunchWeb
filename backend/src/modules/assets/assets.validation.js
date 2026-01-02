import { z } from 'zod';

export const listAssetsSchema = z.object({
  body: z.any().optional(),
  query: z.object({
    websiteId: z.coerce.number().int().positive(),
  }),
  params: z.any().optional(),
});

export const uploadAssetSchema = z.object({
  body: z.object({
    websiteId: z.coerce.number().int().positive(),
  }),
  query: z.any().optional(),
  params: z.any().optional(),
});
