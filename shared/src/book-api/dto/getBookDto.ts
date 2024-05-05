import { z } from 'zod';

export const getBookSchema = z.object({
  key: z.string(),
  title: z.string(),
  publishers: z.array(z.string()).optional(),
  authors: z.array(z.object({ key: z.string() })),
  publish_date: z.string(),
  number_of_pages: z.number(),
  weight: z.string().optional(),
  physical_format: z.string().optional(),
  covers: z.array(z.number()).optional(),
  languages: z.array(z.object({ key: z.string() })).optional(),
  notes: z
    .string()
    .or(z.object({ type: z.string(), value: z.string() }))
    .optional(),
  isbn_10: z.array(z.string()).optional(),
  isbn_13: z.array(z.string()).optional(),
});

export type GetBookDto = z.infer<typeof getBookSchema>;
