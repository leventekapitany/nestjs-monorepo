import { z } from 'zod';

export const isbnSchema = z
  .object({
    isbn: z.string(),
  })
  .required();

export type IsbnDto = z.infer<typeof isbnSchema>;
