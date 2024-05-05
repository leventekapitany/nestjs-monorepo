import { z } from 'zod';
import { createMangaSchema } from './createManga.dto';

export const updateMangaSchema = createMangaSchema.extend({
  id: z.string(),
});

export type UpdateMangaDto = z.infer<typeof updateMangaSchema>;
