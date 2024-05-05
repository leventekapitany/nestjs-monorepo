import { Types } from 'mongoose';
import { z } from 'zod';
import { createAuthorSchema } from '../../author/dto/createAuthor.dto';
import { updateAuthorSchema } from '../../author/dto/updateAuthor.dto';
import { Language, PHYSICAL_FORMAT, Status } from '../manga.enum';

export const createMangaSchema = z.object({
  title: z.string(),
  isbn_10: z.string().optional(),
  isbn_13: z.string().optional(),
  publishers: z.string().array(),
  authors: z.array(createAuthorSchema.or(updateAuthorSchema)),
  covers: z.string().array().optional(),
  publish_date: z.string(), // TODO: date type
  weight: z.string().optional(),
  physical_format: z.nativeEnum(PHYSICAL_FORMAT).optional(),
  number_of_pages: z.number(),
  notes: z.string().optional(),
  volume: z.string().optional(),
  languages: z.nativeEnum(Language).array(),
  status: z.nativeEnum(Status),
  comment: z.string().optional(),
  borrowed_to: z
    .string()
    .transform((x) => new Types.ObjectId(x))
    .optional(),
});

export type CreateMangaDto = z.infer<typeof createMangaSchema>;
