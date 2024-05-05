import { z } from 'zod';

export const accessTokenPayloadSchema = z
  .object({
    userId: z.string(),
    username: z.string(),
  })
  .required();

export type AccessTokenPayloadDto = z.infer<typeof accessTokenPayloadSchema>;
