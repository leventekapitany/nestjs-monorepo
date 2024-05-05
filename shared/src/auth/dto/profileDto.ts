import { z } from 'zod';

export const profileSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    id: z.string(),
  })
  .required();

export type ProfileDto = z.infer<typeof profileSchema>;
