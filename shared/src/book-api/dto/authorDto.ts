import { z } from 'zod';

export const authorSchema = z
  .object({
    key: z.string(),
  })
  .required();

export type AuthorDto = z.infer<typeof authorSchema>;
