import { z } from 'zod';

export const getAuthorSchema = z.object({
  key: z.string(),
  name: z.string(),
  bio: z.string().optional(),
  personal_name: z.string().optional(),
  birth_date: z.string().optional(),
  death_date: z.string().optional(),
  photos: z.array(z.number()).optional(),
});

export type GetAuthorDto = z.infer<typeof getAuthorSchema>;
