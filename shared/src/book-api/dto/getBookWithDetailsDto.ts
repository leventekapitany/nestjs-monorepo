import { z } from 'zod';
import { PHYSICAL_FORMAT } from '../../manga/manga.enum';
import { getAuthorSchema } from './getAuthorDto';
import { getBookSchema } from './getBookDto';

export const getBookWithDetailsSchema = getBookSchema.extend({
  covers: z.array(z.string()),
  authors: z.array(getAuthorSchema),
  physical_format: z.nativeEnum(PHYSICAL_FORMAT),
});

export type GetBookWithDetailsDto = z.infer<typeof getBookWithDetailsSchema>;
