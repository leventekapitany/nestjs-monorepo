import { z } from 'zod';

export const userSchema = z
  .object({
    id: z.number(),
    username: z.string(),
  })
  .required();

export type UserDto = z.infer<typeof userSchema>;
