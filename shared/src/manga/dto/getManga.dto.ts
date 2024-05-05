import { z } from 'zod';
import { createMangaSchema } from './createManga.dto';

export const getMangaSchema = createMangaSchema.extend({
  id: z.string(),
});

export type GetMangaDto = z.infer<typeof getMangaSchema>;
